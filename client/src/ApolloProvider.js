import React from "react";
import App from "./app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import {message} from "antd";

const httpLink = createHttpLink({ uri: "/graphql" });

const authLink = setContext(() => {
    const token = localStorage.getItem("jwtToken");
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ""
        }
    };
});
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {

        for (let err of graphQLErrors) {
            switch (err.extensions.code) {
                case "UNAUTHENTICATED":
                    if(err.message==='Action not allowed'){
                        message.error('当前登陆用户非这条数据建立的的所属用户，不能对其进行操作')
                    }else{
                        message.error('登陆信息过期')
                        window.location.href = "#/login";
                    }
                    break;
                case "INTERNAL_SERVER_ERROR":
                    if(err.message==='Action not allowed'){
                        message.error('当前登陆用户非这条数据建立的的所属用户，不能对其进行操作')
                    }
                    break;
                case "BAD_USER_INPUT":
                    if(err.message==='Action not allowed'){
                        message.error('当前登陆用户非这条数据建立的的所属用户，不能对其进行操作')
                    }else {
                        message.error(err.message);
                    }
                    // Retry the request, returning the new observable
                    return forward(operation);
            }
        }
    }
    // if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = errorLink.concat(authLink);
// 对readQuery包装 ，当query不存在的的时候，返回null||undefined，而不是apollo报错。
// 我参考了gitIssue https://github.com/apollographql/apollo-feature-requests/issues/1
const cache = new InMemoryCache();
cache.originalReadQuery = cache.readQuery;
cache.readQuery = (...args) => {
    try {
        return cache.originalReadQuery(...args);
    } catch (err) {
        return undefined;
    }
};


const client = new ApolloClient({
    link: link.concat(httpLink),
    cache,
})


export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)