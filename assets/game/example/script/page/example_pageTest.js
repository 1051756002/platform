cc.Class({
    extends: require('basePage'),

    properties: {
    },

    onShow: function(param) {
        util.log('wecome test.');
    },

    onTouchGoHall: function() {
        ideal.view.show('pageTestHall');
    },

    onTouchGoEntry: function() {
        ideal.view.show('pageEntry');
    },
});
