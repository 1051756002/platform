// 合并所有util函数
let util = Object.assign.apply(Object, [
	require('./util-log'),
	require('./util-data'),
	require('./util-string'),
	require('./util-common'),
	require('./util-cookie'),
	require('./util-sysui')
]);

let u_main = require('../../script/util/util-main');

// 载入自定义util模块
if (u_main) {
	util = Object.assign.apply(Object, [ util, u_main ]);
};

module.exports = util;
