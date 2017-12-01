const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './distTemp'
    },
    output: {
        path: path.resolve(__dirname, 'distTemp')
    },
});
