let service = {};
let CMD = require('hall_service_config');

service.sendMsg = function(cmd, data) {
	let exist = true;
	switch (cmd) {
		case 'login':
			send_login(data);
			break;
		default:
			exist = false;
			break;
	}
	return exist;
};

service.parseMsg = function(cmd, data) {
	let exist = true;
	switch (cmd) {
		case CMD.CMD_S_Login:
			recv_login(data);
			break;
		default:
			exist = false;
			break;
	}
	return exist;
};


// ############# 发送 #############

let send_login = function(data) {
	ideal.net.sendMsg({
		proto_ver: 1,
		skey: '',
		uid: '',
		cmd: 10,
	});
};


// ############# 接收 #############

let recv_login = function(data) {
	util.log(data);
};

module.exports = service;
