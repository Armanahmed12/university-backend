// .prettierrc.js (ES Module Syntax)

/** @type {import("prettier").Config} */
const config = {
  // Use single quotes instead of double quotes
  singleQuote: true,
  // Print trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',
  // Use tabs for indentation
  useTabs: false,
  // Indent with 2 spaces
  tabWidth: 2,
  // Add a semicolon at the end of every statement
  semi: true,
  // Specify the line length that the printer will wrap on
  printWidth: 80,
};

export default config; // <-- This is the key change!