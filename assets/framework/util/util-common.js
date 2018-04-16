let _util = {};

/**
 * 是否为空对象
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {Object} val
 * @return   {Boolean}
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
 * @param    {String}
 * @param    {String}
 * @return   {String|Null}
 */
_util.getQueryString = function (name, defval) {
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
 * @DateTime 2018-04-12T10:55:49+0800
 * @param    {String}
 * @param    {String}
 * @param    {String}
 * @return   {void}
 */
_util.addUrlParam = function (url, name, value) {
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

_util.loadRes = function(resources, progressFn, completeFn) {
    if (!(resources instanceof Array)) {
        resources = resources ? [resources] : [];
    };

    for (let i in resources) {
        resources[i] = 'res/raw-assets/res/' + resources[i];
    };

    cc.loader.load(resources, progressFn, completeFn);
};

module.exports = _util;
