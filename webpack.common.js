const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'laputa',
            favicon: './src/favicon.ico',
            minify: {caseSensitive: true, collapseWhitespace: true},
            template: './src/index.ejs'
        }),
    ],
    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.vue'],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg|webp)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[sha512:hash:base64:7].[ext]'
                        }
                    },
                    // {
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //         gifsicle: {
                    //             interlaced: false,
                    //         },
                    //         optipng: {
                    //             optimizationLevel: 7,
                    //         },
                    //         pngquant: {
                    //             quality: '65-90',
                    //             speed: 4
                    //         },
                    //         mozjpeg: {
                    //             progressive: true,
                    //             quality: 65
                    //         },
                    //         // Specifying webp here will create a WEBP version of your JPG/PNG images
                    //         webp: {
                    //             quality: 75
                    //         }
                    //     }
                    // }
                ]
            }
        ]
    }
};
