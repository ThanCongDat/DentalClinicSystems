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
var TMP = "/tmp/vitest-runner/node_modules";
var SRC = "/sessions/keen-nifty-dirac/mnt/DentalClinic/dental-frontend/src";
var vitest_config_default = defineConfig({
  resolve: {
    alias: {
      "@testing-library/jest-dom": `${TMP}/@testing-library/jest-dom`,
      "@testing-library/react": `${TMP}/@testing-library/react`,
      "@testing-library/user-event": `${TMP}/@testing-library/user-event`,
      // Stub heavy antd with lightweight mock
      "antd": `${SRC}/test/antd-mock.tsx`,
      "@ant-design/icons": `${SRC}/test/antd-mock.tsx`
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    testTimeout: 15e3,
    deps: {
      interopDefault: true,
      moduleDirectories: ["node_modules", TMP]
    }
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vLi4vLi4vdG1wL3ZpdGVzdC1ydW5uZXIvbm9kZV9tb2R1bGVzL3ZpdGVzdC9kaXN0L2NvbmZpZy5qcyIsICJ2aXRlc3QuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL3RtcC92aXRlc3QtcnVubmVyL25vZGVfbW9kdWxlcy92aXRlc3QvZGlzdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL3RtcC92aXRlc3QtcnVubmVyL25vZGVfbW9kdWxlcy92aXRlc3QvZGlzdC9jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL3RtcC92aXRlc3QtcnVubmVyL25vZGVfbW9kdWxlcy92aXRlc3QvZGlzdC9jb25maWcuanNcIjtpbXBvcnQgb3MgZnJvbSAnbm9kZTpvcyc7XG5pbXBvcnQgeyBpc0NJIH0gZnJvbSAnc3RkLWVudic7XG5leHBvcnQgeyBtZXJnZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG5jb25zdCBkZWZhdWx0QnJvd3NlclBvcnQgPSA2MzMxNTtcbmNvbnN0IGV4dHJhSW5saW5lRGVwcyA9IFtcbiAgL14oPyEuKm5vZGVfbW9kdWxlcykuKlxcLm1qcyQvLFxuICAvXig/IS4qbm9kZV9tb2R1bGVzKS4qXFwuY2pzXFwuanMkLyxcbiAgLy8gVml0ZSBjbGllbnRcbiAgL3ZpdGVcXHcqXFwvZGlzdFxcL2NsaWVudFxcL2Vudi5tanMvXG5dO1xuXG5jb25zdCBpc05vZGUgPSB0eXBlb2YgcHJvY2VzcyA8IFwidVwiICYmIHR5cGVvZiBwcm9jZXNzLnN0ZG91dCA8IFwidVwiICYmICFwcm9jZXNzLnZlcnNpb25zPy5kZW5vICYmICFnbG9iYWxUaGlzLndpbmRvdztcbmNvbnN0IGlzRGVubyA9IHR5cGVvZiBwcm9jZXNzIDwgXCJ1XCIgJiYgdHlwZW9mIHByb2Nlc3Muc3Rkb3V0IDwgXCJ1XCIgJiYgcHJvY2Vzcy52ZXJzaW9ucz8uZGVubyAhPT0gdm9pZCAwO1xuKGlzTm9kZSB8fCBpc0Rlbm8pICYmIHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIjtcblxuY29uc3QgZGVmYXVsdEluY2x1ZGUgPSBbXCIqKi8qLnt0ZXN0LHNwZWN9Lj8oY3xtKVtqdF1zPyh4KVwiXTtcbmNvbnN0IGRlZmF1bHRFeGNsdWRlID0gW1xuICBcIioqL25vZGVfbW9kdWxlcy8qKlwiLFxuICBcIioqL2Rpc3QvKipcIixcbiAgXCIqKi9jeXByZXNzLyoqXCIsXG4gIFwiKiovLntpZGVhLGdpdCxjYWNoZSxvdXRwdXQsdGVtcH0vKipcIixcbiAgXCIqKi97a2FybWEscm9sbHVwLHdlYnBhY2ssdml0ZSx2aXRlc3QsamVzdCxhdmEsYmFiZWwsbnljLGN5cHJlc3MsdHN1cCxidWlsZCxlc2xpbnQscHJldHRpZXJ9LmNvbmZpZy4qXCJcbl07XG5jb25zdCBkZWZhdWx0Q292ZXJhZ2VFeGNsdWRlcyA9IFtcbiAgXCJjb3ZlcmFnZS8qKlwiLFxuICBcImRpc3QvKipcIixcbiAgXCIqKi9ub2RlX21vZHVsZXMvKipcIixcbiAgXCIqKi9bLl0qKlwiLFxuICBcInBhY2thZ2VzLyovdGVzdD8ocykvKipcIixcbiAgXCIqKi8qLmQudHNcIixcbiAgXCIqKi92aXJ0dWFsOipcIixcbiAgXCIqKi9fX3gwMF9fKlwiLFxuICBcIioqL1xcMCpcIixcbiAgXCJjeXByZXNzLyoqXCIsXG4gIFwidGVzdD8ocykvKipcIixcbiAgXCJ0ZXN0PygtKikuPyhjfG0pW2p0XXM/KHgpXCIsXG4gIFwiKiovKnsuLC19e3Rlc3Qsc3BlYyxiZW5jaCxiZW5jaG1hcmt9PygtZCkuPyhjfG0pW2p0XXM/KHgpXCIsXG4gIFwiKiovX190ZXN0c19fLyoqXCIsXG4gIFwiKiove2thcm1hLHJvbGx1cCx3ZWJwYWNrLHZpdGUsdml0ZXN0LGplc3QsYXZhLGJhYmVsLG55YyxjeXByZXNzLHRzdXAsYnVpbGQsZXNsaW50LHByZXR0aWVyfS5jb25maWcuKlwiLFxuICBcIioqL3ZpdGVzdC57d29ya3NwYWNlLHByb2plY3RzfS5banRdcz8ob24pXCIsXG4gIFwiKiovLntlc2xpbnQsbW9jaGEscHJldHRpZXJ9cmMuez8oY3xtKWpzLHltbH1cIlxuXTtcbmNvbnN0IGNvdmVyYWdlQ29uZmlnRGVmYXVsdHMgPSB7XG4gIHByb3ZpZGVyOiBcInY4XCIsXG4gIGVuYWJsZWQ6IGZhbHNlLFxuICBhbGw6IHRydWUsXG4gIGNsZWFuOiB0cnVlLFxuICBjbGVhbk9uUmVydW46IHRydWUsXG4gIHJlcG9ydHNEaXJlY3Rvcnk6IFwiLi9jb3ZlcmFnZVwiLFxuICBleGNsdWRlOiBkZWZhdWx0Q292ZXJhZ2VFeGNsdWRlcyxcbiAgcmVwb3J0T25GYWlsdXJlOiBmYWxzZSxcbiAgcmVwb3J0ZXI6IFtcbiAgICBbXCJ0ZXh0XCIsIHt9XSxcbiAgICBbXCJodG1sXCIsIHt9XSxcbiAgICBbXCJjbG92ZXJcIiwge31dLFxuICAgIFtcImpzb25cIiwge31dXG4gIF0sXG4gIGV4dGVuc2lvbjogW1xuICAgIFwiLmpzXCIsXG4gICAgXCIuY2pzXCIsXG4gICAgXCIubWpzXCIsXG4gICAgXCIudHNcIixcbiAgICBcIi5tdHNcIixcbiAgICBcIi50c3hcIixcbiAgICBcIi5qc3hcIixcbiAgICBcIi52dWVcIixcbiAgICBcIi5zdmVsdGVcIixcbiAgICBcIi5tYXJrb1wiLFxuICAgIFwiLmFzdHJvXCJcbiAgXSxcbiAgYWxsb3dFeHRlcm5hbDogZmFsc2UsXG4gIGV4Y2x1ZGVBZnRlclJlbWFwOiBmYWxzZSxcbiAgaWdub3JlRW1wdHlMaW5lczogdHJ1ZSxcbiAgcHJvY2Vzc2luZ0NvbmN1cnJlbmN5OiBNYXRoLm1pbihcbiAgICAyMCxcbiAgICBvcy5hdmFpbGFibGVQYXJhbGxlbGlzbT8uKCkgPz8gb3MuY3B1cygpLmxlbmd0aFxuICApXG59O1xuY29uc3QgZmFrZVRpbWVyc0RlZmF1bHRzID0ge1xuICBsb29wTGltaXQ6IDFlNCxcbiAgc2hvdWxkQ2xlYXJOYXRpdmVUaW1lcnM6IHRydWUsXG4gIHRvRmFrZTogW1xuICAgIFwic2V0VGltZW91dFwiLFxuICAgIFwiY2xlYXJUaW1lb3V0XCIsXG4gICAgXCJzZXRJbnRlcnZhbFwiLFxuICAgIFwiY2xlYXJJbnRlcnZhbFwiLFxuICAgIFwic2V0SW1tZWRpYXRlXCIsXG4gICAgXCJjbGVhckltbWVkaWF0ZVwiLFxuICAgIFwiRGF0ZVwiXG4gIF1cbn07XG5jb25zdCBjb25maWcgPSB7XG4gIGFsbG93T25seTogIWlzQ0ksXG4gIGlzb2xhdGU6IHRydWUsXG4gIHdhdGNoOiAhaXNDSSxcbiAgZ2xvYmFsczogZmFsc2UsXG4gIGVudmlyb25tZW50OiBcIm5vZGVcIixcbiAgcG9vbDogXCJmb3Jrc1wiLFxuICBjbGVhck1vY2tzOiBmYWxzZSxcbiAgcmVzdG9yZU1vY2tzOiBmYWxzZSxcbiAgbW9ja1Jlc2V0OiBmYWxzZSxcbiAgdW5zdHViR2xvYmFsczogZmFsc2UsXG4gIHVuc3R1YkVudnM6IGZhbHNlLFxuICBpbmNsdWRlOiBkZWZhdWx0SW5jbHVkZSxcbiAgZXhjbHVkZTogZGVmYXVsdEV4Y2x1ZGUsXG4gIHRlYXJkb3duVGltZW91dDogMWU0LFxuICBmb3JjZVJlcnVuVHJpZ2dlcnM6IFtcIioqL3BhY2thZ2UuanNvbi8qKlwiLCBcIioqL3t2aXRlc3Qsdml0ZX0uY29uZmlnLiovKipcIl0sXG4gIHVwZGF0ZTogZmFsc2UsXG4gIHJlcG9ydGVyczogW10sXG4gIHNpbGVudDogZmFsc2UsXG4gIGhpZGVTa2lwcGVkVGVzdHM6IGZhbHNlLFxuICBhcGk6IGZhbHNlLFxuICB1aTogZmFsc2UsXG4gIHVpQmFzZTogXCIvX192aXRlc3RfXy9cIixcbiAgb3BlbjogIWlzQ0ksXG4gIGNzczoge1xuICAgIGluY2x1ZGU6IFtdXG4gIH0sXG4gIGNvdmVyYWdlOiBjb3ZlcmFnZUNvbmZpZ0RlZmF1bHRzLFxuICBmYWtlVGltZXJzOiBmYWtlVGltZXJzRGVmYXVsdHMsXG4gIG1heENvbmN1cnJlbmN5OiA1LFxuICBkYW5nZXJvdXNseUlnbm9yZVVuaGFuZGxlZEVycm9yczogZmFsc2UsXG4gIHR5cGVjaGVjazoge1xuICAgIGNoZWNrZXI6IFwidHNjXCIsXG4gICAgaW5jbHVkZTogW1wiKiovKi57dGVzdCxzcGVjfS1kLj8oY3xtKVtqdF1zPyh4KVwiXSxcbiAgICBleGNsdWRlOiBkZWZhdWx0RXhjbHVkZVxuICB9LFxuICBzbG93VGVzdFRocmVzaG9sZDogMzAwLFxuICBkaXNhYmxlQ29uc29sZUludGVyY2VwdDogZmFsc2Vcbn07XG5jb25zdCBjb25maWdEZWZhdWx0cyA9IE9iamVjdC5mcmVlemUoY29uZmlnKTtcblxuZnVuY3Rpb24gZGVmaW5lQ29uZmlnKGNvbmZpZykge1xuICByZXR1cm4gY29uZmlnO1xufVxuZnVuY3Rpb24gZGVmaW5lUHJvamVjdChjb25maWcpIHtcbiAgcmV0dXJuIGNvbmZpZztcbn1cbmZ1bmN0aW9uIGRlZmluZVdvcmtzcGFjZShjb25maWcpIHtcbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuZXhwb3J0IHsgY29uZmlnRGVmYXVsdHMsIGNvdmVyYWdlQ29uZmlnRGVmYXVsdHMsIGRlZmF1bHRCcm93c2VyUG9ydCwgZGVmYXVsdEV4Y2x1ZGUsIGRlZmF1bHRJbmNsdWRlLCBkZWZpbmVDb25maWcsIGRlZmluZVByb2plY3QsIGRlZmluZVdvcmtzcGFjZSwgZXh0cmFJbmxpbmVEZXBzIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9zZXNzaW9ucy9rZWVuLW5pZnR5LWRpcmFjL21udC9EZW50YWxDbGluaWMvZGVudGFsLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMva2Vlbi1uaWZ0eS1kaXJhYy9tbnQvRGVudGFsQ2xpbmljL2RlbnRhbC1mcm9udGVuZC92aXRlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy9rZWVuLW5pZnR5LWRpcmFjL21udC9EZW50YWxDbGluaWMvZGVudGFsLWZyb250ZW5kL3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICcvdG1wL3ZpdGVzdC1ydW5uZXIvbm9kZV9tb2R1bGVzL3ZpdGVzdC9kaXN0L2NvbmZpZy5qcyc7XG5cbmNvbnN0IFRNUCA9ICcvdG1wL3ZpdGVzdC1ydW5uZXIvbm9kZV9tb2R1bGVzJztcbmNvbnN0IFNSQyA9ICcvc2Vzc2lvbnMva2Vlbi1uaWZ0eS1kaXJhYy9tbnQvRGVudGFsQ2xpbmljL2RlbnRhbC1mcm9udGVuZC9zcmMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAdGVzdGluZy1saWJyYXJ5L2plc3QtZG9tJzogYCR7VE1QfS9AdGVzdGluZy1saWJyYXJ5L2plc3QtZG9tYCxcbiAgICAgICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0JzogYCR7VE1QfS9AdGVzdGluZy1saWJyYXJ5L3JlYWN0YCxcbiAgICAgICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnOiBgJHtUTVB9L0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudGAsXG4gICAgICAvLyBTdHViIGhlYXZ5IGFudGQgd2l0aCBsaWdodHdlaWdodCBtb2NrXG4gICAgICAnYW50ZCc6IGAke1NSQ30vdGVzdC9hbnRkLW1vY2sudHN4YCxcbiAgICAgICdAYW50LWRlc2lnbi9pY29ucyc6IGAke1NSQ30vdGVzdC9hbnRkLW1vY2sudHN4YCxcbiAgICB9LFxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBzZXR1cEZpbGVzOiBbJy4vc3JjL3Rlc3Qvc2V0dXAudHMnXSxcbiAgICBjc3M6IGZhbHNlLFxuICAgIGluY2x1ZGU6IFsnc3JjLyoqLyoue3Rlc3Qsc3BlY30ue3RzLHRzeH0nXSxcbiAgICB0ZXN0VGltZW91dDogMTUwMDAsXG4gICAgZGVwczoge1xuICAgICAgaW50ZXJvcERlZmF1bHQ6IHRydWUsXG4gICAgICBtb2R1bGVEaXJlY3RvcmllczogWydub2RlX21vZHVsZXMnLCBUTVBdLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVMsT0FBTyxRQUFRO0FBQ3hULFNBQVMsWUFBWTtBQUNyQixTQUFTLG1CQUFtQjtBQVU1QixJQUFNLFNBQVMsT0FBTyxVQUFVLE9BQU8sT0FBTyxRQUFRLFNBQVMsT0FBTyxDQUFDLFFBQVEsVUFBVSxRQUFRLENBQUMsV0FBVztBQUM3RyxJQUFNLFNBQVMsT0FBTyxVQUFVLE9BQU8sT0FBTyxRQUFRLFNBQVMsT0FBTyxRQUFRLFVBQVUsU0FBUztBQUFBLENBQ2hHLFVBQVUsV0FBVyxRQUFRLGFBQWE7QUFFM0MsSUFBTSxpQkFBaUIsQ0FBQyxrQ0FBa0M7QUFDMUQsSUFBTSxpQkFBaUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUNBLElBQU0sMEJBQTBCO0FBQUEsRUFDOUI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFDQSxJQUFNLHlCQUF5QjtBQUFBLEVBQzdCLFVBQVU7QUFBQSxFQUNWLFNBQVM7QUFBQSxFQUNULEtBQUs7QUFBQSxFQUNMLE9BQU87QUFBQSxFQUNQLGNBQWM7QUFBQSxFQUNkLGtCQUFrQjtBQUFBLEVBQ2xCLFNBQVM7QUFBQSxFQUNULGlCQUFpQjtBQUFBLEVBQ2pCLFVBQVU7QUFBQSxJQUNSLENBQUMsUUFBUSxDQUFDLENB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
