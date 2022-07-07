const Post = require("../../models/Post");
const checkAuth = require('../../util/check_auth')
const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context, info) => {
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw  new UserInputError("评论不为空", {
                    errors: {
                        body: "评论不为空"
                    }
                });
            }

            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username: user.username,
                    createAt: new Date().toISOString(),
                })
                await post.save();
                return post

            } else {
                throw new UserInputError("提交错误")
            }

        },
        deleteComment: async (_, { postId, commentId }, context, info) => {
            const user = checkAuth(context);

            const post =await Post.findById(postId);
            if (post) {
                const commentIndex = post.comments.findIndex((c) => c.id === commentId);


                if (post.comments[commentIndex].username === user.username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('权限错误');
                }

            } else {
                throw new UserInputError("评论不存在")
            }

        }
    }
}