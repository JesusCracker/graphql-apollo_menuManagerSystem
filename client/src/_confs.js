import {createContext} from 'react';
import store from 'Utils/storage';
import defaultImg from 'Assets/images/default.jpg'
let _conf = {};
switch (process.env.NODE_ENV) {
    case 'production': // 生产环境
        _conf = {
            lang : store.getStore('lang')  || "zh", // 语言
            theme : store.getStore('theme')  || "dark", // 主题
            title : store.getStore('title')  || "主页", // 标题
            moudleName:'局点分发页', // 模块名称
            homeUrl:store.getStore('homeUrl') || '/', // 主页
            loginUrl:store.getStore('loginUrl') || '/loginPage/', // 登录地址
            hasIcon:store.hasStore('hasIcon') ? String(store.getStore('hasIcon'))==='true' : false, // 是否显示logo
            defaultImage:store.getStore('defaultImage') || defaultImg,
            userInfo:{username:'游客'} // 当前用户
        }
        break;
    case 'development': // 开发环境
        _conf = {
            lang : store.getStore('lang')  || "zh", // 语言
            theme : store.getStore('theme')  || "dark", // 主题
            title : store.getStore('title')  || "主页", // 标题
            moudleName:'局点分发页', // 模块名称
            homeUrl:store.getStore('homeUrl') || '/', // 主页
            loginUrl:store.getStore('loginUrl') || '/login/', // 登录地址
            hasIcon:store.hasStore('hasIcon') ? String(store.getStore('hasIcon'))==='true' : false, // 是否显示logo
            defaultImage:store.getStore('defaultImage') || defaultImg,
            userInfo:{username:'游客'} // 当前用户
        }
        break;
}
const defaultConf = {
    ..._conf,
    /**
     * 系统版本号
     */
    version:'1.0.0'

}
window.amt_conf = defaultConf;
export default defaultConf;
export const ConfContext = createContext(_conf);