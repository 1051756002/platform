let service = {};
let CMD = require('./service-config')['Main_CMD_Game'];

service.sendMsg = function(cmd, data) {
	let exist = true;
	switch (cmd) {
		case 'enter':
			send_enter(data);
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
		case CMD.Sub_CMD_S_Enter:
			recv_enter(bodyBuff);
			break;
		default:
			exist = false;
			break;
	}
	return exist;
};


// ############# 发送 #############

let send_enter = function(data) {
	let model = new ideal.pb['C_Test_Msg'];
    model.set('value', data.value);

	ideal.conn.sendMsg(CMD.Main, CMD.Sub_CMD_C_Enter, model.encode().toArrayBuffer());
};


// ############# 接收 #############

let recv_enter = function(bodyBuff) {
	let model = ideal.pb['S_Test_FbMsg'].decode(bodyBuff);

	util.log(model);
};

module.exports = service;
