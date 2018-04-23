cc.Class({
    extends: require('basePop'),

    properties: {
    },

    onShow: function(param) {

    },

    onTouchPlay: function(ev, soundName) {
    	ideal.sound.play(soundName);
    },
});
