cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function() {
        util.tips('进入麻将游戏了！');
    },

    onTouchBack: function() {
        cc.director.loadScene('index');
    },
});
