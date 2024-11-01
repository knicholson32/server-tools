// import js from '@eslint/js';
// import globals from 'globals';
// import ts from 'typescript-eslint';

// export default ts.config(
//   js.configs.recommended,
//   ...ts.configs.recommended,
//   {
//     languageOptions: {
// 	  globals: {
// 	    ...globals.node
// 	  }
// 	}
//   },
//   {
//     files: ["**/*.ts"],

//     languageOptions: {
// 	  parserOptions: {
// 	    parser: ts.parser
// 	  }
// 	}
//   },
//   {
//     ignores: ["build/", "dist/", "tests/", "**/*.spec.ts", ".github"]
//   }
// );

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    rules: {
      semi: "error",
      "prefer-const": "error"
    },
    ignores: ["build/", "dist/", "tests/", "**/*.spec.ts", ".github"]
  }
);