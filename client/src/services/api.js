// api请求配置
import request from 'utils/request';
import { stringify } from 'qs';
// 获取系统配置信息
export async function getConf () {
    return request('/smp_api/sys/sysSetting/findAll')
}
// 获取验证码信息
export async function getVerify (params) {
    return request(`/smp_api/sys/auth/getVerifyCode?${stringify(params)}`)
}
// 登录
export async function login (params) {
    return request('/smp_api/sys/auth/login', {
        method: 'POST',
        body: params,
    })
}
// 获取菜单信息
export async function findMenus () {
    return request(`/smp_api/sys/menu/findNav`)
}