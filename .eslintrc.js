module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: ["airbnb/base", "airbnb-typescript/base", "plugin:react/recommended", "plugin:react/jsx-runtime", "plugin:storybook/recommended"],
  rules: {
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
    "import/prefer-default-export": 0,
    "max-len": ["error", {
      "code": 240
    }],
    "import/extensions": 0,
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/*.stories.*", "**/.storybook/**/*.*", "**/*.test.tsx"],
      "peerDependencies": true
    }],
    "operator-linebreak": 0
  },
  settings: {
    react: {
      version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use

    }
  }
};
