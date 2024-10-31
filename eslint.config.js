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

module.exports = [
  {
    files: ["**/*.ts"],
    rules: {
      semi: "error",
      "prefer-const": "error"
    },
    ignores: ["build/", "dist/", "tests/", "**/*.spec.ts", ".github"]
  }
];