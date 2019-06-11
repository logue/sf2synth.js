module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "google",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
  ],
  "rules": {
    "max-len": 0,
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "object-curly-spacing": ["error", "always"]
  },
  "overrides": [
    {
      "files": ["./bin/*"],
      "rules": {
        "require-jsdoc": "off"
      }
    }
  ]
};