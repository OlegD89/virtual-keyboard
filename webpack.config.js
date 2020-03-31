const webpack = require('webpack');
const path = require('path');

module.exports = (env, options) => {
    const isDevelopment = options.mode === 'development';

    const config = {
        mode: isDevelopment ? 'development' : 'production',
        devtool: isDevelopment ? 'source-map' : 'none',
        watch: isDevelopment,
        entry: ['./js/main.js'],
        output: {
            path: __dirname,
            filename: 'script.js'
        }
    }

    return config;
}