cc.Class({
    extends: require('basePop'),

    properties: {
    	lblTitle: cc.Label,
    	lblContent: cc.Label,
        scrollContent: cc.ScrollView,
    },

    onShow: function(param) {
    	var param = this.param = Object.assign({
    		title: '温馨提示',
    		content: '',
    	}, param);

        this.lblTitle.string = param.title;
        this.lblContent.string = param.content;

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
});
