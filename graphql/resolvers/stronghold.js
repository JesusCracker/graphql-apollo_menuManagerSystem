const Stronghold = require("../../models/Stronghold");
const checkAuth = require('../../util/check_auth')
const {AuthenticationError, UserInputError} = require("apollo-server");

module.exports = {
    Query: {
        async getStrongholds(parent, args, context, info) {
            try {
                //时间正序
                return await Stronghold.find().sort({createAt: -1})
            } catch (error) {
                throw new Error(error);

            }
        },

        async getStronghold(_, {strongholdId}, context) {
            try {
                const stronghold = await Stronghold.findById(strongholdId);
                if (stronghold) {
                    return stronghold;
                } else {
                    throw new Error('StrongholdId not found')
                }
            } catch (err) {
                throw new Error(err);
            }

        }

    },

    Mutation: {
        async createStronghold(_, {strongholdInput: {code, name}}, context, info) {
            // console.dir(context.req.headers)
            const user = checkAuth(context);

            if (name.trim() === '') {
                throw new Error('name 不为空');
            }
            if (code.trim() === '') {
                throw new Error('code 不为空');
            }

            const newStronghold = new Stronghold({
                code,
                name,
                username: user.username,
                createAt: new Date().toISOString(),
                user: user.id,
            })
            return await newStronghold.save();

        },

        async deleteStronghold(_, {strongholdId}, context, info) {
            const user = checkAuth(context);
            try {
                const stronghold = await Stronghold.findById(strongholdId);

                if (user.username === stronghold.username) {
                    //只能删除自己的用户
                    await stronghold.delete();
                    return '删除成功'
                } else {
                    throw new AuthenticationError("Action not allowed");
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        async editStronghold(_, {strongholdId, strongholdInput: {code, name}}, context, info) {
            const user = checkAuth(context);
            if (name.trim() === '') {
                throw new Error('name 不为空');
            }
            if (code.trim() === '') {
                throw new Error('code 不为空');
            }
            const stronghold = await Stronghold.findById(strongholdId);
            if (stronghold._doc.username === user.username) {
                return Stronghold.findOneAndUpdate(
                    {"_id": strongholdId},
                    {"$set": {name: name, code: code, updatedAt: Date().toString()}},
                    {"new": true} //returns new document
                )
            }else{
                // throw new UserInputError("未找到对应的id");
                throw new AuthenticationError("Action not allowed");
            }
        }
    }

};