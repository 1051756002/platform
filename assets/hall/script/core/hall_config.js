let config = {};

// 项目名
config.name = 'hall';
// 起始页面
config.launchPage = 'pageUpdate';

// 游戏场景页面
config.scenes = {
	index: ['pageUpdate'],
    main: ['pageHall', 'pageHotUpdate'],
    test: ['pageEntry', 'pageTest', 'pageGame'],
};

module.exports = config;
