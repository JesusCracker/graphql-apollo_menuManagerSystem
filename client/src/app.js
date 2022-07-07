import React, {Component, Fragment, Suspense, lazy} from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom'
import defaultConfs, {ConfContext} from './_confs';
import {AuthProvider} from "./context/auth";
import AuthRoute from "./utils/AuthRoute";
//suggest using lodash rather than your CJS
require('Utils/extensions')
import './global.less';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onChange: values => this.setState(values),
        };
    }

    componentWillMount() {
        document.title = defaultConfs.moudleName
        this.setState({...defaultConfs});
    }

    componentDidMount() {
    }

    render() {
        return <AuthProvider>
            <ConfContext.Provider value={this.state}>
                <Router>
                    <Suspense fallback={<div className="Loading">组件初始化...</div>}>
                        <Switch>
                            <Route path="/" exact component={lazy(() => import('./pages/home'))}/>
                            <AuthRoute exact path={'/login'} component={lazy(() => import('./pages/login'))}/>
                            <AuthRoute exact path={'/register'} component={lazy(() => import('./pages/register'))}/>
                            <Route path="/item" exact component={lazy(() => import('./pages/item'))}/>
                        </Switch>
                    </Suspense>
                </Router>
            </ConfContext.Provider>
        </AuthProvider>
    }
}

export default App;