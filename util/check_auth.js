const jwt = require('jsonwebtoken');
const { SecretAccessKey } = require('../config');
const { AuthenticationError } = require('apollo-server');


//返回用户信息
module.exports = (context) => {

    const authHeader = context.req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];

        if (token) {
            try {
                return jwt.verify(token, SecretAccessKey)
            } catch (e) {
                //过期OR无效
                throw new AuthenticationError('authorization失效');
            }
        }
        throw new Error('authorization结构错误');
    }

    throw new AuthenticationError('authorization 不为空')

}

/*
module.exports = {
    checkAuth: function (context) {
        const authHeader = context.req.headers.Authorization;

        if (authHeader) {
            const token = authHeader.split('Bearer ')[1];

            if (token) {
                try {
                    return jwt.verify(token, SecretAccessKey)
                } catch (e) {
                    //过期OR无效
                    throw new AuthenticationError('token失效');
                }
            }
            throw new Error('token 结构错误');
        }

        throw new Error('token 不为空');

    }
}*/
