cc.Class({
    extends: require('basePage'),

    properties: {
        bgmp3: cc.AudioClip,
    },

    onShow: function(param) {
        util.log('wecome testhall.');
    },

    onTouchGoEntry: function() {
        ideal.view.show('pageEntry');
    },

    onTouchGoTest: function() {
        ideal.view.show('pageTest');
    },

    onTouchMD5: function() {
        let val = 'ideal';
        let msg = util.format('加密前: {0}\n加密后: {1}', val, util.md5(val));
        util.tips(msg);
    },

    onTouchLoading: function() {
        ideal.view.show('fixLoading');

        this.scheduleOnce(function() {
            ideal.view.hide('fixLoading');
        }, 3);
    },

    onTouchLongTips: function() {
        util.tips('在 Cocos Creator 中，我们为组件提供了方便的计时器，这个计时器源自于 Cocos2d-x 中的 cc.Scheduler，我们将它保留在了 Cocos Creator 中并适配了基于组件的使用方式。\n\n也许有人会认为 setTimeout 和 setInterval 就足够了，开发者当然可以使用这两个函数，不过我们更推荐使用计时器，因为它更加强大灵活，和组件也结合得更好！');
    },

    onTouchMahjong2: function() {
        cc.director.loadScene('mahjong_2');
    },

    onTouchGoHotUpdate: function() {
        ideal.view.show('pageHotUpdate');
    },

    onTouchRestart: function() {
        cc.audioEngine.stopAll();
        cc.game.restart();
    },

    onTouchWriteFile: function() {
        if (!cc.sys.isNative) {
            util.tips('该系统不支持文件写入！');
            return;
        }

        let obj = {
            nick: 'ideal',
            pwd: 'superman',
        };

        let writeContent = JSON.stringify(obj);
        let writePath = jsb.fileUtils.getWritablePath() + 'test.json';

        if (jsb.fileUtils.writeStringToFile(writeContent, writePath)) {
            util.log('写入成功！');
            util.tips('写入成功！');
        } else {
            util.log('写入失败！');
            util.tips('写入失败！');
        }
    },

    onTouchLoadFile: function() {
        if (!cc.sys.isNative) {
            util.tips('该系统不支持文件写入！');
            return;
        }
        
        let writePath = jsb.fileUtils.getWritablePath() + 'test.json';

        if (jsb.fileUtils.isFileExist(writePath)) {
            util.log('文件存在！');
            util.tips('文件存在！');
        } else {
            util.log('文件不存在！');
            util.tips('文件不存在！');
        }
    },

    onTouchGameList: function() {
        ideal.view.show('pageGame');
    },

    onTouchSound: function() {
        ideal.view.show('popSound');
    },

    onTouchSound2: function() {
        util.log_sys('bgmp3: {0}', this.bgmp3);
        cc.audioEngine.play(this.bgmp3);
    },

    onTouchGoHall: function() {
        ideal.view.show('pageHall');
    },
});
