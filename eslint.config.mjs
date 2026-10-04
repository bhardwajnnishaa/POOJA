import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([".next/**", ".vercel/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    // Many Indian phones run older browsers (before Chrome 110) that lack these, and the page crashes.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error",
        ...["toSorted", "toReversed", "toSpliced", "findLast", "findLastIndex", "replaceAll", "at", "with"].map((name) => ({
          selector: `CallExpression[callee.property.name="${name}"]`,
          message: `.${name}() crashes on older phone browsers. Use an older equivalent, e.g. [...list].sort().`,
        })),
        { selector: "CallExpression[callee.name='structuredClone']", message: "structuredClone() is missing on older phone browsers." },
        { selector: "MemberExpression[object.name='Object'][property.name=/^(hasOwn|groupBy)$/]", message: "Missing on older phone browsers." },
      ],
    },
  },
]);

export default eslintConfig;