const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { SecretAccessKey, Expiration } = require('../../config');

const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators')

function generalToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, SecretAccessKey, {
        expiresIn: Expiration
    })


}

module.exports = {
    Mutation: {

        //登陆
        async login(parent, { loginInput: { username, password } }, context, info) {
            const { errors, valid } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError("Error", errors);
            }
            const user = await User.findOne({ username });
            if (!user) {
                errors.general = '用户不存在';
                throw new UserInputError("用户不存在", { errors })
            }
            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                errors.general = '用户密码错误';
                throw new UserInputError("用户密码错误", { errors })
            }

            const token = generalToken(user)

            return {
                ...user._doc,
                id: user._id,
                token,
            }
        },

        //注册
        async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info) {
            //验证用户信息
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);

            //非空判断
            if (!valid) {
                throw new UserInputError("Error", errors)
            }

            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError("用户名已存在", {
                    errors: {
                        username: "用户名已存在"
                    }
                })

            }

            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                email,
                username,
                password,
                createAt: new Date().toISOString(),
            })

            const res = await newUser.save();
            const token = generalToken(res);

            return {
                ...res._doc,
                id: res._id,
                token,
            }


        }
    }
}