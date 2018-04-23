cc.Class({
    extends: cc.Component,

    properties: {
        btnIcon: cc.Button,
        imgProgress: cc.Sprite,
        layDownload: cc.Node,
        layLock: cc.Node,
        layHot: cc.Node,
    },

    onLoad: function() {
        this.layLock.on(cc.Node.EventType.TOUCH_END, this.onTouchDownload, this);
    },

    initStyle: function(data) {
        this.data = data;

        let finishList = cc.sys.localStorage.getItem('download_finish');

        if (finishList == null) {
            finishList = [];
        } else {
            finishList = JSON.parse(finishList);
        }

        if (finishList.indexOf(this.data.id) > -1) {
            this.layLock.active = false;
            this.btnIcon.interactable = true;
        } else {
            this.layLock.active = true;
            this.btnIcon.interactable = false;
        }

        let sprite = this.btnIcon.node.getComponent(cc.Sprite);
        cc.loader.loadRes('./hall/imgs/game_icons/gicon_huzhou', cc.SpriteFrame, function(err, spriteFrame) {
            if (err) {
                throw err;
                return;
            }
            sprite.spriteFrame = spriteFrame;
        });
    },

    onTouchToGame: function() {
        // util.tips('游戏暂未开通');
        ideal.view.hide('popSearch');
        ideal.view.go('example');
    },

    onTouchDownload: function(ev) {
        if (!this.layLock.active) {
            return;
        }
        this.layLock.active = false;
        this.layDownload.active = true;

        let v = 0;
        let max = 2000;
        let f1 = function() {
            v += util.rnd(1, 80);

            if (v > max) {
                v = max;
            }

            this.imgProgress.fillRange = 1 - (v / max);

            if (v < max) {
                setTimeout(f1.bind(this), 30);
            } else {
                this.layDownload.active = false;
                this.btnIcon.interactable = true;

                let finishList = cc.sys.localStorage.getItem('download_finish');

                if (finishList == null) {
                    finishList = [];
                } else {
                    finishList = JSON.parse(finishList);
                }

                finishList.push(this.data.id);
                cc.sys.localStorage.setItem('download_finish', JSON.stringify(finishList));
            }
        };

        f1.call(this);
    },
});
