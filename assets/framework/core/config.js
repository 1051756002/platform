let config = {};

// 是否为开发模式
config.debug = true;

// 调试等级, 决定日志输出
// 1: 系统日志, 通讯日志, 常用日志
// 2: 系统日志, 通讯日志
// 3: 系统日志
config.debugLevel = 1;

// 是否纯净化日志, 清除框架启动前的日志
config.pureLog = false;

// 客户端版本号
config.version = '0.0.1';

// 服务器配置
config.server = [
	// 登录服务器
	{
		// 地址
		address: '192.168.199.233',
		// 端口
		port: 3000,
	},
	// 游戏业务服务器
	{
		// 地址
		address: '127.0.0.1',
		// 端口
		port: 9411,
		// 重连次数上限
		reconnLimit: 5,
	}
];


// HTTP请求服务器
config.httpServer = 'http://121.196.204.236/website_jinzhong/http_api/api.php';
config.httpServer = 'http://192.168.0.29:3000/login';



// 是否启用Protobuf
config.enableProtobuf = true;

// 是否启用Socket
config.enableSocket = false;

// 不打印日志的接收命令
config.notlog_recv = [0];

// 不打印日志的接收命令
config.notlog_send = [0];

// proto文件列表
config.protolist = [
	'./proto/msg-socket',
];

// 游戏场景页面
config.scenes = {
    main: ['pageHall', 'pageHotUpdate'],
    test: ['pageEntry', 'pageTest'],
};

module.exports = config;
