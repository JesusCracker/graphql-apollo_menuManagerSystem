const Stronghold = require("../../models/Stronghold")
const checkAuth = require('../../util/check_auth')
const {AuthenticationError, UserInputError} = require("apollo-server");

//todo:第二层的据点
module.exports = {
    Query: {
        async getPositions(parent, args, context, info) {
            try {
                //时间正序
                return await Stronghold.find().sort({createAt: -1})
            } catch (error) {
                throw new Error(error);

            }
        },

        async getPosition(_, {positionId}, context) {
            try {
                const position = await Stronghold.findById(positionId);
                if (position) {
                    return position;
                } else {
                    throw new Error('PositionId not found')
                }
            } catch (err) {
                throw new Error(err);
            }

        }

    },

    Mutation: {
        async createPosition(_, {
            strongholdId,
            positionInput: {
                name,
                address,
                web,
                server,
                user,
                test,
                pm,
                type,
            }
        }, context, info) {
            // console.dir(context.req.headers)
            const {username} = checkAuth(context);


            if (type.trim() === '') {
                throw new Error('类型不为空');
            }

            const stronghold = await Stronghold.findById(strongholdId);

            if (stronghold) {
                if (type === 'CMS') {
                    stronghold.mg.unshift({
                        name,
                        address,
                        web,
                        server,
                        user,
                        test,
                        pm,
                        username: username,
                        createAt: new Date().toISOString(),
                    })
                } else {
                    stronghold.epg.unshift({
                        name,
                        address,
                        web,
                        server,
                        user,
                        test,
                        pm,
                        username: username,
                        createAt: new Date().toISOString(),
                    })
                }
                await stronghold.save();
                return stronghold
            } else {
                throw new UserInputError("提交错误")
            }
        },

        async deletePosition(_, {strongholdId, positionId, type}, context, info) {
            const {username} = checkAuth(context);
            try {
                const stronghold = await Stronghold.findById(strongholdId);
                if (stronghold) {
                    if (type === 'CMS') {
                        const positionIndex = stronghold.mg.findIndex(item => item.id === positionId);
                        if (stronghold.mg[positionIndex].username === username) {
                            stronghold.mg.splice(positionIndex, 1);
                            await stronghold.save();
                            return '删除成功';
                        } else {
                            throw new AuthenticationError("Action not allowed");
                        }
                    } else {
                        const positionIndex = stronghold.epg.findIndex(item => item.id === positionId);
                        if (stronghold.epg[positionIndex].username === username) {
                            stronghold.epg.splice(positionIndex, 1);
                            await stronghold.save();
                            return '删除成功';
                        } else {
                            throw new AuthenticationError("Action not allowed");
                        }
                    }

                } else {
                    throw new UserInputError("Stronghold not found");
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        async editPosition(_, {
            strongholdId, positionId, positionInput: {
                name,
                address,
                web,
                server,
                user,
                test,
                pm,
                type,
            },
        }, context, info) {
            const {username} = checkAuth(context);

            if (type.trim() === '') {
                throw new Error('类型不为空');
            }
            if (['CMS','cms'].includes(type)) {
                const stronghold = await Stronghold.findById(strongholdId);
                if (stronghold) {
                    const positionIndex = stronghold.mg.findIndex(item => item.id === positionId);
                    if (stronghold.mg[positionIndex].username === username) {
                        stronghold.mg[positionIndex].name = name;
                        stronghold.mg[positionIndex].address = address;
                        stronghold.mg[positionIndex].web = web;
                        stronghold.mg[positionIndex].server = server;
                        stronghold.mg[positionIndex].user = user;
                        stronghold.mg[positionIndex].test = test;
                        stronghold.mg[positionIndex].pm = pm;
                        stronghold.mg[positionIndex].updatedAt = Date().toString();
                    } else {
                        throw new AuthenticationError("Action not allowed");
                    }
                    await stronghold.save();
                    return stronghold

                } else {
                    throw new UserInputError("Stronghold not found");
                }

            } else {
                const stronghold = await Stronghold.findById(strongholdId);
                if (stronghold) {
                    const positionIndex = stronghold.epg.findIndex(item => item.id === positionId);
                    if (stronghold.epg[positionIndex].username === username) {
                        stronghold.epg[positionIndex].name = name;
                        stronghold.epg[positionIndex].address = address;
                        stronghold.epg[positionIndex].web = web;
                        stronghold.epg[positionIndex].server = server;
                        stronghold.epg[positionIndex].user = user;
                        stronghold.epg[positionIndex].test = test;
                        stronghold.epg[positionIndex].pm = pm;
                        // stronghold.epg[positionIndex].updatedAt = new Date().toISOString()
                    } else {
                        throw new AuthenticationError("Action not allowed");
                    }
                    await stronghold.save();
                    return stronghold
                } else {
                    throw new UserInputError("Stronghold not found");
                }
            }


            /*    if (stronghold._doc.username === user.username) {
                    return Stronghold.findOneAndUpdate(
                        {"_id": strongholdId},
                        {"$set": {name: name, code: code, updatedAt: Date().toString()}},
                        {"new": true} //returns new document
                    )
                }else{
                    throw new UserInputError("未找到对应的id");
                }*/
        }
    }

};