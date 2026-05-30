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
var vitest_config_default = defineConfig({
  resolve: {
    alias: [
      // --- Antd stub ---
      { find: "antd", replacement: path.join(SRC, "test/antd-mock.tsx") },
      { find: "@ant-design/icons", replacement: path.join(SRC, "test/antd-mock.tsx") },
      // --- React sub-paths (must be before bare react alias) ---
      { find: "react/jsx-dev-runtime", replacement: path.join(TMP, "react/jsx-dev-runtime.js") },
      { find: "react/jsx-runtime", replacement: path.join(TMP, "react/jsx-runtime.js") },
      { find: "react-dom/client", replacement: path.join(TMP, "react-dom/client.js") },
      { find: "react-dom/server", replacement: path.join(TMP, "react-dom/server.js") },
      // --- Bare React from TMP (matches @testing-library/react's own React) ---
      { find: /^react$/, replacement: path.join(TMP, "react/index.js") },
      { find: /^react-dom$/, replacement: path.join(TMP, "react-dom/index.js") },
      // --- Testing library from TMP ---
      { find: "@testing-library/react", replacement: path.join(TMP, "@testing-library/react") },
      { find: "@testing-library/user-event", replacement: path.join(TMP, "@testing-library/user-event") },
      // --- @tanstack/react-query from TMP (uses same React instance) ---
      { find: "@tanstack/react-query", replacement: path.join(TMP, "@tanstack/react-query") }
    ]
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    testTimeout: 15e3,
    deps: { interopDefault: true }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vdG1wL3ZpdGVzdC1ydW5uZXIvbm9kZV9tb2R1bGVzL3ZpdGVzdC9kaXN0L2NvbmZpZy5qcyIsICJ2aXRlc3QuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3RtcC92aXRlc3QtcnVubmVyL25vZGVfbW9kdWxlcy92aXRlc3QvZGlzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3RtcC92aXRlc3QtcnVubmVyL25vZGVfbW9kdWxlcy92aXRlc3QvZGlzdC9jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3RtcC92aXRlc3QtcnVubmVyL25vZGVfbW9kdWxlcy92aXRlc3QvZGlzdC9jb25maWcuanNcIjtpbXBvcnQgb3MgZnJvbSAnbm9kZTpvcyc7XG5pbXBvcnQgeyBpc0NJIH0gZnJvbSAnc3RkLWVudic7XG5leHBvcnQgeyBtZXJnZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCBkZWZhdWx0QnJvd3NlclBvcnQgPSA2MzMxNTtcbmNvbnN0IGV4dHJhSW5saW5lRGVwcyA9IFtcbiAgL14oPyEuKm5vZGVfbW9kdWxlcykuKlxcLm1qcyQvLFxuICAvXig/IS4qbm9kZV9tb2R1bGVzKS4qXFwuY2pzXFwuanMkLyxcbiAgLy8gVml0ZSBjbGllbnRcbiAgL3ZpdGVcXHcqXFwvZGlzdFxcL2NsaWVudFxcL2Vudi5tanMvXG5dO1xuXG5jb25zdCBpc05vZGUgPSB0eXBlb2YgcHJvY2VzcyA8IFwidVwiICYmIHR5cGVvZiBwcm9jZXNzLnN0ZG91dCA8IFwidVwiICYmICFwcm9jZXNzLnZlcnNpb25zPy5kZW5vICYmICFnbG9iYWxUaGlzLndpbmRvdztcbmNvbnN0IGlzRGVubyA9IHR5cGVvZiBwcm9jZXNzIDwgXCJ1XCIgJiYgdHlwZW9mIHByb2Nlc3Muc3Rkb3V0IDwgXCJ1XCIgJiYgcHJvY2Vzcy52ZXJzaW9ucz8uZGVubyAhPT0gdm9pZCAwO1xuKGlzTm9kZSB8fCBpc0Rlbm8pICYmIHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIjtcblxuY29uc3QgZGVmYXVsdEluY2x1ZGUgPSBbXCIqKi8qLnt0ZXN0LHNwZWN9Lj8oY3xtKVtqdF1zPyh4KVwiXTtcbmNvbnN0IGRlZmF1bHRFeGNsdWRlID0gW1xuICBcIioqL25vZGVfbW9kdWxlcy8qKlwiLFxuICBcIioqL2Rpc3QvKipcIixcbiAgXCIqKi9jeXByZXNzLyoqXCIsXG4gIFwiKiovLntpZGVhLGdpdCxjYWNoZSxvdXRwdXQsdGVtcH0vKipcIixcbiAgXCIqKi97a2FybWEscm9sbHVwLHdlYnBhY2ssdml0ZSx2aXRlc3QsamVzdCxhdmEsYmFiZWwsbnljLGN5cHJlc3MsdHN1cCxidWlsZCxlc2xpbnQscHJldHRpZXJ9LmNvbmZpZy4qXCJcbl07XG5jb25zdCBkZWZhdWx0Q292ZXJhZ2VFeGNsdWRlcyA9IFtcbiAgXCJjb3ZlcmFnZS8qKlwiLFxuICBcImRpc3QvKipcIixcbiAgXCIqKi9ub2RlX21vZHVsZXMvKipcIixcbiAgXCIqKi9bLl0qKlwiLFxuICBcInBhY2thZ2VzLyovdGVzdD8ocykvKipcIixcbiAgXCIqKi8qLmQudHNcIixcbiAgXCIqKi92aXJ0dWFsOipcIixcbiAgXCIqKi9fX3gwMF9fKlwiLFxuICBcIioqL1xcMCpcIixcbiAgXCJjeXByZXNzLyoqXCIsXG4gIFwidGVzdD8ocykvKipcIixcbiAgXCJ0ZXN0PygtKikuPyhjfG0pW2p0XXM/KHgpXCIsXG4gIFwiKiovKnsuLC19e3Rlc3Qsc3BlYyxiZW5jaCxiZW5jaG1hcmt9PygtZCkuPyhjfG0pW2p0XXM/KHgpXCIsXG4gIFwiKiovX190ZXN0c19fLyoqXCIsXG4gIFwiKiove2thcm1hLHJvbGx1cCx3ZWJwYWNrLHZpdGUsdml0ZXN0LGplc3QsYXZhLGJhYmVsLG55YyxjeXByZXNzLHRzdXAsYnVpbGQsZXNsaW50LHByZXR0aWVyfS5jb25maWcuKlwiLFxuICBcIioqL3ZpdGVzdC57d29ya3NwYWNlLHByb2plY3RzfS5banRdcz8ob24pXCIsXG4gIFwiKiovLntlc2xpbnQsbW9jaGEscHJldHRpZXJ9cmMuez8oY3xtKWpzLHltbH1cIlxuXTtcbmNvbnN0IGNvdmVyYWdlQ29uZmlnRGVmYXVsdHMgPSB7XG4gIHByb3ZpZGVyOiBcInY4XCIsXG4gIGVuYWJsZWQ6IGZhbHNlLFxuICBhbGw6IHRydWUsXG4gIGNsZWFuOiB0cnVlLFxuICBjbGVhbk9uUmVydW46IHRydWUsXG4gIHJlcG9ydHNEaXJlY3Rvcnk6IFwiLi9jb3ZlcmFnZVwiLFxuICBleGNsdWRlOiBkZWZhdWx0Q292ZXJhZ2VFeGNsdWRlcyxcbiAgcmVwb3J0T25GYWlsdXJlOiBmYWxzZSxcbiAgcmVwb3J0ZXI6IFtcbiAgICBbXCJ0ZXh0XCIsIHt9XSxcbiAgICBbXCJodG1sXCIsIHt9XSxcbiAgICBbXCJjbG92ZXJcIiwge31dLFxuICAgIFtcImpzb25cIiwge31dXG4gIF0sXG4gIGV4dGVuc2lvbjogW1xuICAgIFwiLmpzXCIsXG4gICAgXCIuY2pzXCIsXG4gICAgXCIubWpzXCIsXG4gICAgXCIudHNcIixcbiAgICBcIi5tdHNcIixcbiAgICBcIi50c3hcIixcbiAgICBcIi5qc3hcIixcbiAgICBcIi52dWVcIixcbiAgICBcIi5zdmVsdGVcIixcbiAgICBcIi5tYXJrb1wiLFxuICAgIFwiLmFzdHJvXCJcbiAgXSxcbiAgYWxsb3dFeHRlcm5hbDogZmFsc2UsXG4gIGV4Y2x1ZGVBZnRlclJlbWFwOiBmYWxzZSxcbiAgaWdub3JlRW1wdHlMaW5lczogdHJ1ZSxcbiAgcHJvY2Vzc2luZ0NvbmN1cnJlbmN5OiBNYXRoLm1pbihcbiAgICAyMCxcbiAgICBvcy5hdmFpbGFibGVQYXJhbGxlbGlzbT8uKCkgPz8gb3MuY3B1cygpLmxlbmd0aFxuICApXG59O1xuY29uc3QgZmFrZVRpbWVyc0RlZmF1bHRzID0ge1xuICBsb29wTGltaXQ6IDFlNCxcbiAgc2hvdWxkQ2xlYXJOYXRpdmVUaW1lcnM6IHRydWUsXG4gIHRvRmFrZTogW1xuICAgIFwic2V0VGltZW91dFwiLFxuICAgIFwiY2xlYXJUaW1lb3V0XCIsXG4gICAgXCJzZXRJbnRlcnZhbFwiLFxuICAgIFwiY2xlYXJJbnRlcnZhbFwiLFxuICAgIFwic2V0SW1tZWRpYXRlXCIsXG4gICAgXCJjbGVhckltbWVkaWF0ZVwiLFxuICAgIFwiRGF0ZVwiXG4gIF1cbn07XG5jb25zdCBjb25maWcgPSB7XG4gIGFsbG93T25seTogIWlzQ0ksXG4gIGlzb2xhdGU6IHRydWUsXG4gIHdhdGNoOiAhaXNDSSxcbiAgZ2xvYmFsczogZmFsc2UsXG4gIGVudmlyb25tZW50OiBcIm5vZGVcIixcbiAgcG9vbDogXCJmb3Jrc1wiLFxuICBjbGVhck1vY2tzOiBmYWxzZSxcbiAgcmVzdG9yZU1vY2tzOiBmYWxzZSxcbiAgbW9ja1Jlc2V0OiBmYWxzZSxcbiAgdW5zdHViR2xvYmFsczogZmFsc2UsXG4gIHVuc3R1YkVudnM6IGZhbHNlLFxuICBpbmNsdWRlOiBkZWZhdWx0SW5jbHVkZSxcbiAgZXhjbHVkZTogZGVmYXVsdEV4Y2x1ZGUsXG4gIHRlYXJkb3duVGltZW91dDogMWU0LFxuICBmb3JjZVJlcnVuVHJpZ2dlcnM6IFtcIioqL3BhY2thZ2UuanNvbi8qKlwiLCBcIioqL3t2aXRlc3Qsdml0ZX0uY29uZmlnLiovKipcIl0sXG4gIHVwZGF0ZTogZmFsc2UsXG4gIHJlcG9ydGVyczogW10sXG4gIHNpbGVudDogZmFsc2UsXG4gIGhpZGVTa2lwcGVkVGVzdHM6IGZhbHNlLFxuICBhcGk6IGZhbHNlLFxuICB1aTogZmFsc2UsXG4gIHVpQmFzZTogXCIvX192aXRlc3RfXy9cIixcbiAgb3BlbjogIWlzQ0ksXG4gIGNzczoge1xuICAgIGluY2x1ZGU6IFtdXG4gIH0sXG4gIGNvdmVyYWdlOiBjb3ZlcmFnZUNvbmZpZ0RlZmF1bHRzLFxuICBmYWtlVGltZXJzOiBmYWtlVGltZXJzRGVmYXVsdHMsXG4gIG1heENvbmN1cnJlbmN5OiA1LFxuICBkYW5nZXJvdXNseUlnbm9yZVVuaGFuZGxlZEVycm9yczogZmFsc2UsXG4gIHR5cGVjaGVjazoge1xuICAgIGNoZWNrZXI6IFwidHNjXCIsXG4gICAgaW5jbHVkZTogW1wiKiovKi57dGVzdCxzcGVjfS1kLj8oY3xtKVtqdF1zPyh4KVwiXSxcbiAgICBleGNsdWRlOiBkZWZhdWx0RXhjbHVkZVxuICB9LFxuICBzbG93VGVzdFRocmVzaG9sZDogMzAwLFxuICBkaXNhYmxlQ29uc29sZUludGVyY2VwdDogZmFsc2Vcbn07XG5jb25zdCBjb25maWdEZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoY29uZmlnKTtcblxuZnVuY3Rpb24gZGVmaW5lQ29uZmlnKGNvbmZpZykge1xuICByZXR1cm4gY29uZmlnO1xufVxuZnVuY3Rpb24gZGVmaW5lUHJvamVjdChjb25maWcpIHtcbiAgcmV0dXJuIGNvbmZpZztcbn1cbmZ1bmN0aW9uIGRlZmluZVdvcmtzcGFjZShjb25maWcpIHtcbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuZXhwb3J0IHsgY29uZmlnRGVmYXVsdHMsIGNvdmVyYWdlQ29uZmlnRGVmYXVsdHMsIGRlZmF1bHRCcm93c2VyUG9ydCwgZGVmYXVsdEV4Y2x1ZGUsIGRlZmF1bHRJbmNsdWRlLCBkZWZpbmVDb25maWcsIGRlZmluZVByb2plY3QsIGRlZmluZVdvcmtzcGFjZSwgZXh0cmFJbmxpbmVEZXBzIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9zZXNzaW9ucy9rZWVuLW5pZnR5LWRpcmFjL21udC9EZW50YWxDbGluaWMvZGVudGFsLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMva2Vlbi1uaWZ0eS1kaXJhYy9tbnQvRGVudGFsQ2xpbmljL2RlbnRhbC1mcm9udGVuZC92aXRlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9rZWVuLW5pZnR5LWRpcmFjL21udC9EZW50YWxDbGluaWMvZGVudGFsLWZyb250ZW5kL3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICcvdG1wL3ZpdGVzdC1ydW5uZXIvbm9kZV9tb2R1bGVzL3ZpdGVzdC9kaXN0L2NvbmZpZy5qcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgVE1QID0gJy90bXAvdml0ZXN0LXJ1bm5lci9ub2RlX21vZHVsZXMnO1xuY29uc3QgU1JDID0gJy9zZXNzaW9ucy9rZWVuLW5pZnR5LWRpcmFjL21udC9EZW50YWxDbGluaWMvZGVudGFsLWZyb250ZW5kL3NyYyc7XG5cbi8vIEFsbCBSZWFjdCBtdXN0IGNvbWUgZnJvbSBUTVAgc28gQHRlc3RpbmctbGlicmFyeS9yZWFjdCB1c2VzIHRoZSBzYW1lIGluc3RhbmNlXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIC8vIC0tLSBBbnRkIHN0dWIgLS0tXG4gICAgICB7IGZpbmQ6ICdhbnRkJywgICAgICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4oU1JDLCAndGVzdC9hbnRkLW1vY2sudHN4JykgfSxcbiAgICAgIHsgZmluZDogJ0BhbnQtZGVzaWduL2ljb25zJywgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihTUkMsICd0ZXN0L2FudGQtbW9jay50c3gnKSB9LFxuICAgICAgLy8gLS0tIFJlYWN0IHN1Yi1wYXRocyAobXVzdCBiZSBiZWZvcmUgYmFyZSByZWFjdCBhbGlhcykgLS0tXG4gICAgICB7IGZpbmQ6ICdyZWFjdC9qc3gtZGV2LXJ1bnRpbWUnLCByZXBsYWNlbWVudDogcGF0aC5qb2luKFRNUCwgJ3JlYWN0L2pzeC1kZXYtcnVudGltZS5qcycpIH0sXG4gICAgICB7IGZpbmQ6ICdyZWFjdC9qc3gtcnVudGltZScsICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKFRNUCwgJ3JlYWN0L2pzeC1ydW50aW1lLmpzJykgfSxcbiAgICAgIHsgZmluZDogJ3JlYWN0LWRvbS9jbGllbnQnLCAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4oVE1QLCAncmVhY3QtZG9tL2NsaWVudC5qcycpIH0sXG4gICAgICB7IGZpbmQ6ICdyZWFjdC1kb20vc2VydmVyJywgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKFRNUCwgJ3JlYWN0LWRvbS9zZXJ2ZXIuanMnKSB9LFxuICAgICAgLy8gLS0tIEJhcmUgUmVhY3QgZnJvbSBUTVAgKG1hdGNoZXMgQHRlc3RpbmctbGlicmFyeS9yZWFjdCdzIG93biBSZWFjdCkgLS0tXG4gICAgICB7IGZpbmQ6IC9ecmVhY3QkLywgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4oVE1QLCAncmVhY3QvaW5kZXguanMnKSB9LFxuICAgICAgeyBmaW5kOiAvXnJlYWN0LWRvbSQvLCByZXBsYWNlbWVudDogcGF0aC5qb2luKFRNUCwgJ3JlYWN0LWRvbS9pbmRleC5qcycpIH0sXG4gICAgICAvLyAtLS0gVGVzdGluZyBsaWJyYXJ5IGZyb20gVE1QIC0tLVxuICAgICAgeyBmaW5kOiAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCcsICAgICAgcmVwbGFjZW1lbnQ6IHBhdGguam9pbihUTVAsICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0JykgfSxcbiAgICAgIHsgZmluZDogJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCcsIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4oVE1QLCAnQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50JykgfSxcbiAgICAgIC8vIC0tLSBAdGFuc3RhY2svcmVhY3QtcXVlcnkgZnJvbSBUTVAgKHVzZXMgc2FtZSBSZWFjdCBpbnN0YW5jZSkgLS0tXG4gICAgICB7IGZpbmQ6ICdAdGFuc3RhY2svcmVhY3QtcXVlcnknLCByZXBsYWNlbWVudDogcGF0aC5qb2luKFRNUCwgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeScpIH0sXG4gICAgXSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWycuL3NyYy90ZXN0L3NldHVwLnRzJ10sXG4gICAgY3NzOiBmYWxzZSxcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0ZXN0LHNwZWN9Lnt0cyx0c3h9J10sXG4gICAgdGVzdFRpbWVvdXQ6IDE1MDAwLFxuICAgIGRlcHM6IHsgaW50ZXJvcERlZmF1bHQ6IHRydWUgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5UyxPQUFPLFFBQVE7QUFDeFQsU0FBUyxZQUFZO0FBQ3JCLFNBQVMsbUJBQW1CO0FBVTVCLElBQU0sU0FBUyxPQUFPLFVBQVUsT0FBTyxPQUFPLFFBQVEsU0FBUyxPQUFPLENBQUMsUUFBUSxVQUFVLFFBQVEsQ0FBQyxXQUFXO0FBQzdHLElBQU0sU0FBUyxPQUFPLFVBQVUsT0FBTyxPQUFPLFFBQVEsU0FBUyxPQUFPLFFBQVEsVUFBVSxTQUFTO0FBQUEsQ0FDaEcsVUFBVSxXQUFXLFFBQVEsYUFBYTtBQUUzQyxJQUFNLGlCQUFpQixDQUFDLGtDQUFrQztBQUMxRCxJQUFNLGlCQUFpQjtBQUFBLEVBQ3JCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBQ0EsSUFBTSwwQkFBMEI7QUFBQSxFQUM5QjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUNBLElBQU0seUJBQXlCO0FBQUEsRUFDN0IsVUFBVTtBQUFBLEVBQ1YsU0FBUztBQUFBLEVBQ1QsS0FBSztBQUFBLEVBQ0wsT0FB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
