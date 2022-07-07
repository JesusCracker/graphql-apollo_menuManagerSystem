require('es6-promise').polyfill();
require('isomorphic-fetch');
// import fetch from 'dva/fetch';
import {notification} from 'antd';
import {stringify} from 'qs';
import store from "./storage";

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。'
};

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
        message: errortext,
    });
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
}


/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const defaultOptions = {
        headers: {accessToken: loginInfo ? loginInfo.accessToken : "0"}
    };
    const newOptions = {...defaultOptions, ...options};
    if (options && options.headers) {
        newOptions.headers = {...options.headers, ...defaultOptions.headers}
    }
    if (String(newOptions.method).toUpperCase() === 'POST' || String(newOptions.method).toUpperCase() === 'PUT') {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                ...newOptions.headers
            };
            if (newOptions.headers['Content-Type'].indexOf('json') > -1) {
                newOptions.body = JSON.stringify(newOptions.body);
            } else {
                newOptions.body = stringify(newOptions.body, {arrayFormat: 'indices', allowDots: true});
            }
        } else {
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers
            };
        }
    }
    if (!!newOptions.headers.download) {
        let downloadTarget = document.createElement('a');
        downloadTarget.target = '_blank';
        downloadTarget.href = url.indexOf('?') > 0 ? `${url}&accessToken=${defaultOptions.headers.accessToken}` : `${url}?accessToken=${defaultOptions.headers.accessToken}`;
        downloadTarget.click();
        downloadTarget.remove();
        if(!!downloadTarget){downloadTarget = undefined;}
    } else {
        return fetch(url, newOptions)
            .then(checkStatus)
            .then(response => {
                if(!!response.headers.get('epublic-key')){
                    store.setStore("publicKey", response.headers.get('epublic-key'))
                }
                if(!!response && response.headers && response.headers.get('sessionidstr')){
                    store.setStore('sessionidstr',response.headers.get('sessionidstr'));
                }
                return response.json().then(res => {
                    if (res.code && res.code !== 200 && res.code !== '200') {
                        notification.warning({
                            message: res.message || res.msg
                        });
                        // if (res.code && [401,402].indexOf(res.code)>-1) {
                        //     window.amt_app._store.dispatch({
                        //         type: 'global/logout',
                        //     });
                        // }
                    }
                    return res;
                })
            })
            .catch(e => {
                console.error(e,url)
            });
    }
}
