cc.Class({
    extends: require('basePop'),

    properties: {
    	lblContent: cc.Label,
        btnCancel: cc.Button,
    },

    onShow: function(param) {
    	var param = this.param = Object.assign({
    		content: '',
    	}, param);

        this.lblContent.string = param.content;

        this.btnCancel.node.active = util.isDefine(param.cancelFn);
    },

    onTouchConfirm: function() {
    	let param = this.param;

    	if (util.isDefine(param.confirmFn)) {
            let i = param.confirmFn();
            (i == undefined) && (i = true);
            (i == true) && this.hide();
    	} else {
    		this.hide();
    	}
    },

    onTouchCancel: function() {
    	let param = this.param;

    	if (util.isDefine(param.cancelFn)) {
            let i = param.cancelFn();
            (i == undefined) && (i = true);
            (i == true) && this.hide();
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
        this.getComponent(cc.Animation).play('example_pop_show');
    },

    // 隐藏弹窗
    hide: function() {
        this.getComponent(cc.Animation).play('example_pop_hide');
    },
});
