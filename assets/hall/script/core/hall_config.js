let config = {};

// 项目名
config.name = 'hall';
// 起始页面
config.launchPage = 'pageUpdate';

// 是否启用Protobuf
config.enableProtobuf = false;

// 游戏场景页面
config.scenes = {
    index: ['pageUpdate'],
    main: ['pageTestHall', 'pageHotUpdate', 'pageHall'],
    test: ['pageEntry', 'pageTest', 'pageGame'],
};

// HTTP请求地址
config.httpServer = 'http://121.196.204.236/website_hall/http_api/api.php';
// TCP请求地址
config.tcpServer = 'ws://121.196.204.236:18001';


// 不打印日志的接收命令
config.notlog_recv = [1];

// 不打印日志的接收命令
config.notlog_send = [1];

module.exports = config;
