// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default [
  // Ignore generated files
  {
    ignores: [".astro/**/*", "dist/**/*", "node_modules/**/*"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],

  {
    files: ["commitlint.config.cjs", "eslint.config.mjs"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
  },

  {
    files: ["**/*.mjs", "**/*.js"],
    languageOptions: {
      globals: {
        URL: "readonly",
      },
    },
  },

  {
    files: ["**/*.astro"],
    languageOptions: {
      globals: {
        DOMStringMap: "readonly",
        App: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": false,
        },
      ],
      "no-empty": "off",
      "no-constant-binary-expression": "off",
    },
  },

  {
    files: ["**/*.js", "**/*.mjs", "**/*.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": false,
        },
      ],
    },
  },
];
