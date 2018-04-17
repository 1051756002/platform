cc.Class({
    extends: require('baseNode'),

    properties: {
    },

    onShow: function() {
        this.getComponent(cc.Animation).play();
    },

    onHide: function() {
        this.getComponent(cc.Animation).stop();
    },
});
