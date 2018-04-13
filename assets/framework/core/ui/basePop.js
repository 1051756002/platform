cc.Class({
    extends: require('baseNode'),

    properties: {
        enableAnim: {
            default: true,
            tooltip: '是否启用动画效果',
        },
    },

    onLoad: function() {
        if (this.enableAnim) {
            let anim = this.addComponent(cc.Animation);

            // 载入POP显示动画
            cc.loader.loadRes('./anims/pop_show', function(err, clip) {
                if (err) {
                    util.log_sys(err);
                    return;
                }
                anim.addClip(clip);
            }.bind(this));
            
            // 载入POP隐藏动画
            cc.loader.loadRes('./anims/pop_hide', function(err, clip) {
                if (err) {
                    util.log_sys(err);
                    return;
                }
                anim.addClip(clip);
            }.bind(this));
        }
    },

    _showAnimF1: function() {
        let param = this._param;
        this.node.active = true;
        this.onShow(param);
        delete this._param;
    },

    _hideAnimF1: function() {
        this.node.active = false;
        this.onHide();
    },

    // 显示弹窗
    show: function(param) {
        this._param = param;
        if (this.enableAnim) {
            this.getComponent(cc.Animation).play('pop_show');
        } else {
            this._showAnimF1();
        }
    },

    // 隐藏弹窗
    hide: function() {
        if (this.enableAnim) {
            this.getComponent(cc.Animation).play('pop_hide');
        } else {
            this._hideAnimF1();
        }
    },
});
