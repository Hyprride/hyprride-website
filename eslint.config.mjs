import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

/**
 * Flat config (ESLint 9). `next lint` is deprecated and removed in Next 16, so
 * linting runs through the ESLint CLI directly — see the `lint` script.
 * `next/core-web-vitals` carries the a11y and performance rules; `next/typescript`
 * layers on the TypeScript recommendations.
 */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
