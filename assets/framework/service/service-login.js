let service = {};
let CMD = require('./service-config')['Main_CMD_Login'];

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

service.parseMsg = function(mainCmd, subCmd, bodyBuff) {
	if (CMD.Main != mainCmd) {
		return false;
	}

	let exist = true;
	switch (subCmd) {
		default:
			exist = false;
			break;
	}
	return exist;
};


// ############# 发送 #############

let send_login = function(data) {
	let model = new ideal.pb['C_Login_Msg'];
    model.set('username', data.username);
    model.set('password', data.password);

	ideal.conn.sendMsg(CMD.Main, CMD.Sub_CMD_C_Login, model.encode().toArrayBuffer());
};


// ############# 接收 #############

let recv_login = function(bodyBuff) {
	let model = ideal.pb['S_Login_FbMsg'].decode(bodyBuff);

	// 登录失败
	let result = model.resultbean;
	if (result.code != 0) {
		util.log(result);
		return;
	}
};


// ############# 推送 #############

let push_login = function(data) {

};

module.exports = service;
