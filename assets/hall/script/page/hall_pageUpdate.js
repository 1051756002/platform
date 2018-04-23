// 版本比较函数
let compareVersion = function(version1, version2) {
    util.log("JS Custom Version Compare: version A is " + version1 + ', version B is ' + version2);
    var vA = version1.split('.');
    var vB = version2.split('.');
    for (var i = 0; i < vA.length; ++i) {
        var a = parseInt(vA[i]);
        var b = parseInt(vB[i] || 0);
        if (a === b) {
            continue;
        } else {
            return a - b;
        }
    }
    if (vB.length > vA.length) {
        return -1;
    } else {
        return 0;
    }
};

cc.Class({
    extends: require('basePage'),

    properties: {
        lblVersion: cc.Label,
        lblProgress: cc.Label,
        lblPanel: cc.Label,
        progressUpdate: cc.ProgressBar,
        manifestUrl: cc.RawAsset,
    },

    onShow: function() {
        // 是否正在更新中
        this.updating = false;
        // 失败数量
        this.failCount = 0;

        this.initUI();

        // 手机版, 需要热更新检查版本
        if (cc.sys.isNative) {
            this.initHotUpdate();
        } else {
            this.progressUpdate.progress = 1;
            this.entry();
        }

        this.lblVersion.string = 'Version: ' + ideal.config.version;

        // 登录, user_type 1=游客
        ideal.http.get({
            action: 'Hall_Login',
            param: JSON.stringify({
                udid: 'test-gb-udid4',
                user_type: 1,
            }),
        });

        // 登录, user_type 2=微信
        ideal.http.get({
            action: 'Hall_Login',
            param: JSON.stringify({
                udid: 'test-gb-udid3',
                user_type: 2,
                wx_id: 'adfasdfasdfasdfakl',
                nick_name: 'guobin',
                sex: 1,
                avater_url: 'www.baidu.com',
            }),
        });

        this.initWechat();
    },

    initUI: function() {
        this.lblProgress.string = '';
        this.progressUpdate.progress = 0;
        this.lblPanel.string = '正在检测更新版本...';
    },

    // 初始化热更新
    initHotUpdate: function() {
        try {
            // 写入路径
            let writePath = jsb.fileUtils.getWritablePath() + 'platform-remote-asset';
            // 资源管理器
            let am = this.am = new jsb.AssetsManager('', writePath, compareVersion);

            // 设置验证回调, 验证通过返回True
            am.setVerifyCallback(function(path, asset) {
                if (asset.compressed) {
                    util.log_net('verification passed : {0}', asset.path);
                } else {
                    util.log_net('verification passed : {0} ({1})', asset.path, asset.md5);
                }
                return true;
            });

            // 针对Android设备, 设定并发任务的数量; 避免卡顿
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                am.setMaxConcurrentTask(2);
            }

            // 加载版本配置文件
            am.loadLocalManifest(this.manifestUrl);

            if (!am.getLocalManifest() || !this.am.getLocalManifest().isLoaded()) {
                util.tips('热更新配置文件加载失败！', this.initHotUpdate.bind(this));
                return;
            }

            this.checkListener = new jsb.EventListenerAssetsManager(am, this.checkHandle.bind(this));
            cc.eventManager.addListener(this.checkListener, 1);

            ideal.config.version = am.getLocalManifest().getVersion();

            // 开始更新
            am.checkUpdate();
        } catch (err) {
            util.log_sys('%-#f00', '初始化热更新失败！');
            this.lblPanel.string = '初始化热更新失败！';
        }
    },

    startHotUpdate: function() {
        try {
            ideal.view.hide('popTips');

            cc.eventManager.removeListener(this.checkListener);
            this.checkListener = null;

            this.updateListener = new jsb.EventListenerAssetsManager(this.am, this.updateHandle.bind(this));
            cc.eventManager.addListener(this.updateListener, 1);

            // 失败数量
            this.failCount = 0;
            this.am.update();
            this.updating = true;
        } catch (err) {
            util.log_sys('%-#f00', '启动热更新失败！');
        }
    },

    // 检测处理
    checkHandle: function(ev) {
        cc.log('Code: ' + ev.getEventCode());
        switch (ev.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                util.log_sys('找不到本地清单, 跳过热更新.');
                this.lblPanel.string = '无法下载清单文件, 热更新失败.';
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                util.log_sys('无法下载清单文件, 跳过热更新.');
                this.lblPanel.string = '无法下载清单文件, 热更新失败.';
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                util.log_sys(util.format('当前版本: {0}, 已是最新版本.', ideal.config.version));
                this.entry();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                util.tips(
                    '温馨提示',
                    '发现新版本，建议在Wifi环境下进行热更新。',
                    this.startHotUpdate.bind(this),
                    this.restart, this.restart);
                break;
            default:
                return;
        }
    },

    // 更新处理
    updateHandle: function(ev) {
        let needRestart = false;
        let failed = false;
        util.log('EventCode: {0}', ev.getEventCode());

        let EAM = jsb.EventAssetsManager;
        switch (ev.getEventCode()) {
            case EAM.ERROR_NO_LOCAL_MANIFEST:
                util.log_net('找不到本地清单文件，跳过热更新。');
                failed = true;
                break;
            case EAM.ERROR_DOWNLOAD_MANIFEST:
                util.log_net('请求更新配置文件失败！');
                util.tips('请求更新配置文件失败！');
                failed = true;
                break;
            case EAM.ERROR_PARSE_MANIFEST:
                util.log_net('无法下载清单文件，跳过热更新。');
                failed = true;
                break;
            case EAM.ERROR_UPDATING:
                util.log_net('资源更新错误: {0}, {1}', ev.getAssetId(), ev.getMessage());
                break;
            case EAM.ERROR_DECOMPRESS:
                util.log_net(ev.getMessage());
                util.tips(ev.getMessage());
                break;

            // 更新进度
            case EAM.UPDATE_PROGRESSION:
                this.lblProgress.string = (ev.getPercentByFile() * 100).toFixed(2) + '%';
                this.progressUpdate.progress = ev.getPercentByFile();

                util.log('getAssetId: {0}', ev.getAssetId());
                break;
            // 更新失败
            case EAM.UPDATE_FAILED:
                util.log_net('更新失败. {0}', ev.getMessage());
                util.tips(util.format('更新失败. {0}', ev.getMessage()));
                failed = true;
                break;
            // 更新完成
            case EAM.UPDATE_FINISHED:
                util.tips('更新完成, 即将重启！', function() {
                    cc.eventManager.removeListener(this.updateListener);
                    this.updateListener = null;

                    let searchPaths = jsb.fileUtils.getSearchPaths();
                    let newPaths = this.am.getLocalManifest().getSearchPaths();

                    util.log(JSON.stringify(newPaths));
                    Array.prototype.unshift(searchPaths, newPaths);

                    cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                    jsb.fileUtils.setSearchPaths(searchPaths);

                    this.restart();
                }.bind(this));
                break;
            // 已经更新过了
            case EAM.ALREADY_UP_TO_DATE:
                util.log_net('已经更新了最新的远程版本！');
                util.tips('已经更新了最新的远程版本！');
                failed = true;
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this.updateListener);
            this.updateListener = null;
            this.updating = false;
        }
    },

    // 重启
    restart: function() {
        cc.audioEngine.stopAll();
        cc.game.restart();
    },

    // 进入游戏
    entry: function() {
        this.progressUpdate.progress = 1;
        this.lblPanel.string = '即将进入游戏';
        this.node.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.5), cc.callFunc(function() {
            ideal.view.show('pageHall');
        })));
    },

    initWechat: function() {
        if (wx.isActive) {
            return;
        }

        wx.config({
            debug: false,
            appId: 'wx263f28e53ce2de76',
            timestamp: 1524210712,
            nonceStr: 'HYvOjTv9S0vV8NEZ',
            signature: '304985b54fa3ebd7a3ca7faba6bb3afe4a5a62f5',
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'openAddress',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard',
            ],
        });

        wx.ready(function() {
            // util.tips('执行了wx.ready回调');
            wx.isActive = true;

            wx.onMenuShareTimeline({
                title: ideal.config.wxShareTitle, // 分享标题
                link: location.href, // 分享链接
                imgUrl: ideal.config.wxShareIcon, // 分享图标
                success: function() {
                    util.tips('wx.onMenuShareTimeline');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function(res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度

                    // util.tips(JSON.stringify(res));
                    util.tips('定位了');
                }
            });


            let wxUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
            wxUrl += '?appid=wx263f28e53ce2de76';
            wxUrl += '&redirect_uri=' + location.href;
            wxUrl += '&response_type=code';
            wxUrl += '&scope=snsapi_userinfo';
            wxUrl += '&state=STATE';
            wxUrl += '&connect_redirect=1';

            cc.sys.openURL(wxUrl);

            // cc.sys.openURL('http://jifen.xingdong.co/xingdongwebpay/h5Game/getWeixinInfo.php?back=songyuan_h5');
        });

        wx.error(function(res){
            util.tips(JSON.stringify(res));
        });
    },
});
