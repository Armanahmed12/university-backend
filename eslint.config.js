// Import the plugin/parser objects
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    // 1. Files to apply this config to (TypeScript files)
    files: ['**/*.ts', '**/*.tsx'],

    // 2. The parser is the engine that understands TypeScript syntax
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json', // Required for rules needing type information
        sourceType: 'module',
      },
    },

    // 3. Plugins provide rules
    plugins: {
      '@typescript-eslint': tsPlugin,
    },

    // 4. Configuration for rules
    // Starts with recommended rules and customizes as needed.
    rules: {
      // Use recommended TypeScript rules
      ...tsPlugin.configs['recommended'].rules,
      
      // Custom rules:
      'no-unused-vars': 'off', // Must be off for the TS version to work
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Allows using '_' for ignored function args
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Sometimes too strict
      
      // Example Express/Mongoose specific rules (optional)
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  
  // 5. Integration with Prettier
  // This step MUST be last. It disables all rules that conflict with Prettier.
  eslintConfigPrettier,
];