/*
module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword,
) => {
    const errors = {};

    if (username.trim() === '') {
        errors.username = '用户名不为空';
    }

    if (email.trim() === '') {
        errors.email = '邮箱不为空';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = '邮箱格式错误';
        }
    }

    if (password.trim() === '') {
        errors.password = '密码不为空'
    } else {
        if (password !== confirmPassword) {
            errors.confirmPassword = '两次密码不一致';
        }
    }

    return {
        errors,
        valid: Object.keys(errors) < 1
    };
}
*/

module.exports = {

    validateRegisterInput: function (
        username,
        email,
        password,
        confirmPassword,
    ) {
        const errors = {};

        if (username.trim() === '') {
            errors.username = '用户名不为空';
        }

        if (email.trim() === '') {
            errors.email = '邮箱不为空';
        } else {
            const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
            if (!email.match(regEx)) {
                errors.email = '邮箱格式错误';
            }
        }

        if (password.trim() === '') {
            errors.password = '密码不为空'
        } else {
            if (password !== confirmPassword) {
                errors.confirmPassword = '两次密码不一致';
            }
        }

        return {
            errors,
            valid: Object.keys(errors) < 1
        };
    },

    validateLoginInput: function (username, password) {
        const errors = {};

        if (username.trim() === '') {
            errors.username = '用户名不为空';
        }
        if (password.trim() === '') {
            errors.password = '密码不为空';
        }
        return {
            errors,
            valid: Object.keys(errors).length < 1,
        }


    }

}


