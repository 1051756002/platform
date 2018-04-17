let ideal = {};

ideal.config = require('./config');
ideal.util = require('../util/util');
ideal.ui = require('./ui/manage');
ideal.pb = require('../pb/pb');
ideal.conn = require('../network/connector');
ideal.http = require('../network/http');
ideal.sound = require('./sound');

window.ideal = ideal;
window.util = ideal.util;
window.http = ideal.http;

// 禁止引擎日志输出
window.console.timeEnd = function() {};

// 重定向, 获取本地IP地址
ideal.config.server.forEach(function(server) {
	server.address = '192.168.0.29';
});

let _initialize = false;
// 初始化架构
ideal.init = function(callback) {
	if (_initialize) {
		util.isDefine(callback) && callback();
		return;
	}
	_initialize = true;

	let callback2 = function() {
		util.log('%-#0fe029', 'ideal framework initialization end.');
		util.isDefine(callback) && callback();
	};

	callback2();
	return;

	// 纯净化控制平台日志
	if (ideal.config.pureLog) {
		util.clear();
	}

	// 启用Protobuf格式
	if (ideal.config.enableProtobuf) {
		ideal.pb.init(function() {
			initNetwork(callback2);
		});
	}
	// 启用Json格式
	else {
		initNetwork(callback2);
	}
};

// 初始化网络模块
let initNetwork = function(callback) {
	// 启用WebSocket协议
	if (ideal.config.enableSocket) {
		ideal.conn.init(function() {
			initComplete(callback);
		});
	} else {
		initComplete(callback);
	}
};

// 初始化完毕
let initComplete = function(callback) {
	util.log_sys('%-#0fe029', 'Version: {0}', ideal.config.version);
	util.log_sys('%-#0fe029', 'DebugModel: {0}\n', ideal.config.debug);
	util.isDefine(callback) && callback();
};

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function() {
    	ideal.init(function() {
    		ideal.ui.go('hall');
    	});
    },
});
