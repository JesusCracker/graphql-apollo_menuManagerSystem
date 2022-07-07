const {gql} = require("apollo-server");

module.exports = gql`
    type Stronghold{
        updatedAt:String!,
        code:String,
        name:String,
        createAt:String!,
        username:String!,
        id:String!
        mg:[Mg]!
        epg:[Epg]!
    }

    type Position{
        id:ID!,
#        code:String!,
        createAt:String!,
        username:String!,
        name:String!,
        mg:[Mg]!,
        epg:[Epg]!,
    }


    type Mg{
        id:ID!,
        name:String!,
        address:String!,
        web:String!,
        server:String!,
        user:String!,
        test:String!,
        pm:String!,
        username:String!,
        createAt:String!,
#        updatedAt:String,
    }

    type Epg{
        id:ID!,
        name:String!,
        address:String!,
        web:String!,
        server:String!,
        user:String!,
        test:String!,
        pm:String!,
        username:String!,
        createAt:String!,
#        updatedAt:String,
    }


    type Post{
        id:ID!,
        body:String!,
        createAt:String!,
        username:String!,
        comments:[Comment]!,
        likes:[Like]!,
        likeCount:Int!,
        commentCount:Int!,
    }

    type Like{
        id:ID!,
        username:String!,
        createAt:String!,
    }

    type Comment{
        id:ID!,
        body:String!,
        username:String!,
        createAt:String!,
    }




    type User{
        id:ID,
        username:String!,
        email:String!,
        createAt:String,
        token:String!
    }

    input RegisterInput{
        username:String!,
        email:String!,
        password:String!,
        confirmPassword:String!,
    }

    input LoginInput{
        username:String!,
        password:String!,
    }


    input StrongholdInput{
        code:String!,
        name:String!,
    }

    input PositionInput{
        name: String!,
        address: String!,
        web: String!,
        server:String!,
        user:String!,
        test:String!,
        pm:String!
        type:String!,
    }

    type Query{
        getPosts:[Post]
        getPost(postId:ID!):Post
        getPositions:[Position],
        getPosition(positionId:ID!):Position
        getStrongholds:[Stronghold],
        getStronghold(strongholdId:ID!):Stronghold
    }


    type Mutation{
        register(registerInput:RegisterInput):User!
        #        login(username:String!,password:String!):User!
        login(loginInput:LoginInput):User!

        createPost(body:String!):Post!

        deletePost(postId:ID!):String!

        createComment(postId:ID!,body:String!):Post!

        deleteComment(postId:ID!,commentId:ID!):Post!

        likePost(postId: ID!): Post!

        #        一级标签
        createStronghold(strongholdInput:StrongholdInput):Stronghold!

        deleteStronghold(strongholdId:ID!):String!

        editStronghold(strongholdId:ID!,strongholdInput:StrongholdInput):Stronghold!

        #二级内容
        createPosition(strongholdId: ID!,positionInput:PositionInput):Stronghold!

        deletePosition(strongholdId:ID!,positionId:ID!,type:String!):String!

        editPosition(strongholdId:ID!,positionId:ID!,positionInput:PositionInput):Stronghold!
        

    }
`;