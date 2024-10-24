/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        // reporters: [
        //     ["vitest-sonar-reporter", { outputFile: "sonar-report.xml" }],
        // ],
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/setupTests.ts"],
        coverage: {
            reporter: ["text", "lcov"],
        },
    },
});
