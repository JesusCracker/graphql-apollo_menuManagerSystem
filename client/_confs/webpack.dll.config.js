const path    = require('path');
const webpack = require('webpack');
const project = require('./project.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry: {
        common: project.vendor
    },
    output: {
        path: path.resolve(project.basePath, 'dll'),
        filename: '[name].dll.js',
        library: '[name]_library',
        publicPath: project.publicPath
    },
    module:{
        rules:[{
                test: /(\.css)$/,
                include: [/node_modules/,/static/],
                use: [
                    {
                        // loader: "style-loader"
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader",
                        options:{
                            plugins:loader=>[
                                require('cssnano')()
                            ]
                        }
                    },
                ]
            }
        ].concat([
            ["woff", "application/font-woff"],
            ["woff2", "application/font-woff2"],
            ["otf", "font/opentype"],
            ["ttf", "application/octet-stream"],
            ["eot", "application/vnd.ms-fontobject"],
            ["svg", "image/svg+xml"]
        ].map(font => {
            let extension = font[0];
            let mimetype = font[1];
            return {
                test: new RegExp(`\\.${extension}$`),
                loader: "url-loader",
                options: {
                    name: "fonts/[name].[ext]",
                    limit: 1000,
                    mimetype
                }
            }
        }))
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "common.dll.css"
        }),
        new webpack.DllPlugin({
            name: '[name]_library',
            path: path.resolve(project.basePath, 'dll', 'manifest.json'),
            context: project.basePath
        })
    ],
    performance:{
        hints:false
    }
};