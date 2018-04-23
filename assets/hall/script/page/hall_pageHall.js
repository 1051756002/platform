cc.Class({
    extends: require('basePage'),

    properties: {
    	editSearch: cc.EditBox,
    	layGroupContent: cc.Node,
    	layGameContent: cc.Node,

    	prefabItemGame: cc.Prefab,
    	prefabItemGroupHistory: cc.Prefab,
    	prefabItemGroupHot: cc.Prefab,
    	prefabItemGroupRegion: cc.Prefab,
    	prefabItemGroupNormal: cc.Prefab,
    },

    onShow: function(param) {
        ideal.http.get({
        	action: 'Hall_AllGameList',
        	param: '[]',
        }, this.loadGroupList.bind(this));
    },

    onHide: function() {
    	delete this.data;
    },

    loadGroupList: function(data) {
        // 推荐列表
        let hotList = [];
        // 定位列表
        let region = null;
        // 地区列表
        let areaList = [];

        this.data = data;

        // 筛选出省份
        data.area_list.forEach(function(area) {
        	if (area.parents_id == 0) {
        		if (!region) {
        			region = area;
        		} else {
        			areaList.push(area);
        		}
        	}
        });

        // 清空节点列表
        this.layGroupContent.removeAllChildren();
        let toggleGroup = this.layGroupContent.getComponent(cc.ToggleGroup);

        // 定位列表
        if (region) {
    		let item = cc.instantiate(this.prefabItemGroupRegion);
    		let comp = item.getComponent('hall_itemGroup');
    		comp.initRegionStyle(region);
    		comp.radioGroup.toggleGroup = toggleGroup;
    		this.layGroupContent.addChild(item);

	        let checkEventHandler = new cc.Component.EventHandler();
			checkEventHandler.target = this.node;
			checkEventHandler.component = 'hall_pageHall';
			checkEventHandler.handler = 'loadGameList';
			checkEventHandler.customEventData = region.id;
			comp.radioGroup.checkEvents.push(checkEventHandler);
        }

        // 地区列表
        for (let i in areaList) {
    		let item = cc.instantiate(this.prefabItemGroupNormal);
    		let comp = item.getComponent('hall_itemGroup');
    		comp.initNormalStyle(areaList[i]);
    		comp.radioGroup.toggleGroup = toggleGroup;
    		this.layGroupContent.addChild(item);

	        let checkEventHandler = new cc.Component.EventHandler();
			checkEventHandler.target = this.node;
			checkEventHandler.component = 'hall_pageHall';
			checkEventHandler.handler = 'loadGameList';
			checkEventHandler.customEventData = areaList[i].id;
			comp.radioGroup.checkEvents.push(checkEventHandler);
        };

        // 默认选中第一个
        toggleGroup.toggleItems[0].check();
    },

    loadGameList: function(ev, groupid) {
    	// 游戏列表
        let gameList = [];

        // 筛选出游戏
        this.data.game_list.forEach(function(game) {
        	if (game.province_id == groupid) {
        		gameList.push({ id: game.id, name: game.name });
        	}
        });

        // 清空节点列表
        this.layGameContent.removeAllChildren();

        // 游戏列表
        for (let i in gameList) {
        	let item = cc.instantiate(this.prefabItemGame);
        	let comp = item.getComponent('hall_itemGame');
        	comp.initStyle(gameList[i]);
        	this.layGameContent.addChild(item);
        }
    },

    onTouchSearch: function() {
    	let content = util.trim(this.editSearch.string);
    	if (content.length == 0) {
    		util.tips('请输入搜索内容', function() {
    			this.editSearch.string = '';
    		}.bind(this));
    		return;
    	}

        ideal.view.show('popSearch', {
            gameList: this.data.game_list.slice(0, util.rnd(1, 10)),
        });
    },
});
