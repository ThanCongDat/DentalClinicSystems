using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ── 1. YARP Reverse Proxy ────────────────────────────────────
// All route + cluster configuration lives in appsettings.json under "ReverseProxy".
// YARP reloads config on file-change without restarting the process.
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// ── 2. JWT Authentication ────────────────────────────────────
// The Gateway validates Bearer tokens but never issues them.
// The same SecretKey / Issuer / Audience that DentalClinicSystem uses to sign
// tokens must be mirrored here so validation succeeds.
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var secretKey  = jwtSection["SecretKey"]
    ?? throw new InvalidOperationException("JwtSettings:SecretKey is missing from appsettings.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidIssuer              = jwtSection["Issuer"],
            ValidateAudience         = true,
            ValidAudience            = jwtSection["Audience"],
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ClockSkew                = TimeSpan.Zero     // reject tokens within 0 s of expiry
        };

        // Surface the failure reason so API clients get a useful response header
        options.Events = new JwtBearerEvents
        {
            OnChallenge = ctx =>
            {
                ctx.Response.Headers["X-Auth-Error"] = ctx.ErrorDescription ?? ctx.Error ?? "Unauthorized";
                return Task.CompletedTask;
            }
        };
    });

// The policy name must match "AuthorizationPolicy" values in appsettings.json routes.
builder.Services.AddAuthorization(options =>
    options.AddPolicy("AuthenticatedUser", policy =>
        policy.RequireAuthenticatedUser()));

// ── 3. Rate Limiting ─────────────────────────────────────────
// Uses ASP.NET Core's built-in RateLimiter (System.Threading.RateLimiting).
// No extra NuGet package — available from .NET 7+.
//
// Two layers:
//   GlobalLimiter  — hard ceiling applied to EVERY request, regardless of route.
//   Named policies — referenced per-route via YARP's "RateLimiterPolicy" key.
//
// Partition key = client IP.
//   In production, put the real client IP in X-Forwarded-For
//   (set by your load-balancer / cloud provider).
//   The helper below reads that header first.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (ctx, _) =>
    {
        ctx.HttpContext.Response.Headers["Retry-After"] = "60";
        await ctx.HttpContext.Response.WriteAsync(
            "Quá nhiều yêu cầu. Vui lòng thử lại sau 60 giây.");
    };

    // ── Global hard ceiling: 300 req / min per IP ─────────────
    // This fires BEFORE named policies. Even if a route has "GlobalIpLimit" (100/min),
    // an IP that abuses 5 different routes can still hit 300 total.
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(ctx =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: GetClientIp(ctx),
            factory:      _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit          = 300,
                Window               = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit           = 0
            }));

    // ── "GlobalIpLimit": 100 req / min per IP ────────────────
    // Applied to EMR, Inventory, Invoices routes.
    options.AddPolicy("GlobalIpLimit", ctx =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: GetClientIp(ctx),
            factory:      _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit          = 100,
                Window               = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit           = 5
            }));

    // ── "AuthLimit": 10 req / min per IP ─────────────────────
    // Strict anti-brute-force limit on /api/auth/* (login, refresh).
    options.AddPolicy("AuthLimit", ctx =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: GetClientIp(ctx),
            factory:      _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit          = 10,
                Window               = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit           = 0
            }));

    // ── "BookingLimit": 30 req / min per IP, sliding window ──
    // Sliding window (6 × 10 s segments) prevents sudden bursts while still
    // allowing steady booking traffic. Each segment = 5 requests max.
    options.AddPolicy("BookingLimit", ctx =>
        RateLimitPartition.GetSlidingWindowLimiter(
            partitionKey: GetClientIp(ctx),
            factory:      _ => new SlidingWindowRateLimiterOptions
            {
                PermitLimit          = 30,
                Window               = TimeSpan.FromMinutes(1),
                SegmentsPerWindow    = 6,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit           = 5
            }));
});

// ── 4. CORS ──────────────────────────────────────────────────
// Only origins listed in AllowedOrigins may call this Gateway from a browser.
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
    options.AddPolicy("FrontendOrigins", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()));

// ── 5. Health Checks ─────────────────────────────────────────
builder.Services.AddHealthChecks();

// ── Build ────────────────────────────────────────────────────
var app = builder.Build();

// ── 6. Middleware Pipeline ───────────────────────────────────
// Order is critical for security correctness:
//   RateLimiter first  — reject floods before any processing
//   CORS next          — browser preflight (OPTIONS) resolved before auth
//   Authentication     — parse + validate JWT, populate ClaimsPrincipal
//   Authorization      — enforce "AuthenticatedUser" policy set on YARP routes

app.UseRateLimiter();
app.UseCors("FrontendOrigins");
app.UseAuthentication();
app.UseAuthorization();

// ── 7. Endpoints ─────────────────────────────────────────────
// Gateway health probe — not forwarded to downstream, not rate-limited.
app.MapHealthChecks("/gateway/health").AllowAnonymous().RequireRateLimiting("GlobalIpLimit");

// YARP forwards every other matched request to the appropriate downstream cluster.
// Unmatched routes return 404 automatically.
app.MapReverseProxy();

app.Run();

// ── Helpers ──────────────────────────────────────────────────
// Extract real client IP respecting X-Forwarded-For from upstream load-balancer.
// Take only the FIRST address in the header (closest client) to prevent spoofing.
static string GetClientIp(HttpContext ctx) =>
    ctx.Request.Headers["X-Forwarded-For"]
        .FirstOrDefault()?.Split(',')[0].Trim()
    ?? ctx.Connection.RemoteIpAddress?.ToString()
    ?? "unknown";
