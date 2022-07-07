import React from 'react';
import { Spin } from 'antd'

 const LoadingData=(props)=>{

    let { tip = '数据加载中...' } = props
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            webkitTransform: 'translate(-50%, -50%)',
            MozTransformStyle: 'translate(-50%, -50%)',
            msTransform: 'translate(-50%, -50%)',
            OTransform: 'translate(-50%, -50%)',
            transform: 'translate(-50%, -50%)',
        }}>
            <Spin  {...props} tip={tip}/>
        </div>
    )
}
export default LoadingData