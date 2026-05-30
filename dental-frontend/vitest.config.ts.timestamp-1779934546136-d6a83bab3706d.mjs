// ../../../../../tmp/vitest-runner/node_modules/vitest/dist/config.js
import os from "node:os";
import { isCI } from "file:///tmp/vitest-runner/node_modules/std-env/dist/index.mjs";
import { mergeConfig } from "file:///tmp/vitest-runner/node_modules/vitest/node_modules/vite/dist/node/index.js";
var isNode = typeof process < "u" && typeof process.stdout < "u" && !process.versions?.deno && !globalThis.window;
var isDeno = typeof process < "u" && typeof process.stdout < "u" && process.versions?.deno !== void 0;
(isNode || isDeno) && process.platform === "win32";
var defaultInclude = ["**/*.{test,spec}.?(c|m)[jt]s?(x)"];
var defaultExclude = [
  "**/node_modules/**",
  "**/dist/**",
  "**/cypress/**",
  "**/.{idea,git,cache,output,temp}/**",
  "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*"
];
var defaultCoverageExcludes = [
  "coverage/**",
  "dist/**",
  "**/node_modules/**",
  "**/[.]**",
  "packages/*/test?(s)/**",
  "**/*.d.ts",
  "**/virtual:*",
  "**/__x00__*",
  "**/\0*",
  "cypress/**",
  "test?(s)/**",
  "test?(-*).?(c|m)[jt]s?(x)",
  "**/*{.,-}{test,spec,bench,benchmark}?(-d).?(c|m)[jt]s?(x)",
  "**/__tests__/**",
  "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
  "**/vitest.{workspace,projects}.[jt]s?(on)",
  "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}"
];
var coverageConfigDefaults = {
  provider: "v8",
  enabled: false,
  all: true,
  clean: true,
  cleanOnRerun: true,
  reportsDirectory: "./coverage",
  exclude: defaultCoverageExcludes,
  reportOnFailure: false,
  reporter: [
    ["text", {}],
    ["html", {}],
    ["clover", {}],
    ["json", {}]
  ],
  extension: [
    ".js",
    ".cjs",
    ".mjs",
    ".ts",
    ".mts",
    ".tsx",
    ".jsx",
    ".vue",
    ".svelte",
    ".marko",
    ".astro"
  ],
  allowExternal: false,
  excludeAfterRemap: false,
  ignoreEmptyLines: true,
  processingConcurrency: Math.min(
    20,
    os.availableParallelism?.() ?? os.cpus().length
  )
};
var fakeTimersDefaults = {
  loopLimit: 1e4,
  shouldClearNativeTimers: true,
  toFake: [
    "setTimeout",
    "clearTimeout",
    "setInterval",
    "clearInterval",
    "setImmediate",
    "clearImmediate",
    "Date"
  ]
};
var config = {
  allowOnly: !isCI,
  isolate: true,
  watch: !isCI,
  globals: false,
  environment: "node",
  pool: "forks",
  clearMocks: false,
  restoreMocks: false,
  mockReset: false,
  unstubGlobals: false,
  unstubEnvs: false,
  include: defaultInclude,
  exclude: defaultExclude,
  teardownTimeout: 1e4,
  forceRerunTriggers: ["**/package.json/**", "**/{vitest,vite}.config.*/**"],
  update: false,
  reporters: [],
  silent: false,
  hideSkippedTests: false,
  api: false,
  ui: false,
  uiBase: "/__vitest__/",
  open: !isCI,
  css: {
    include: []
  },
  coverage: coverageConfigDefaults,
  fakeTimers: fakeTimersDefaults,
  maxConcurrency: 5,
  dangerouslyIgnoreUnhandledErrors: false,
  typecheck: {
    checker: "tsc",
    include: ["**/*.{test,spec}-d.?(c|m)[jt]s?(x)"],
    exclude: defaultExclude
  },
  slowTestThreshold: 300,
  disableConsoleIntercept: false
};
var configDefaults = Object.freeze(config);
function defineConfig(config2) {
  return config2;
}

// vitest.config.ts
import path from "path";
var TMP = "/tmp/vitest-runner/node_modules";
var SRC = "/sessions/keen-nifty-dirac/mnt/DentalClinic/dental-frontend/src";
var NM = "/sessions/keen-nifty-dirac/mnt/DentalClinic/dental-frontend/node_modules";
var vitest_config_default = defineConfig({
  resolve: {
    // Let vite look in /tmp FIRST, then project node_modules
    modules: [TMP, NM, "node_modules"],
    alias: [
      // Stub antd (heavy CSS-in-JS)
      { find: "antd", replacement: path.join(SRC, "test/antd-mock.tsx") },
      { find: "@ant-design/icons", replacement: path.join(SRC, "test/antd-mock.tsx") },
      // Force single React from /tmp (same location as @testing-library/react)
      { find: /^react$/, replacement: path.join(TMP, "react/index.js") },
      { find: /^react-dom$/, replacement: path.join(TMP, "react-dom/index.js") },
      { find: "react/jsx-dev-runtime", replacement: path.join(TMP, "react/jsx-dev-runtime.js") },
      { find: "react/jsx-runtime", replacement: path.join(TMP, "react/jsx-runtime.js") },
      { find: "react-dom/client", replacement: path.join(TMP, "react-dom/client.js") }
    ]
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    testTimeout: 15e3,
    deps: {
      interopDefault: true
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vdG1wL3ZpdGVzdC1ydW5uZXIvbm9kZV9tb2R1bGVzL3ZpdGVzdC9kaXN0L2NvbmZpZy5qcyIsICJ2aXRlc3QuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3RtcC92aXRlc3QtcnVubmVyL25vZGVfbW9kdWxlcy92aXRlc3QvZGlzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3RtcC92aXRlc3QtcnVubmVyL25vZGVfbW9kdWxlcy92aXRlc3QvZGlzdC9jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3RtcC92aXRlc3QtcnVubmVyL25vZGVfbW9kdWxlcy92aXRlc3QvZGlzdC9jb25maWcuanNcIjtpbXBvcnQgb3MgZnJvbSAnbm9kZTpvcyc7XG5pbXBvcnQgeyBpc0NJIH0gZnJvbSAnc3RkLWVudic7XG5leHBvcnQgeyBtZXJnZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCBkZWZhdWx0QnJvd3NlclBvcnQgPSA2MzMxNTtcbmNvbnN0IGV4dHJhSW5saW5lRGVwcyA9IFtcbiAgL14oPyEuKm5vZGVfbW9kdWxlcykuKlxcLm1qcyQvLFxuICAvXig/IS4qbm9kZV9tb2R1bGVzKS4qXFwuY2pzXFwuanMkLyxcbiAgLy8gVml0ZSBjbGllbnRcbiAgL3ZpdGVcXHcqXFwvZGlzdFxcL2NsaWVudFxcL2Vudi5tanMvXG5dO1xuXG5jb25zdCBpc05vZGUgPSB0eXBlb2YgcHJvY2VzcyA8IFwidVwiICYmIHR5cGVvZiBwcm9jZXNzLnN0ZG91dCA8IFwidVwiICYmICFwcm9jZXNzLnZlcnNpb25zPy5kZW5vICYmICFnbG9iYWxUaGlzLndpbmRvdztcbmNvbnN0IGlzRGVubyA9IHR5cGVvZiBwcm9jZXNzIDwgXCJ1XCIgJiYgdHlwZW9mIHByb2Nlc3Muc3Rkb3V0IDwgXCJ1XCIgJiYgcHJvY2Vzcy52ZXJzaW9ucz8uZGVubyAhPT0gdm9pZCAwO1xuKGlzTm9kZSB8fCBpc0Rlbm8pICYmIHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIjtcblxuY29uc3QgZGVmYXVsdEluY2x1ZGUgPSBbXCIqKi8qLnt0ZXN0LHNwZWN9Lj8oY3xtKVtqdF1zPyh4KVwiXTtcbmNvbnN0IGRlZmF1bHRFeGNsdWRlID0gW1xuICBcIioqL25vZGVfbW9kdWxlcy8qKlwiLFxuICBcIioqL2Rpc3QvKipcIixcbiAgXCIqKi9jeXByZXNzLyoqXCIsXG4gIFwiKiovLntpZGVhLGdpdCxjYWNoZSxvdXRwdXQsdGVtcH0vKipcIixcbiAgXCIqKi97a2FybWEscm9sbHVwLHdlYnBhY2ssdml0ZSx2aXRlc3QsamVzdCxhdmEsYmFiZWwsbnljLGN5cHJlc3MsdHN1cCxidWlsZCxlc2xpbnQscHJldHRpZXJ9LmNvbmZpZy4qXCJcbl07XG5jb25zdCBkZWZhdWx0Q292ZXJhZ2VFeGNsdWRlcyA9IFtcbiAgXCJjb3ZlcmFnZS8qKlwiLFxuICBcImRpc3QvKipcIixcbiAgXCIqKi9ub2RlX21vZHVsZXMvKipcIixcbiAgXCIqKi9bLl0qKlwiLFxuICBcInBhY2thZ2VzLyovdGVzdD8ocykvKipcIixcbiAgXCIqKi8qLmQudHNcIixcbiAgXCIqKi92aXJ0dWFsOipcIixcbiAgXCIqKi9fX3gwMF9fKlwiLFxuICBcIioqL1xcMCpcIixcbiAgXCJjeXByZXNzLyoqXCIsXG4gIFwidGVzdD8ocykvKipcIixcbiAgXCJ0ZXN0PygtKikuPyhjfG0pW2p0XXM/KHgpXCIsXG4gIFwiKiovKnsuLC19e3Rlc3Qsc3BlYyxiZW5jaCxiZW5jaG1hcmt9PygtZCkuPyhjfG0pW2p0XXM/KHgpXCIsXG4gIFwiKiovX190ZXN0c19fLyoqXCIsXG4gIFwiKiove2thcm1hLHJvbGx1cCx3ZWJwYWNrLHZpdGUsdml0ZXN0LGplc3QsYXZhLGJhYmVsLG55YyxjeXByZXNzLHRzdXAsYnVpbGQsZXNsaW50LHByZXR0aWVyfS5jb25maWcuKlwiLFxuICBcIioqL3ZpdGVzdC57d29ya3NwYWNlLHByb2plY3RzfS5banRdcz8ob24pXCIsXG4gIFwiKiovLntlc2xpbnQsbW9jaGEscHJldHRpZXJ9cmMuez8oY3xtKWpzLHltbH1cIlxuXTtcbmNvbnN0IGNvdmVyYWdlQ29uZmlnRGVmYXVsdHMgPSB7XG4gIHByb3ZpZGVyOiBcInY4XCIsXG4gIGVuYWJsZWQ6IGZhbHNlLFxuICBhbGw6IHRydWUsXG4gIGNsZWFuOiB0cnVlLFxuICBjbGVhbk9uUmVydW46IHRydWUsXG4gIHJlcG9ydHNEaXJlY3Rvcnk6IFwiLi9jb3ZlcmFnZVwiLFxuICBleGNsdWRlOiBkZWZhdWx0Q292ZXJhZ2VFeGNsdWRlcyxcbiAgcmVwb3J0T25GYWlsdXJlOiBmYWxzZSxcbiAgcmVwb3J0ZXI6IFtcbiAgICBbXCJ0ZXh0XCIsIHt9XSxcbiAgICBbXCJodG1sXCIsIHt9XSxcbiAgICBbXCJjbG92ZXJcIiwge31dLFxuICAgIFtcImpzb25cIiwge31dXG4gIF0sXG4gIGV4dGVuc2lvbjogW1xuICAgIFwiLmpzXCIsXG4gICAgXCIuY2pzXCIsXG4gICAgXCIubWpzXCIsXG4gICAgXCIudHNcIixcbiAgICBcIi5tdHNcIixcbiAgICBcIi50c3hcIixcbiAgICBcIi5qc3hcIixcbiAgICBcIi52dWVcIixcbiAgICBcIi5zdmVsdGVcIixcbiAgICBcIi5tYXJrb1wiLFxuICAgIFwiLmFzdHJvXCJcbiAgXSxcbiAgYWxsb3dFeHRlcm5hbDogZmFsc2UsXG4gIGV4Y2x1ZGVBZnRlclJlbWFwOiBmYWxzZSxcbiAgaWdub3JlRW1wdHlMaW5lczogdHJ1ZSxcbiAgcHJvY2Vzc2luZ0NvbmN1cnJlbmN5OiBNYXRoLm1pbihcbiAgICAyMCxcbiAgICBvcy5hdmFpbGFibGVQYXJhbGxlbGlzbT8uKCkgPz8gb3MuY3B1cygpLmxlbmd0aFxuICApXG59O1xuY29uc3QgZmFrZVRpbWVyc0RlZmF1bHRzID0ge1xuICBsb29wTGltaXQ6IDFlNCxcbiAgc2hvdWxkQ2xlYXJOYXRpdmVUaW1lcnM6IHRydWUsXG4gIHRvRmFrZTogW1xuICAgIFwic2V0VGltZW91dFwiLFxuICAgIFwiY2xlYXJUaW1lb3V0XCIsXG4gICAgXCJzZXRJbnRlcnZhbFwiLFxuICAgIFwiY2xlYXJJbnRlcnZhbFwiLFxuICAgIFwic2V0SW1tZWRpYXRlXCIsXG4gICAgXCJjbGVhckltbWVkaWF0ZVwiLFxuICAgIFwiRGF0ZVwiXG4gIF1cbn07XG5jb25zdCBjb25maWcgPSB7XG4gIGFsbG93T25seTogIWlzQ0ksXG4gIGlzb2xhdGU6IHRydWUsXG4gIHdhdGNoOiAhaXNDSSxcbiAgZ2xvYmFsczogZmFsc2UsXG4gIGVudmlyb25tZW50OiBcIm5vZGVcIixcbiAgcG9vbDogXCJmb3Jrc1wiLFxuICBjbGVhck1vY2tzOiBmYWxzZSxcbiAgcmVzdG9yZU1vY2tzOiBmYWxzZSxcbiAgbW9ja1Jlc2V0OiBmYWxzZSxcbiAgdW5zdHViR2xvYmFsczogZmFsc2UsXG4gIHVuc3R1YkVudnM6IGZhbHNlLFxuICBpbmNsdWRlOiBkZWZhdWx0SW5jbHVkZSxcbiAgZXhjbHVkZTogZGVmYXVsdEV4Y2x1ZGUsXG4gIHRlYXJkb3duVGltZW91dDogMWU0LFxuICBmb3JjZVJlcnVuVHJpZ2dlcnM6IFtcIioqL3BhY2thZ2UuanNvbi8qKlwiLCBcIioqL3t2aXRlc3Qsdml0ZX0uY29uZmlnLiovKipcIl0sXG4gIHVwZGF0ZTogZmFsc2UsXG4gIHJlcG9ydGVyczogW10sXG4gIHNpbGVudDogZmFsc2UsXG4gIGhpZGVTa2lwcGVkVGVzdHM6IGZhbHNlLFxuICBhcGk6IGZhbHNlLFxuICB1aTogZmFsc2UsXG4gIHVpQmFzZTogXCIvX192aXRlc3RfXy9cIixcbiAgb3BlbjogIWlzQ0ksXG4gIGNzczoge1xuICAgIGluY2x1ZGU6IFtdXG4gIH0sXG4gIGNvdmVyYWdlOiBjb3ZlcmFnZUNvbmZpZ0RlZmF1bHRzLFxuICBmYWtlVGltZXJzOiBmYWtlVGltZXJzRGVmYXVsdHMsXG4gIG1heENvbmN1cnJlbmN5OiA1LFxuICBkYW5nZXJvdXNseUlnbm9yZVVuaGFuZGxlZEVycm9yczogZmFsc2UsXG4gIHR5cGVjaGVjazoge1xuICAgIGNoZWNrZXI6IFwidHNjXCIsXG4gICAgaW5jbHVkZTogW1wiKiovKi57dGVzdCxzcGVjfS1kLj8oY3xtKVtqdF1zPyh4KVwiXSxcbiAgICBleGNsdWRlOiBkZWZhdWx0RXhjbHVkZVxuICB9LFxuICBzbG93VGVzdFRocmVzaG9sZDogMzAwLFxuICBkaXNhYmxlQ29uc29sZUludGVyY2VwdDogZmFsc2Vcbn07XG5jb25zdCBjb25maWdEZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoY29uZmlnKTtcblxuZnVuY3Rpb24gZGVmaW5lQ29uZmlnKGNvbmZpZykge1xuICByZXR1cm4gY29uZmlnO1xufVxuZnVuY3Rpb24gZGVmaW5lUHJvamVjdChjb25maWcpIHtcbiAgcmV0dXJuIGNvbmZpZztcbn1cbmZ1bmN0aW9uIGRlZmluZVdvcmtzcGFjZShjb25maWcpIHtcbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuZXhwb3J0IHsgY29uZmlnRGVmYXVsdHMsIGNvdmVyYWdlQ29uZmlnRGVmYXVsdHMsIGRlZmF1bHRCcm93c2VyUG9ydCwgZGVmYXVsdEV4Y2x1ZGUsIGRlZmF1bHRJbmNsdWRlLCBkZWZpbmVDb25maWcsIGRlZmluZVByb2plY3QsIGRlZmluZVdvcmtzcGFjZSwgZXh0cmFJbmxpbmVEZXBzIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9zZXNzaW9ucy9rZWVuLW5pZnR5LWRpcmFjL21udC9EZW50YWxDbGluaWMvZGVudGFsLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMva2Vlbi1uaWZ0eS1kaXJhYy9tbnQvRGVudGFsQ2xpbmljL2RlbnRhbC1mcm9udGVuZC92aXRlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9rZWVuLW5pZnR5LWRpcmFjL21udC9EZW50YWxDbGluaWMvZGVudGFsLWZyb250ZW5kL3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICcvdG1wL3ZpdGVzdC1ydW5uZXIvbm9kZV9tb2R1bGVzL3ZpdGVzdC9kaXN0L2NvbmZpZy5qcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgVE1QID0gJy90bXAvdml0ZXN0LXJ1bm5lci9ub2RlX21vZHVsZXMnO1xuY29uc3QgU1JDID0gJy9zZXNzaW9ucy9rZWVuLW5pZnR5LWRpcmFjL21udC9EZW50YWxDbGluaWMvZGVudGFsLWZyb250ZW5kL3NyYyc7XG5jb25zdCBOTSAgPSAnL3Nlc3Npb25zL2tlZW4tbmlmdHktZGlyYWMvbW50L0RlbnRhbENsaW5pYy9kZW50YWwtZnJvbnRlbmQvbm9kZV9tb2R1bGVzJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIC8vIExldCB2aXRlIGxvb2sgaW4gL3RtcCBGSVJTVCwgdGhlbiBwcm9qZWN0IG5vZGVfbW9kdWxlc1xuICAgIG1vZHVsZXM6IFtUTVAsIE5NLCAnbm9kZV9tb2R1bGVzJ10sXG4gICAgYWxpYXM6IFtcbiAgICAgIC8vIFN0dWIgYW50ZCAoaGVhdnkgQ1NTLWluLUpTKVxuICAgICAgeyBmaW5kOiAnYW50ZCcsICAgICAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKFNSQywgJ3Rlc3QvYW50ZC1tb2NrLnRzeCcpIH0sXG4gICAgICB7IGZpbmQ6ICdAYW50LWRlc2lnbi9pY29ucycsIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4oU1JDLCAndGVzdC9hbnRkLW1vY2sudHN4JykgfSxcbiAgICAgIC8vIEZvcmNlIHNpbmdsZSBSZWFjdCBmcm9tIC90bXAgKHNhbWUgbG9jYXRpb24gYXMgQHRlc3RpbmctbGlicmFyeS9yZWFjdClcbiAgICAgIHsgZmluZDogL15yZWFjdCQvLCByZXBsYWNlbWVudDogcGF0aC5qb2luKFRNUCwgJ3JlYWN0L2luZGV4LmpzJykgfSxcbiAgICAgIHsgZmluZDogL15yZWFjdC1kb20kLywgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihUTVAsICdyZWFjdC1kb20vaW5kZXguanMnKSB9LFxuICAgICAgeyBmaW5kOiAncmVhY3QvanN4LWRldi1ydW50aW1lJywgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihUTVAsICdyZWFjdC9qc3gtZGV2LXJ1bnRpbWUuanMnKSB9LFxuICAgICAgeyBmaW5kOiAncmVhY3QvanN4LXJ1bnRpbWUnLCAgICAgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihUTVAsICdyZWFjdC9qc3gtcnVudGltZS5qcycpIH0sXG4gICAgICB7IGZpbmQ6ICdyZWFjdC1kb20vY2xpZW50JywgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKFRNUCwgJ3JlYWN0LWRvbS9jbGllbnQuanMnKSB9LFxuICAgIF0sXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6IFsnLi9zcmMvdGVzdC9zZXR1cC50cyddLFxuICAgIGNzczogZmFsc2UsXG4gICAgaW5jbHVkZTogWydzcmMvKiovKi57dGVzdCxzcGVjfS57dHMsdHN4fSddLFxuICAgIHRlc3RUaW1lb3V0OiAxNTAwMCxcbiAgICBkZXBzOiB7XG4gICAgICBpbnRlcm9wRGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlTLE9BQU8sUUFBUTtBQUN4VCxTQUFTLFlBQVk7QUFDckIsU0FBUyxtQkFBbUI7QUFVNUIsSUFBTSxTQUFTLE9BQU8sVUFBVSxPQUFPLE9BQU8sUUFBUSxTQUFTLE9BQU8sQ0FBQyxRQUFRLFVBQVUsUUFBUSxDQUFDLFdBQVc7QUFDN0csSUFBTSxTQUFTLE9BQU8sVUFBVSxPQUFP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
