
module.exports = {
    env: {
      browser: true,
      node: true,
    },
    extends: ['eslint-config-airbnb-base'],
    rules: {
        "semi": ["error", "always"],
        "quotes": ["error", "single"],
        "no-underscore-dangle": [0], //локальные методы и переменные начинаются с _. this._Mesthod(); that._Method()
        "linebreak-style": ["error", "windows"]
      },
  }