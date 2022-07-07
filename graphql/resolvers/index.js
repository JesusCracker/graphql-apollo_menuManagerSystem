const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require('./comments');
const positionResolvers = require('./position');
const strongholdResolvers = require('./stronghold');


module.exports = {
    //自定义属性
    Post: {
        likeCount: parent => parent.likes.length,
        commentCount: parent => parent.comments.length,
    },

    Query: {
        ...postsResolvers.Query,
        ...positionResolvers.Query,
        ...strongholdResolvers.Query,

    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...strongholdResolvers.Mutation,
        ...positionResolvers.Mutation,
    }
};