import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './index.less';

class Slider extends PureComponent {

  constructor (props) {
    super(props);
    this.state = {
      msg:'向右滑动完成验证',
      moving:false, // 移动中状态
      success:true, // 验证成功 true-验证成功，false-验证失败
      status:props.status || false, // 验证状态 true-验证通过，false-验证不通过
      transition:false, // 验证失败添加过度效果
      barArea:React.createRef(),
      bar:React.createRef(),
      barL:0,
      barRadius:props.barRadius || 5, // 操作bar圆角
      barWidth:props.barWidth || 40, // 操作bar宽度
      barHeight:props.barHeight || 40, // 操作bar高度
      vOffset:props.vOffset || 5 // 误差量
    }
    this.onTouchmove = this.move.bind(this);
    this.onMousemove = this.move.bind(this);
    this.onTouchend = this.end.bind(this);
    this.onMouseup = this.end.bind(this);
  }
  start(e){
    const {status} = this.state;
    if(status){
      return false;
    }
    this.setState({
      ...this.state,msg:'',
      moving:true,
      success:true,
      status:false,
      transition:false
    })
    e.stopPropagation();
  }
  move(e){
    const {moving,barArea,bar} = this.state;
    if(!moving){
      return false;
    }
    // console.log('move');
    let x = e.clientX;
    // 鼠标坐标
    if(!e.touches) {
      x = e.clientX;//兼容移动端
    }else {
      x = e.touches[0].pageX;//兼容PC端
    }
    // 滑块区域距离屏幕左边边距
    const area = {
      w : barArea.current.offsetWidth,
      l : barArea.current.getoffsetleft()
    };
    const bw = bar.current.offsetWidth;
    //小方块相对于父元素的left值
    let l = x - area.l;
    if(l >= area.w - bw/2 + 3){
      this.setState({...this.state,msg:'松开鼠标开始验证'});
      l = area.w - bw/2 + 3;
    }else{
      this.setState({...this.state,msg:''});
    }
    if(l <=0){
      l = bw/2
    }
    this.setState({...this.state,barL:l - bw/2})
  }
  end(){
    const _this = this;
    const {moving,barArea,bar,vOffset} = this.state;
    if(!moving){
      return false;
    }
    const l = parseFloat(bar.current.style.left),
      aw = barArea.current.offsetWidth,
      bw = bar.current.offsetWidth;
    if(l >= aw - bw - vOffset){
      this.setState({...this.state,msg:'验证成功',moving:false,success:true,status:true});
      this.props.onChange && this.props.onChange(true)
    }else{
      _this.setState({..._this.state,moving:false,success:false,status:false,transition:true});
      this.props.onChange && this.props.onChange(false)
      setTimeout(function () {
        _this.setState({..._this.state,barL:0,msg:'向右滑动解锁'})
        setTimeout(function () {
          _this.setState({..._this.state,success:true,transition:false})
        }, 500);
      }, 400);
    }
  }
  render () {
    let temHtml = '';
    const {success,status,moving,transition,barArea,bar,barL,msg,barWidth,barHeight,barRadius} = this.state;
    let iconClass = classNames(
      styles.verifyIcon,
      'login',{
      'login-right':success&&!status,
      'login-close':!success&&!status,
      'login-checked':success&&status});
    const barAreaClass = classNames(
      styles.verifyBarArea,
      {
        [styles.moving]:moving,
        [styles.verfied]:status&&success,
        [styles.vFalse]:!success,
        [styles.transition]:transition})
    const moveBlockProps = {
      className:classNames(styles.verifyMoveBlock),
      onMouseDown:(e)=>this.start(e),
      onTouchStart:(e)=>this.start(e),
      style:{
        left:barL,
        width:barWidth,
        height:status&&success ? barHeight + 2 : barHeight,
        lineHeight:status&&success ? (barHeight + 2) + 'px' : barHeight + 'px'}
    };
    return <div ref={barArea} className={barAreaClass} style={{height:barHeight,lineHeight:barHeight + 'px',borderRadius:barRadius}}>
        <span className={styles.verifyMsg}>{msg}</span>
        <div className={styles.verifyLeftBar} style={{width:barL}}>
            <span className={styles.verifyMsg}>{moving || (success&&status) ? msg:''}</span>
            <div ref={bar} {...moveBlockProps}>
                <i className={iconClass}/>
                {temHtml}
            </div>
        </div>
    </div>
  }
  componentDidMount(){
    const {bar} = this.state;
    // 开始拖动的时候禁用选取功能
    bar.current.onselectstart = function () {
      return false;
    }
    //拖动
    window.addEventListener("touchmove", this.onTouchmove);
    window.addEventListener("mousemove", this.onMousemove);

    //鼠标松开
    window.addEventListener("touchend", this.onTouchend);
    window.addEventListener("mouseup", this.onMouseup);
  }
  onEnd(e){
    this.move(e);
  }
  componentWillUnmount(){
    //拖动
    window.removeEventListener("touchmove", this.onTouchmove);
    window.removeEventListener("mousemove", this.onMousemove);
    //鼠标松开
    window.removeEventListener("touchend", this.onTouchend);
    window.removeEventListener("mouseup", this.onMouseup);
  }
}

export default Slider
