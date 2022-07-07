module.exports = {
    plugins: [
        require('cssnano'), // css压缩
        require('cssgrace'), // 兼容旧浏览器Hack
        require('postcss-preset-env'), // 将现代CSS转换成浏览器能理解的东西，包含 autoprefixer
        // require('postcss-pxtorem'), // 把PX转换成rem
    ]
}