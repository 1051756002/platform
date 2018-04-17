// 合并所有util函数
let util = Object.assign.apply(Object, [
	require('./util_log'),
	require('./util_data'),
	require('./util_string'),
	require('./util_common'),
	require('./util_cookie'),
	require('./util_sysui')
]);

module.exports = util;
