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
        progressFile: cc.ProgressBar,
        btnHotUpdate: cc.Button,
        manifestUrl: cc.RawAsset,
    },

    // 初始化函数
    onShow: function() {
        if (!cc.sys.isNative) {
            return;
        }

        // util.log('欢迎光临！222');

        // util.tips('欢迎光临！222');

        let writePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'platform-remote-asset';

        // 写入路径: /data/data/com.cocos2d.platform/files/platform-remote-asset
        let am = this.am = new jsb.AssetsManager('', writePath, compareVersion);

        util.log('ENABLE_GC_FOR_NATIVE_OBJECTS: {0}', cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS)
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            // am.retain();
        }

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

        // 初始化进度条
        this.progressFile.progress = 0;
        // 初始化更新状态
        this.updating = false;
        this.btnHotUpdate.interactable = true;
    },

    // 热更新按钮点击事件
    onTouchHotUpdate: function() {
        let am = this.am;

        if (!cc.sys.isNative || !am) {
            util.tips('该系统不支持热更新！');
            return;
        }

        if (this.updating) {
            util.tips('正在进行热更新！');
            return;
        }

        this.updateListener = new jsb.EventListenerAssetsManager(am, this.updateHandle.bind(this));
        cc.eventManager.addListener(this.updateListener, 1);

        util.log('am.state: {0}', am.getState());
        if (am.getState() == jsb.AssetsManager.State.UNINITED) {
            am.loadLocalManifest(this.manifestUrl);
        }

        // 失败数量
        this.failCount = 0;
        this.btnHotUpdate.interactable = false;
        this.updating = true;
        am.update();
    },

    onTouchGoBack: function() {
        ideal.ui.show('pageHall');
    },

    // 热更新处理函数
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
                // this.progressByte.progress = ev.getPercent();
                this.progressFile.progress = ev.getPercentByFile();

                var msg = ev.getMessage();
                if (msg) {
                    util.log_net('{0}%: {1}', ev.getPercent() / 100, msg);
                }

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
                util.tips('热更新提示', '更新完成, 即将重启！', function() {
                    cc.eventManager.removeListener(this.updateListener);
                    this.updateListener = null;

                    let searchPaths = jsb.fileUtils.getSearchPaths();
                    let newPaths = this.am.getLocalManifest().getSearchPaths();

                    util.log(JSON.stringify(newPaths));
                    Array.prototype.unshift(searchPaths, newPaths);

                    cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                    jsb.fileUtils.setSearchPaths(searchPaths);

                    cc.audioEngine.stopAll();
                    cc.game.restart();
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
            this.btnHotUpdate.interactable = true;
        }
    },
});
