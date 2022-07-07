import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import ApolloProvider from "./ApolloProvider";


ReactDOM.render(
    <Fragment>
        {ApolloProvider}
    </Fragment>,
    document.getElementById('root')
);
