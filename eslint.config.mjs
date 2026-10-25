import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["**/*.ts", "**/*.tsx"], languageOptions: { globals: { process: "readonly" } } },
  { files: ["deliverables/gtm/build-ga4.mjs"], languageOptions: { globals: { structuredClone: "readonly", URL: "readonly", console: "readonly" } } },
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
]);
