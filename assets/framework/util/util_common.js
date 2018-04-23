let _util = {};

/**
 * 是否为空对象
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {object} val
 * @return   {boolean}
 */
_util.isEmpty = function(val) {
    switch (typeof(val)) {
        case 'string':
            return util.trim(val).length == 0 ? true : false;
            break;
        case 'number':
            return val == 0;
            break;
        case 'object':
            return val == null;
            break;
        case 'array':
            return val.length == 0;
            break;
        case 'function':
            return false;
            break;
        default:
            return true;
    }
};

/**
 * 是否定义了该内容
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {Object} val
 * @return   {Boolean}
 */
_util.isDefine = function(val) {
    return !util.isEmpty(val);
};

/**
 * 获得地址参数列表
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {string}
 * @return   {string|null}
 */
_util.getQueryString = function(name, defval) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r, idx = location.search.indexOf('/');
    if (idx == -1) {
        r = location.search.substr(1).match(reg);
    } else {
        r = location.search.substring(1, idx).match(reg);
    }
    if (r != null) {
        return unescape(r[2]);
    }
    return util.isDefine(defval) ? defval : null;
};

/**
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {string}
 * @param    {string}
 * @return   {void}
 */
_util.addUrlParam = function(url, name, value) {
    if (/\?/g.test(url)) {
        if (/name=[-\w]{4,25}/g.test(url)) {
            url = url.replace(/name=[-\w]{4,25}/g, name + "=" + encodeURIComponent(value));
        } else {
            url += "&" + name + "=" + encodeURIComponent(value);
        }
    } else {
        url += "?" + name + "=" + encodeURIComponent(value);
    }
    return url;
};

_util.loadRes = function(resource, progressFn, completeFn) {
    resource = 'res/raw-assets/' + resource;
    cc.loader.load(resource, progressFn, completeFn);
};

/**
 * 加载外界JS脚本文件
 * @Author   Zjw
 * @DateTime 2018-04-20
 * @param    {string}                 url      脚本地址
 * @param    {Function}               callback 载入后的回调
 * @return   {void}
 */
_util.loadJavaScript = function(url, callback) {
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if (util.isDefine(callback)) {
        script.onload = function() {
            callback();
        };
    }
    document.body.appendChild(script);
};

module.exports = _util;