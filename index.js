const { ApolloServer } = require('apollo-server');
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require('./config');
const cors = require('cors')


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    cors: true,
})

new mongoose.connect(
    MONGODB,
    { useNewUrlParser: true }
).then(() => {
    console.log("MongoDB Connected");
    return server.listen({ port: 5001, host: '' },);
}).then(res => {
    console.dir(`🚀 Server ready at ${res.url}`);
})
