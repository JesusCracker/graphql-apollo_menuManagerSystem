const path = require('path');
const basePath = path.resolve(__dirname, "../");
module.exports = {
    port:'8000',
    title:'加载中...',
    NODE_ENV: process.env.NODE_ENV || 'development',
    /** 根路径全名 */
    basePath,
    /** 源文件目录 */
    srcDir: path.resolve(basePath, 'src'),
    /** 打包输出路径 */
    outDir: path.resolve(basePath, 'dist'),
    /** 入口文件 */
    main: './index.js',
    /** sourcemap */
    sourcemap: 'eval-source-map',
    /** 公共路径 */
    publicPath:process.env.NODE_ENV==='development'?'':'./',
    alias: {
        Assets: path.resolve(basePath, "src/assets/"),
        libs: path.resolve(basePath, "libs/"),
        Utils: path.resolve(basePath, "src/utils/"),
        // Models: path.resolve(basePath, "src/models/"),
        Commons: path.resolve(basePath, "src/commons/"),
        Components: path.resolve(basePath, "src/components/"),
        Services: path.resolve(basePath, "src/services/"),
        // Static: path.resolve(basePath, "static/")
    },
    imageSizeLimit:100,
    mediaSizeLimit:100,
    // 全局变量
    globals: {
    },
    vendor: [
        'react',
        'react-dom',
        // 'mobx',
        "normalize.css",
        path.resolve(__dirname, '../', "static/fonts/iconfont.css")
    ],
    // 反向代理
    proxyTable: [
    ],
    // 如果用邮件模板就配置 mailConf
    mailConf:{ // 项目邮件模板，不同据点配置不同
        softName:'局点分发页', // 软件|项目名称
        version:'0.0.1', // 版本号
        author:'李杰',
        leader:'-', // 审核|审批人
        pm:'李杰', // PM
        pmEmail:'lijie@amtv.cn', // PM邮箱
        dev:{
            server:'10.196.12.6', // 测试服务器
            catagory:'/AMT/web/www' // 测试目录
        },
        pro:{
            server:'10.196.11.68', // 正式服务器
            catagory:'/AMT/web/www' // 正式目录
        }
    },
    // 如果需要自动上传就配置 publishConf
    publishConf:{
        host: '192.168.2.201', // ftpIP
        port: 22, // ftp端口
        username: 'root', // ftp账号
        password: 'Amt@2020.', // ftp密码。可以不配置，在上传的时候手动输入
        path:'/web/data/www/', // ftp目录
        moudleName:'homePage', // 模块名称 ''或者'loginPage'
        zipName:'dist', // 压缩包名称
        zipType:'zip', // 压缩包类型 zip或者tar
    }
}