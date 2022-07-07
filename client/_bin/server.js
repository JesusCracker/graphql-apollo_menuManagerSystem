process.env.NODE_ENV = 'development';

const express = require('express');
const webpack = require('webpack');
const chalk = require('chalk');
const cp = require('child_process');
const {createProxyMiddleware} = require('http-proxy-middleware');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");


const project = require('../_confs/project.config');
const webpackConfig = require('../_confs/webpack.config.js');
const compiler = webpack(webpackConfig)
const instance = webpackDevMiddleware(compiler, {
    publicPath: project.publicPath
});
const hotMiddleware = webpackHotMiddleware(compiler)
const app = new express();

project.proxyTable.forEach(r => {
    if (r) {
        app.use('/' + r.name, createProxyMiddleware({
            target: r.target, pathRewrite: {['^/' + r.name]: '/'},
            changeOrigin: true,
            secure: false, ...r
        }))
    }
})

app.use(instance);
app.use(hotMiddleware);
app.use(express.static(project.basePath));

function startApp(port = 8000, cb = (err) => {
}) {
    app.listen(port, () => {
        instance.waitUntilValid(() => {
            console.log('当前服务地址: ', chalk.cyan(`\n         http://${require('./utils').getIPAdress()}:${port} \n         http://localhost:${port}`));
            cp.exec(`start http://localhost:${port}`)
        })
    }).on('error', err => {
        if (['EADDRINUSE', 'EACCES'].indexOf(err.code) > -1) {
            console.log(`端口： ${port} 被占用. 尝试使用 ${Number(port) + 1} 端口服务.`)
            startApp(Number(port) + 1, cb)
        } else {
            cb(err)
        }
    })
}

startApp(project.port);