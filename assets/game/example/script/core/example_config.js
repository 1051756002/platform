let config = {};

// 项目名
config.name = 'example';
// 起始页面
config.launchPage = 'pageEntry';

// 游戏场景页面
config.scenes = {
	index: ['pageEntry'],
    main: ['pageTestHall', 'pageHotUpdate', 'pageTest', 'pageGame'],
};

// HTTP请求地址
config.httpServer = 'http://121.196.204.236/website_hall/http_api/api.php';

module.exports = config;
