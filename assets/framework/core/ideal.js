let ideal = window.ideal = {};

ideal.config = require('config')
ideal.util = require('util');
ideal.view = require('viewMgr');
ideal.project = require('projectMgr');
ideal.pb = require('pb');
ideal.net = require('net');
ideal.http = require('http');
ideal.sound = require('sound');
ideal.service = require('service');

window.util = ideal.util;

// 禁止引擎日志输出
window.console.timeEnd = function() {};

let _initialize = false;
// 初始化架构
ideal.init = function(callback) {
	if (_initialize) {
		util.isDefine(callback) && callback();
		return;
	}
	_initialize = true;

	// 纯净化控制平台日志
	if (ideal.config.pureLog) {
		util.clear();
	};

	loadDependentScripts(function() {
		util.log_sys('%-#0fe029', 'Version: {0}', ideal.config.version);
		util.log_sys('%-#0fe029', 'DebugModel: {0}\n', ideal.config.debug);
		util.log('%-#0fe029', 'ideal framework initialization end.');
		util.isDefine(callback) && callback();
	});
};

// 加载依赖脚本列表
let loadDependentScripts = function(callback) {
	let f = function(i = 0) {
		if (i >= ideal.config.scriptlist.length) {
			util.isDefine(callback) && callback();
		} else {
			util.log_sys('%-#999999', '加载依赖脚本: {0}', ideal.config.scriptlist[i]);
			util.loadJavaScript(ideal.config.scriptlist[i], function() {
				f(i + 1);
			});
		}
	}; f();
};

cc.Class({
    extends: cc.Component,

    onLoad: function() {
    	ideal.init(function() {
    		ideal.project.go('hall');
    	});
    },
});
