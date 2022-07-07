const path = require('path');
const Client = require('ssh2').Client;
const publishConf = require('../_confs/project.config').publishConf;
var fs = require('fs');
const chalk = require('chalk')
const readline = require('readline');
const deleteFolder = require('./utils').deleteFolder

/**
 * 1.进入目录
 * 2.删除旧的备份项目
 * 3.将原项目名称加上bak标志为备份文件
 * 4.解压缩上传的zip文件并将名称改为项目名称
 * 5.删除zip文件
 * 6.退出
 * @type {string[]}
 */
const date = new Date();
const _month = date.getMonth()+1;

const uploadShellList = [
    `cd ${publishConf.path}\n`,
    `rm -rf ${publishConf.moudleName}.bak\n`,
    // `zip –r ${publishConf.moudleName}${date.getFullYear()+(_month < 10 ? `0${_month}` : `${_month}`)+date.getDate()}.bak.zip ./${publishConf.moudleName}\n`,
    `mv ${publishConf.moudleName} ${publishConf.moudleName}.bak\n`,
    `rm -rf ${publishConf.moudleName}/\n`,
    `unzip ${publishConf.zipName}.zip\n`,
    `rm -rf ${publishConf.zipName}.zip\n`,
    `exit\n`
]
const params = {file: `./publish/${publishConf.zipName}.zip`, target: `${publishConf.path}/${publishConf.zipName}.zip`}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function Ready () {
    var conn = new Client()
    const user = {
        host: publishConf.host,
        port: publishConf.port,
        username: publishConf.username,
        password: publishConf.password
    }
    if (user.password) {
        Publish(conn, user)
    } else {
        rl.question(chalk.green(`发布至服务器 ${publishConf.host} 请输入服务器密码:`), (answer) => {
            if (answer !== null) {
                user.password = answer.replace(/\r\n$/, '')
                Publish(conn, user)
            }
        })
    }
}
function Publish (conn, user) {
    conn.on('ready', function () {
        console.log('Client :: ready')
        UploadFile(conn, params)
    }).connect(user)
}
/**
 * 上传文件
 * @param conn
 * @param params
 * @constructor
 */
function UploadFile (conn, params) {
    const file = params.file
    const target = params.target
    if (!conn) {
        return
    }
    conn.sftp(function (err, sftp) {
        if (err) {
            throw err
        }
        sftp.fastPut(file, target, {}, function (err, result) {
            if (err) {
                console.log(chalk.red(err.message))
                throw err
            }
            Shell(conn)
        })
    })
}
/**
 * 上传完成后服务器需要执行的内容
 * 删除本地压缩文件
 * @param conn
 * @constructor
 */
function Shell (conn) {
    conn.shell(function (err, stream) {
        if (err) throw err
        stream.on('close', function () {
            console.log('Stream :: close')
            conn.end();
            deleteFolder('publish');
            process.exit();
        }).on('data', function (data) {
            // console.log('STDOUT: ' + data)
        }).stderr.on('data', function (data) {
            console.log('STDERR: ' + data)
        })
        stream.end(uploadShellList.join(''))
    })
}

module.exports = function () {
    try {
        Ready()
    } catch (err) {
        console.log(err)
    }
}
