module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.js'],
  "moduleNameMapper": {
    "\\.(css|scss)$": "identity-obj-proxy"
  },
  setupFiles: [
    'react-app-polyfill/jsdom'
  ]
};


