const fs = require("fs");
const os = require('os');
const archiver = require('archiver')

// 删除目录和文件夹
function deleteFolder(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

// 打包目录
function PackFolder(DEFAULT_CONF = {
        zipName: '', // 压缩包名
        zipType: '', // 压缩包类型 aip|tar
        outDir: '', // 需要打包的目录
        moudleName: '' // 模块名称 ''或者'loginPage'
    }, onClose = null) {
    if (!fs.existsSync(`publish`)) {
        fs.mkdirSync('publish')
    }
    var output = fs.createWriteStream(`publish/${DEFAULT_CONF.zipName}.${DEFAULT_CONF.zipType}`)
    var archive = archiver(DEFAULT_CONF.zipType)

    output.on('close', function () {
        console.log('compress completed...ready upload')
        onClose && onClose();
    })

    output.on('end', function () {
        console.log('Data has been drained');
    })

    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            console.log('warning-code===ENOENT');
        } else {
            throw err;
        }
    });

    archive.on('error', function (err) {
        throw err
    })

    archive.pipe(output)
    archive.directory(DEFAULT_CONF.outDir, DEFAULT_CONF.moudleName);
    archive.finalize()
}

function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

module.exports = {
    deleteFolder,
    PackFolder,
    getIPAdress
}