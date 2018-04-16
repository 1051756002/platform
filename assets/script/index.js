cc.Class({
    extends: cc.Component,

    onLoad: function() {
        ideal.init(function() {
            this.initPersist();

            ideal.ui.show('pageUpdate');
        }.bind(this));
    },

    // 初始化常驻
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
});
