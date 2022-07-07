var http = require('http');
const cp = require('child_process');
const execSync = require('child_process').execSync;
const mailConf = require('../_confs/project.config').mailConf;

function startApp(port = 8000, cb = (err, port) => {}) {
    const server = http.createServer((request, response) => {
        console.log('cc',cp)
        response.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
        if (request.url !== '/favicon.ico') {
            const commit = execSync('git show -s --format=%H').toString().trim(); //当前提交的版本号
            const name = execSync('git show -s --format=%cn').toString().trim(); //姓名
            const date = new Date(execSync('git show -s --format=%cd').toString()); //日期
            const message = execSync('git show -s --format=%s').toString().trim(); //说明
            const _date = new Date();
            response.end(`<!DOCTYPE html>
                        <html lang="zh"><head><meta charset="UTF-8"><title>邮件模板-${mailConf.softName}</title>
    <style>
        *{margin: 0;padding: 0;}
        h2{text-align: center;height: 45px;line-height: 45px;}
        #sendMailCopy{
            position: absolute;top: 8px;right: 15px;font-size: 14px;color:#333;padding: 3px 5px;cursor: pointer;
        }
        #container{position: absolute;top: 45px;right: 0;bottom: 0;left: 0;}
    </style>
</head>
<body>
<h2>邮件模板</h2>
<button id="sendMailCopy">发送邮件</button>
<div id="container">
    <table width="100%" style="border-collapse: collapse;margin: 0 auto;text-align: left;">
        <thead><tr><th colspan="6" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background-color: #CCE8EB;text-align: center;">软件版本发布</th></tr></thead>
        <tbody>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #fff;">软件名称：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #fff;">${mailConf.softName}</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #F5FAFA;">发布版本：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;">${mailConf.version}</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #fff;">发布日期：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #fff;">${_date.getFullYear()}.${_date.getMonth() + 1}.${_date.getDate()}</td></tr>
            <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #F5FAFA;">发布人：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;">${mailConf.author}</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #fff;">审核/批准人：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #fff;">${mailConf.leader}</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #F5FAFA;">批准日期：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;">${_date.getFullYear()}.${_date.getMonth() + 1}.${_date.getDate()}</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #fff;">发布类型：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #fff;">${process.env.NODE_ENV === 'development' ? '测试版本' : '正式版本'}</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #F5FAFA;">运行环境：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;">nginx服务</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #fff;">项目经理：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #fff;">${mailConf.pm}</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #F5FAFA;">Commit ID：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;"><a href="${'#'}">${commit}</a></td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #fff;">发布包：</td><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #fff;">&nbsp;</td></tr>
        <tr><td rowspan="3" style="border: 1px solid #cad9ea;color: #666;height: 30px;text-align: right;background: #F5FAFA;">部署说明：</td>
            <td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;width:110px;background: #F5FAFA;">服务器：</td><td colspan="4" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;">${mailConf[process.env.NODE_ENV === 'development' ? 'dev' : 'pro'].server}</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #fff;">目录：</td><td colspan="4" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #fff;">${mailConf[process.env.NODE_ENV === 'development' ? 'dev' : 'pro'].catagory}</td></tr>
        <tr style="background-color: #FFF;"><td colspan="5" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;">
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            <div>&nbsp;</div>
        </td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;text-align: right;">注意事项：</td><td colspan="5" style="border: 1px solid #cad9ea;height: 30px;padding: 2px 4px;color: orange;">更新包是增量,请覆盖解压,覆盖之前请备份原有项目文件</td></tr>
        </tbody>
        <thead style="text-align: center">
        <tr>
            <th style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;width: 150px;background-color: #CCE8EB;">编号</th>
            <th style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background-color: #CCE8EB;">变化状态</th>
            <th colspan="2" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background-color: #CCE8EB;">简要说明</th>
            <th style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background-color: #CCE8EB;">变更人</th>
            <th style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;width: 200px;background-color: #CCE8EB;">变更日期</th>
        </tr>
        </thead>
        <tbody style="text-align: center">
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;">1</td><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;">MODIFIED</td><td colspan="2" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;text-align: left;">${message}</td><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;">${name}</td><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;">${date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()}</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;">&nbsp;</td><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;">&nbsp;</td><td colspan="2" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;text-align: left;">&nbsp;</td><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;">&nbsp;</td><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;background: #F5FAFA;">&nbsp;</td></tr>
        <tr><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;">&nbsp;</td><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;">&nbsp;</td><td colspan="2" style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;text-align: left;">&nbsp;</td><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;">&nbsp;</td><td style="border: 1px solid #cad9ea;color: #666;height: 30px;padding: 2px 4px;">&nbsp;</td></tr>
        </tbody>
    </table>
</div>
</body>
</html>
                        <script>
    var $email = '${mailConf.pmEmail}';
    var $title = encodeURI('【版本发布】${mailConf.softName}${process.env.NODE_ENV === 'development' ? '测试环境' : '正式环境'}XX发布 ${mailConf.version}');
    var $body = encodeURI('Dear, ${mailConf.pm}');
    document.designMode = "on" || "off";
    document.getElementById('sendMailCopy').onclick = function(){
        var text = document.getElementById('container');
        if (document.body.createTextRange) {
            var rangeT = document.body.createTextRange();
            rangeT.moveToElementText(text);
            rangeT.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            alert('当前浏览器不支持，请升级浏览器或者换成最新的Chrome浏览器');
        }
        document.execCommand('Copy',false,null);
        setTimeout(function () {
            location.href = 'mailto:'+$email+'?subject='+$title+'&body='+$body;
        },500)
    }
</script>`);
        }
    }).listen(port)
    server.on('listening', () => {
        // console.log(`当前服务地址: http://127.0.0.1:${port}  http://localhost:${port} `);
        cp.exec(`start http://127.0.0.1:${port}`)
    })

    server.on('error', (err) => {
        if (['EADDRINUSE', 'EACCES'].indexOf(err.code) > -1) {
            startApp(port + 1, cb)
            console.log(`端口： ${port} 被占用.尝试使用 ${port + 1} 端口服务.`)
        } else {
            cb(err)
        }
    })

}

startApp(8000);