import React,{Component} from 'react';
import {render,unmountComponentAtNode} from 'react-dom';
import classnames from 'classnames'
import styles from './index.less'
class LoadingBar extends Component{
    state = {
        percent: 50,
        show:false
    }
    render(){
        let style = {
            width: `${this.state.percent}%`,
            height: `${this.props.height||2}px`
        };
        if(this.props.color){
            style.backgroundColor = this.props.color;
        }
        return this.state.show?<div className={styles.LoadingBar} style={{height:this.props.height||2}}>
            <div className={styles.LoadingBarInner} style={style}/>
        </div>:null
    }
}


LoadingBar.newInstance = properties => {
    const _props = properties || {};
    let loadingRoot = document.getElementById('app-root');
    const Instance = render(React.createElement(LoadingBar, _props), loadingRoot);
    return {
        update (options) {
            if ('percent' in options) {
                Instance.setState({percent:options.percent});
            }
            if (options.status) {
                Instance.setState({status:options.status});
            }
            if ('show' in options) {
                Instance.setState({show:options.show});
            }
        },
        component: Instance,
        destroy () {
            unmountComponentAtNode(loadingRoot);
            loadingRoot.remove();
        }
    };
};

export default LoadingBar