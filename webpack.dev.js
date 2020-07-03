const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');


let CDN_URL = "https://cdn.example.com/";

function replaceUrl(url) {
    return url && url.replace(CDN_URL, 'http://localhost:8080/');
}

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: [ './dist', './public' ],
        historyApiFallback: true,
        after: function (app, server) {
            // Server ready, launch application
            const {launch} = require('hadouken-js-adapter');
            launch({manifestUrl: 'http://localhost:8080/app.json'});
        }
    },
});