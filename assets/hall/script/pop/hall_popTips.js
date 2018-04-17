cc.Class({
    extends: require('basePop'),

    properties: {
    	lblTitle: cc.Label,
    	lblContent: cc.Label,
        btnCancel: cc.Button,
        scrollContent: cc.ScrollView,
    },

    onShow: function(param) {
    	var param = this.param = Object.assign({
    		title: '温馨提示',
    		content: '',
    	}, param);

        this.lblTitle.string = param.title;
        this.lblContent.string = param.content;

        this.btnCancel.node.active = util.isDefine(param.cancelFn);

        // 内容超出时强制滑动到顶部
        if (this.scrollContent.content.height > this.scrollContent.node.height) {
            this.scrollContent.scrollToTop();
        }
    },

    onTouchConfirm: function() {
    	let param = this.param;

    	if (util.isDefine(param.confirmFn)) {
    		param.confirmFn();
    	} else {
    		this.hide();
    	}
    },

    onTouchCancel: function() {
    	let param = this.param;

    	if (util.isDefine(param.cancelFn)) {
    		param.cancelFn();
    	} else {
    		this.hide();
    	}
    },

    onTouchClose: function() {
    	let param = this.param;

    	if (util.isDefine(param.closeFn)) {
    		param.closeFn();
    	} else {
    		this.hide();
    	}
    },

    _showAnimF1: function() {
        let param = this._param;
        this.node.active = true;
        this.onShow(param);
        delete this._param;
    },

    _hideAnimF1: function() {
        this.node.active = false;
        this.onHide();
    },

    // 显示弹窗
    show: function(param) {
        this._param = param;
        this.getComponent(cc.Animation).play('hall_pop_show');
    },

    // 隐藏弹窗
    hide: function() {
        this.getComponent(cc.Animation).play('hall_pop_hide');
    },
});
