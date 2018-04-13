cc.Class({
    extends: require('basePage'),

    properties: {
    },

    onShow: function(param) {
        util.log('wecome test.');
    },

    onTouchGoHall: function() {
        ideal.ui.show('pageHall');
    },

    onTouchGoEntry: function() {
        ideal.ui.show('pageEntry');
    },
});
