cc.Class({
    extends: require('basePage'),

    properties: {
    },

    onShow: function(param) {
        util.log('wecome entry.');
    },

    onTouchTips: function() {
        util.tips('这是一个测试弹窗！');
    },

    onTouchWxLogin: function() {
        var obj = new WxLogin({
            id: 'content',
            appid: 'wx000e2d71c7247566',
            scope: 'snsapi_login',
            redirect_uri: encodeURIComponent(location.href),
        });
    },

    onTouchGoTest: function() {
        ideal.ui.show('pageTest');
    },

    onTouchDebug: function() {
        cc.director.loadScene('mahjong_1');
    },
});
