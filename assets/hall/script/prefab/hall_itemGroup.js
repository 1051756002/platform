cc.Class({
    extends: cc.Component,

    properties: {
        radioGroup: cc.Toggle,
        lblName: cc.Label,
        tagHot: cc.Node,
        tagRegion: cc.Node,
        tagChecked: cc.Node,

        _groupid: 0,

        spriteFrameChecked: cc.SpriteFrame,
    },

    onLoad: function() {
    },

    initHistoryStyle: function(style) {
        this._groupid = style.groupid;
    },

    initHotStyle: function(style) {
        this._groupid = style.groupid;
    },

    initRegionStyle: function(style) {
        this._groupid = style.id;
        this.lblName.string = style.name;
    },

    initNormalStyle: function(style) {
        this._groupid = style.id;
        this.lblName.string = style.name;
        this.tagHot.active = !!style.hot;
    },

    onTouchChecked: function() {
        // 选中此项
        if (this.radioGroup.isChecked) {
            // util.log(this._groupid);
        }

        this.radioGroup.toggleGroup.toggleItems.forEach(function(item) {
            let sprite = item.node.getComponent(cc.Sprite);
            if (sprite._old) {
                sprite.spriteFrame = sprite._old;
            }
        });

        // 检测是否需要更换状态资源
        if (!this.spriteFrameChecked) {
            return;
        }

        let sprite = this.radioGroup.node.getComponent(cc.Sprite);
        if (this.radioGroup.isChecked) {
            sprite._old = sprite.spriteFrame;
            sprite.spriteFrame = this.spriteFrameChecked;
        } else {
            sprite.spriteFrame = sprite._old;
        }
    },
});
