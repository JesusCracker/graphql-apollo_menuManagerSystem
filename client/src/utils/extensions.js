// 连字符转驼峰
String.prototype.hyphenToHump = function () {
    return this.replace(/-(\w)/g, (...args) => {
        return args[1].toUpperCase()
    })
}
// 驼峰转连字符
String.prototype.humpToHyphen = function () {
    return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}
// 扩展html的offsetLeft
HTMLElement.prototype.getoffsetleft = function () {
    var offsetLeft = this.offsetLeft;
    var offsetParent = this.offsetParent;
    while(offsetParent != null){
        offsetLeft += offsetParent.offsetLeft;
        offsetParent = offsetParent.offsetParent;
    }
    return offsetLeft;
}
// 扩展html的offsetLeft
HTMLElement.prototype.getoffsettop  = function () {
    var offsetTop = this.offsetTop;
    var offsetParent = this.offsetParent;
    while(offsetParent != null){
        offsetTop += offsetParent.offsetTop;
        offsetParent = offsetParent.offsetParent;
    }
    return offsetTop;
}
// 扩展Image的实际尺寸
HTMLImageElement.prototype.getNaturalSize  = function (callback) {
    if (!!this.naturalWidth) { // 现代浏览器
        callback && callback({width: this.naturalWidth, height:this.naturalHeight})
    } else { // IE6/7/8
        var nImg = new Image();
        nImg.onload = function() {
            callback && callback({width: nImg.width, height:nImg.height})
        }
        nImg.src = this.src;
    }
}
// 扩展对象数组去重
// key 去重唯一依据
Array.prototype.removal = function (key = 'id') {
    var obj = {};
    return this.reduce(function (item, next) {
        obj[next[key]] ? '' : obj[next[key]] = true && item.push(next);
        return item;
    }, []);
}
// 时间格式化
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "D+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "日",
        "1" : "一",
        "2" : "二",
        "3" : "三",
        "4" : "四",
        "5" : "五",
        "6" : "六"
    };
    if(/(Y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}