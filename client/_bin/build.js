process.env.NODE_ENV = 'production';

const project = require('../_confs/project.config');
const ora = require('ora')
const webpack = require('webpack');
const chalk = require('chalk');
const utils = require('./utils');
const spinner = new ora('Webpack is compiling ...\n');
spinner.color = 'green';
spinner.start();
console.log(`clear output directory : ${project.outDir}`);
utils.deleteFolder(project.outDir)
webpack(require('../_confs/webpack.config'))
    .run((err, stats) => {
    if (err) {
        console.log('Webpack compile failure',err)
    } else {
        spinner.stop();
        process.stdout.write(stats.toString({
            colors       : true,
            modules      : false,
            children     : false,
            chunks       : false,
            chunkModules : false
        }) + '\n\n');
        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }
        console.info('\x1B[32m%s\x1b[0m', [
            "  █████╗   █████╗     █████╗  ████████╗",
            " ██╔══██╗  ██╔═██╗   ██╔╝██║     ██╔══╝",
            " ███████║  ██║ ╚██╗ ██╔╝ ██║     ██║",
            " ██╔══██║  ██║  ╚███╔╝   ██║     ██║",
            " ██║  ██║  ██║   ███║    ██║     ██║",
            " ╚═╝  ╚═╝  ╚═╝   ╚══╝    ╚═╝     ╚═╝",
        ].join('\n'));
        console.log(chalk.cyan('  Webpack compiler finished successfully！ See ./dist.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '       Opening index.html over file:// won\'t work.\n'
        ))

        if(process.env.PUB==='true'){
            utils.PackFolder({
                zipName:project.publishConf.zipName,
                zipType:project.publishConf.zipType,
                outDir:project.outDir,
                moudleName:project.publishConf.moudleName
            },()=>{
                require('./publish_ftp')();
            })
        }
    }
});
