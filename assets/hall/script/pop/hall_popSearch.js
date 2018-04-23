cc.Class({
    extends: require('basePop'),

    properties: {
        layContent: cc.Node,

        prefabItemGame: cc.Prefab,
    },

    onShow: function(param) {
        this.loadGameList(param.gameList);
    },

    loadGameList: function(gameList) {
        // 清空节点列表
        this.layContent.removeAllChildren();

        // 游戏列表
        for (let i in gameList) {
        	let item = cc.instantiate(this.prefabItemGame);
        	let comp = item.getComponent('hall_itemGame');
        	comp.initStyle(gameList[i]);
        	this.layContent.addChild(item);
        }
    },
});
