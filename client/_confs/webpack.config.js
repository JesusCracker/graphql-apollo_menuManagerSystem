const path = require('path');
const webpack = require('webpack');
// 插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 项目配置文件
const project = require('./project.config');

// 环境变量
const __DEV__ = project.NODE_ENV === 'development';
const __PROD__ = project.NODE_ENV === 'production';
const config = {
    // 模式
    mode: __DEV__ ? 'development' : 'production',
    // 生成 source map
    devtool: __DEV__ ? project.sourcemap : false,
    // // 基础目录
    // context: path.resolve(__dirname, "app"),
    // 入口
    entry: [`${project.srcDir}\\${project.main}`],
    // 出口
    output: {
        path: project.outDir,
        filename: __DEV__ ? '[name].[hash:6].js' : 'static/js/[name]-[chunkhash:6].js',
        chunkFilename: __DEV__ ? '[name].bundle.js' : 'static/js/[name]-[chunkhash:6].js',
        publicPath: project.publicPath
    },
    // 解析器
    resolve: {
        modules: [project.srcDir, "node_modules"],
        alias: {...project.alias},
        extensions: [".js", ".jsx", ".less", ".css", ".json"]
    },
    // 性能
    performance: {
        hints: __DEV__ ? 'warning' : 'error',
    },
    // 外部扩展
    externals: {},
    // 统计信息
    stats: {
        assets: true,
        colors: true,
        errors: true,
        errorDetails: true,
        hash: true,
    },
    // 模块
    module: {
        rules: [
            {
                test: /(\.js|\.jsx)$/,
                include: [project.srcDir, path.resolve(project.basePath, 'libs')],
                exclude: /node_modules/,
                use: 'babel-loader?cacheDirectory'
            },
            {
                test: /\.(bmp|png|jpe?g|gif)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: project.imageSizeLimit,
                    outputPath: "static/images"
                }
            },
            {
                test: /\.(MP4|mp4|webm|ogg|mp3|wav|flac|aac|swf)(\?.*)?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: project.mediaSizeLimit,
                        name: path.posix.join("static", "media/[name].[hash:7].[ext]")
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: path.resolve(project.basePath, 'dll', 'manifest.json')
        }),
        new HtmlWebpackPlugin({
            title: project.title,
            hash: true,
            cache: false,
            inject: true,
            html5: true,
            minify: {
                collapseWhitespace: true,
                minifyJS:true,
                minifyCSS:true
            },
            publicPath: project.publicPath
        }),
        new webpack.DefinePlugin(Object.assign({
            __DEV__,
            __PROD__,
            __PUBPATH__: JSON.stringify(project.publicPath)
        }, project.globals)),
        new MiniCssExtractPlugin({
            filename: "static/css/main.[chunkhash:5].css",
            chunkFilename: "static/css/main.[contenthash:5].css"
        }),
        new webpack.EnvironmentPlugin({
            ENV: project.NODE_ENV,
        })
    ],
    optimization: {}
}
const fontLoader = [
    ["woff", "application/font-woff"],
    ["woff2", "application/font-woff2"],
    ["otf", "font/opentype"],
    ["ttf", "application/octet-stream"],
    ["eot", "application/vnd.ms-fontobject"],
    ["svg", "image/svg+xml"]
]
fontLoader.forEach((font) => {
    let extension = font[0];
    let mimetype = font[1];
    config.module.rules.push({
        test: new RegExp(`\\.${extension}$`),
        loader: "url-loader",
        options: {
            name: "static/fonts/[name].[ext]",
            limit: 1000,
            mimetype
        }
    })
})
if (__DEV__) {
    config.entry.push("webpack-hot-middleware/client?path=./__webpack_hmr&reload=true");
    config.module.rules.push({
        test: [/(\.less)$/],
        include: project.srcDir,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader",
            options: {
                importLoaders: 1,
                modules: {
                    localIdentName: "[path][name]__[local]--[hash:base64:5]"
                }
            }
        },
            {
                loader: "postcss-loader",
                options: {
                    plugins: loader => [
                        require('cssnano')()
                    ]
                }
            },
            {
                loader: "less-loader"
            }]
    })
    config.module.rules.push({
        test: /(\.css)$/,
        include: project.srcDir,
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader"
            },
            {
                loader: "postcss-loader",
                options: {
                    plugins: loader => [
                        require('cssnano')()
                    ]
                }
            },
        ]
    })
    config.module.rules.push({
        test: /(\.css)$/,
        include: /node_modules/,
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader"
            }
        ]
    })
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.performance = {hints: false}
    config.optimization = {splitChunks: {chunks: 'all'}}
}
if (__PROD__) {
    config.module.rules.push({
        test: [/(\.less)$/],
        include: project.srcDir,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: "../../",
                    reloadAll: true,
                    hmr: __DEV__
                }
            },
            {
                loader: "css-loader",
                options: {
                    importLoaders: 1,
                    modules: {
                        localIdentName: "[local][hash:base64:5]"
                    }
                }
            },
            {
                loader: "postcss-loader",
                options: {
                    plugins: loader => [
                        require('cssnano')()
                    ]
                }
            },
            {
                loader: "less-loader"
            }
        ]
    })
    config.module.rules.push({
        test: /(\.css)$/,
        include: project.srcDir,
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader"
            },
            {
                loader: "postcss-loader",
                options: {
                    plugins: loader => [
                        require('cssnano')()
                    ]
                }
            }
        ]
    })
    config.module.rules.push({
        test: /(\.css)$/,
        include: /node_modules/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
            },
            {
                loader: "css-loader"
            }
        ]
    })
    config.plugins.push(new CopyWebpackPlugin([
        {
            from: path.join(project.basePath, "dll"),
            to: path.join(project.outDir, "dll")
        },
        {
            from: path.join(project.basePath, "static"),
            to: path.join(project.outDir, "static"),
            ignore: ['fonts/*']
        }
    ]))
    config.performance = {
        hints: 'error', // 提示时抛出一个错误
        maxEntrypointSize: 500000, // 入口起点的最大体积-最大500KB
        maxAssetSize: 10485760, // 单个资源体积-最大1M
        assetFilter: function (assetFilename) { // 筛选文件
            return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
        }
    }
}
module.exports = config;