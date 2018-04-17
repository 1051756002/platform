let _util = {};

/**
 * 显示消息提示
 * 支持以下几种传参顺序:
 * 1. content<内容>
 * 2. title<标题>, content<内容>
 * 3. title<标题>, content<内容>, confirmFn<确认回调>
 * 3. title<标题>, content<内容>, confirmFn<确认回调>, cancelFn<取消回调>
 * 3. title<标题>, content<内容>, confirmFn<确认回调>, cancelFn<取消回调>, closeFn<关闭回调>
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.tips = function () {
	let title, content;
	let confirmFn, cancelFn, closeFn;
	let args = [];
	for (let i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	};

	if (args.length == 0) {
		return;
	}

	// content
	if (args.length == 1) {
		title = '温馨提示';
		content = args[0];
	}
	// title, content
	if (args.length > 1) {
		title = args[0];
		content = args[1];
	}

	confirmFn = args[2];
	cancelFn = args[3];
	closeFn = args[4];

	ideal.ui.show('popTips', {
		title: title,
		content: content,
		confirmFn: confirmFn,
		cancelFn: cancelFn,
		closeFn: closeFn,
	});
};

/**
 * 显示Loading遮罩层
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.showLoading = function() {
	ideal.ui.show('fixLoading');
};

/**
 * 隐藏Loading遮罩层
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
_util.hideLoading = function() {
	ideal.ui.hide('fixLoading');
};

module.exports = _util;
