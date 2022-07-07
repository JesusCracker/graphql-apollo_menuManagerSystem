const Post = require("../../models/Post");
const checkAuth = require('../../util/check_auth')
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
    Query: {
        async getPosts(parent, args, context, info) {

            try {
                //时间正序
                return await Post.find().sort({ createAt: -1 })
            } catch (error) {
                throw new Error(error);

            }
        },

        async getPost(_, { postId }, context) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('PostId not found')
                }
            } catch (err) {
                throw new Error(err);
            }

        }

    },

    Mutation: {
        async createPost(_, { body }, context, info) {
            // console.dir(context.req.headers)
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('post body 不为空');
            }

            const newPost = new Post({
                body,
                username: user.username,
                createAt: new Date().toISOString(),
                user: user.id,
            })
            return await newPost.save();

        },

        async deletePost(_, { postId }, context, info) {
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId);

                if (user.username === post.username) {
                    //只能删除自己的用户
                    await post.delete();
                    return '删除成功'
                } else {
                    throw new AuthenticationError('权限错误');
                }
            } catch (e) {
                throw new Error(e)
            }
        },

        async likePost(_, { postId }, context, info) {
            const user = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find(like => like.username === user.username)) {
                    post.likes = post.likes.filter(like => like.username !== user.username)
                } else {
                    post.likes.push({
                        username: user.username,
                        createAt: new Date().toISOString(),
                    })
                }
                await post.save();
                return post

            } else {
                throw new UserInputError("未找到对应的id");
            }

        }
    }

};