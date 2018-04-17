cc.Class({
    extends: cc.Component,

    properties: {
        sounds: [cc.AudioClip],
    },

    onLoad: function() {
        ideal.init(function() {
            this.initPersist();
            this.initSound();

            this.onShow();
        }.bind(this));
    },

    // 初始化常驻节点
    initPersist: function() {
        let nodes = cc.director.getScene().children;
        for (let i in nodes) {
            if (nodes[i] instanceof cc.Node) {
                let node = nodes[i];
                let resp = node.name.match(/^(pop|fix)([a-z|0-9]*)$/i);
                if (resp == null) continue;

                // 载入常驻节点
                if (!cc.game.isPersistRootNode(node)) {
                    cc.game.addPersistRootNode(node);
                    util.log_sys('%-#009999', '常驻节点载入 {0}', node.name);

                    // 强制隐藏
                    node.active = false;

                    // 重定位到屏幕显示区域
                    let widget = node.getComponent(cc.Widget);
                    if (!widget) {
                        widget = node.addComponent(cc.Widget);
                    }

                    widget.left = 0;
                    widget.isAlignLeft = true;
                    widget.right = 0;
                    widget.isAlignRight = true;
                    widget.top = 0;
                    widget.isAlignTop = true;
                    widget.bottom = 0;
                    widget.isAlignBottom = true;
                    widget.isAlignOnce = true;
                }
            }
        }
    },

    // 初始化音效文件
    initSound: function() {
        for (let i in this.sounds) {
            if (typeof this.sounds[i] != 'string') {
                continue;
            }

            let resp = this.sounds[i].match(/\/([a-z|0-9|_]*)\.mp3$/i);
            if (resp == null) {
                util.log_sys('%-#f00', 'unidentified file types "{0}"', this.sounds[i]);
                continue;
            }

            ideal.sound.add(resp[1], this.sounds[i]);
        };
    },

    /**
     * 进入函数 (待重写)
     * @Author   Zjw
     * @DateTime 2018-04-12
     * @param    {object}
     * @return   {void}
     */
    onShow: function(param) {
        // todo ...
    },

    /**
     * 隐藏函数 (待重写)
     * @Author   Zjw
     * @DateTime 2018-04-12
     * @return   {void}
     */
    onHide: function() {
        // todo ...
    },

    /**
     * 刷新函数 (待重写)
     * @Author   Zjw
     * @DateTime 2018-04-12
     * @return   {void}
     */
    onRefresh: function() {
        // todo ...
    },
});