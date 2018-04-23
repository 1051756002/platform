let event = require('event');
let service = require('service');
let heartbeat = require('heartbeat');

let SocketState = {
	Waiting: 0,			// 等待中
	Connecting: 1,		// 正在连接中
	Connected: 2,		// 已连接
	Disconnect: 3,		// 已断开
	Reconnecting: 4,	// 正在尝试重连
};

/**
 * 通讯器
 * 用于跟服务器创建一条通讯连接，时刻保持着连接状态。
 */
let net = {
	reconn: 0,
	reconnLimit: 5,
	socket: null,
	state: SocketState.Waiting,
};

// 请求Loading的延迟出现ID
let STID_LOADING = 0;

// 连接TCP
net.connect = function(tcpurl = null, callback) {
	if (arguments.length == 1 && typeof arguments[0] == 'function') {
		callback = tcpurl;
		tcpurl = null;
	}
	// 默认取配置表中的地址
	tcpurl == null && (tcpurl = ideal.project.get().tcpServer);


	// 只允许单例形式存在
	if (this.state != SocketState.Waiting) {
		util.isDefine(callback) && callback();
		return false;
	}
	this.state = SocketState.Connecting;

	// 连接成功
	let openFn = function(ev) {
        net.reconn = 0;
		net.state = SocketState.Connected;
		util.log_net('%-#de590b', 'connect success.');
		util.isDefine(callback) && callback();
	};

	// 连接中断
	let closeFn = function(ev) {
		net.state = SocketState.Waiting;
		util.log_net('%-#de590b', 'connect interrupt.');
		net.error({ msg: '与服务器断开了，请尝试重连！', type: 2 });
		clearTimeout(STID_LOADING), STID_LOADING = 0;
		ideal.util.hideLoading();
	};

	// 连接异常
	let errorFn = function(ev) {
		util.log_net('%-#de590b', 'ideal.net Error: {0}', JSON.stringify(ev));
	};

	util.log_net('%-#de590b', 'connect server: {0}.', tcpurl);
	openSocket(tcpurl, openFn, closeFn, errorFn);
};

// 重连
net.reconnect = function() {
	if (util.isEmpty(this.socket)) {
		this.connect();
		return;
	};

	net.reconn++;
	if (net.reconn > net.reconnLimit) {
		net.reconn = 0;
		net.error({ msg: '服务器重连失败，是否继续尝试？', type: 3 });
		return;
	}

	util.log_net('第{0}/{1}次尝试重连...', net.reconn, net.reconnLimit);
	this.state = SocketState.Connecting;

	let tcpurl = this.socket.url;

	// 连接成功
	let openFn = function(ev) {
        net.reconn = 0;
		net.state = SocketState.Connected;
		util.log_net('%-#de590b', 'connect success.');
	};

	// 连接中断
	let closeFn = function(ev) {
		net.state = SocketState.Waiting;
		if (net.reconn == 0) {
			net.error({ msg: '与服务器断开了，请尝试重连！', type: 2 });
		} else {
			net.reconnect();
		}
	};

	// 连接异常
	let errorFn = function(ev) {
		util.log_net('%-#de590b', 'network error: {0}', JSON.stringify(ev));
	};

	openSocket(tcpurl, openFn, closeFn, errorFn);
};

// 断开服务器
net.interrupt = function(closeSocket) {
	this.state = SocketState.Disconnect;
	if (this.state != SocketState.Connected || this.socket.readyState != WebSocket.OPEN) {
		return false;
	}
	closeSocket(callback);
	return true;
};

// 异常处理
net.error = function(err) {
	util.log_net(err);

	switch (err.type) {
		// 确认=重连
		case 2:
			util.tips(err.msg, this.reconnect.bind(this));
			break;
		// 确认=重连, 取消=重启
		case 3:
			util.tips(err.msg, this.reconnect.bind(this), function() {
				util.log('重启');
			});
			break;
		// 确认=关闭弹窗
		default:
			util.tips(err.msg);
			break;
	}
};

/**
 * 向服务器发送消息
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
net.send = function(cmd = '', data = {}) {
	if (net.state != SocketState.Connected) {
		net.error({ msg: '与服务器连接中断，请尝试重连！', type: 2 });
		return;
	}

	service.sendMsg(cmd, data);
};

net.sendMsg = function(data = {}) {
	if (net.state != SocketState.Connected) {
		net.error({ msg: '与服务器连接中断，请尝试重连！', type: 2 });
		return;
	}

	let config = ideal.project.get();
	if (util.isEmpty(config.notlog_send) || config.notlog_send.indexOf(data.cmd) == -1) {
		util.log_net('%-#0fe029', '发送: cmd={0}', data.cmd);
	}

	this.socket.send(JSON.stringify(data));
};

/**
 * 触发事件
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {object}
 * @return   {void}
 */
net.emit = function(types, data) {
	if (!types) {
		return false;
	}

	let type_arr = [];
	if (typeof types == 'string') {
		type_arr = types.split(',');
	} else {
		type_arr = types.slice();
	}

	if (type_arr.length == 0) {
		return false;
	}

	type_arr.forEach(function(type) {
		event.triggerEvent(type, data);
	}, this);
	return true;
};

/**
 * 监听事件
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {function}
 * @param    {object}
 * @return   {boolean}
 */
net.on = function(types, selector, thisObj) {
	if (!types) {
		return false;
	}

	let type_arr = [];
	if (typeof types == 'string') {
		type_arr = types.split(',');
	} else {
		type_arr = types.slice();
	}

	if (type_arr.length == 0) {
		return false;
	}

	type_arr.forEach(function(type) {
		event.addEventListener(type, selector, thisObj);
	}, this);
	return true;
};

/**
 * 移除监听事件
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {function}
 * @return   {boolean}
 */
net.off = function(types, selector) {
	if (!types) {
		return false;
	}

	let type_arr = [];
	if (typeof types == 'string') {
		type_arr = types.split(',');
	} else {
		type_arr = types.slice();
	}

	if (type_arr.length == 0) {
		return false;
	}

	type_arr.forEach(function(type) {
		event.removeEventListener(type, selector);
	}, this);
	return true;
};

let openSocket = function(serverUrl, openFn, closeFn, errorFn) {
	closeSocket(function() {
		try {
			let socket = net.socket = new WebSocket(serverUrl);
			socket.onopen = function(evt) {
				openFn && openFn(evt);

				clearTimeout(STID_LOADING), STID_LOADING = 0;
				ideal.util.hideLoading();
			};
			socket.onmessage = function(evt) {
				receiveMsg(evt.data);
			};
			socket.onclose = function(evt) {
				heartbeat.stop();
				closeFn && closeFn(evt);
			};
			socket.onerror = function(evt) {
				errorFn && errorFn(evt);
			};

			if (STID_LOADING == 0) {
				STID_LOADING = setTimeout(function() {
					ideal.util.showLoading();
				}, 3000);
			}
		} catch (err) {
			net.error({ msg: '开启Socket失败，或许该浏览器不支持WebSocket' });
		}
	});
};

let closeSocket = function(callback) {
	let socket = net.socket;

	if (socket != null && socket.readyState != WebSocket.CLOSED) {
		if (callback) {
			let onClose = typeof socket.onclose == 'function' ? socket.onclose : null;
			socket.onclose = function() {
				onClose && onClose();
				callback();
			};
		}
		socket.close();
	} else {
		callback && callback();
	}
};

let receiveMsg = function(buffer) {
	try {
		let data = JSON.parse(buffer);
		let cmd = data.cmd;

		// 登录成功, 开始心跳包
		if (cmd == 10 || cmd == 11) {
			heartbeat.start();
			return;
		}

		// 错误码
		if (cmd == 2010) {
			util.tips(util.format('错误码：{0}，{1}', data.err, data.err_msg));
			return;
		}

		let config = ideal.project.get();
		if (util.isEmpty(config.notlog_recv) || config.notlog_recv.indexOf(cmd) == -1) {
			util.log_net('%-#ea681c', '接收: cmd={0}', cmd);
		}

		// 解析指令
		service.parseMsg(cmd, data);
	} catch (err) {
		if (net.state != SocketState.CONNECTING) {
			net.error({ msg: err.message });
		} else {
			throw(err);
		}
	}
};

// 通讯状态赋到连接器中，方便外界用于判断
for (let i in SocketState) {
	net[i] = SocketState[i];
};

module.exports = net;
