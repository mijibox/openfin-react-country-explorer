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
        contentBase: [ './dist', './res' ],
        before: function (app, server) {
            // Replace 'cdn.openfin.co' URL's with webpack-dev-server endpoint when running locally
            app.use(/\/?(.*app\.json)/, async (req, res, next) => {
                const configPath = req.params[0]; // app.json path, relative to dist dir

                // Parse app.json
                const config = require(path.resolve('res', configPath));
                const {url, applicationIcon} = config.startup_app;

                // Edit manifest
                config.startup_app.url = replaceUrl(url);
                config.startup_app.applicationIcon = replaceUrl(applicationIcon);

                // Return modified JSON to client
                res.header('Content-Type', 'application/json; charset=utf-8');
                res.send(JSON.stringify(config, null, 4));
            });
        },
        after: function (app, server) {
            // Server ready, launch application
            const {launch} = require('hadouken-js-adapter');
            launch({manifestUrl: 'http://localhost:8080/app.json'});
        }
    },
});