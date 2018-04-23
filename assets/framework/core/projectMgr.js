let projectMgr = {
	ACTIVE_PROJECT: null,
};

/**
 * 切换到指定项目
 * @Author   Zjw
 * @DateTime 2018-04-17
 * @param    {string}                 projectName 项目名称
 * @return   {void}
 */
projectMgr.go = function(projectName) {
    // 关闭当前打开的项目
    if (this.ACTIVE_PROJECT) {
        if (projectName == this.ACTIVE_PROJECT.name) {
            return;
        }
        this.closeProject(this.ACTIVE_PROJECT);
    }

    let project = ideal.config.projects[projectName];

    if (util.isEmpty(project)) {
        util.log_sys('%-#f00', 'framework/core/ui/projectMgr.js Error: no project was found "{0}"', projectName);
        return;
    }

    let projectConfig = require(project);
    this.ACTIVE_PROJECT = projectConfig;
    this.openProject(projectConfig);

    util.log_sys('当前项目: {0}', projectName);
};

/**
 * 获取当前正在运行的项目
 * @Author   Zjw
 * @DateTime 2018-04-23
 * @return   {object}
 */
projectMgr.get = function() {
	return util.clone(this.ACTIVE_PROJECT);
};

projectMgr.closeProject = function(config) {
    // 移除util模块
    let u_util = require(config.name + '_util');
    if (util.isDefine(u_util)) {
        for (let i in u_util) {
            delete util[i];
        };
    };
    // 移除音效模块
    ideal.sound.removeAll();
    // 移除TCP服务模块
    ideal.service.removeAll();
    // 断开TCP服务连接
    ideal.tcp.interrupt();

    // 移除常驻节点
    
};

projectMgr.openProject = function(config) {
    // 载入util模块
    let u_util = require(config.name + '_util');
    if (util.isDefine(u_util)) {
        for (let i in u_util) {
            if (util[i] == undefined) {
                util[i] = u_util[i];
            } else {
                util.log_sys('%-#f00', 'framework/core/ui/projectMgr.js Error: util.{0} registration failed, already existed.', i);
            }
        };
    };
    // 载入服务模块
    let u_service = require(config.name + '_service');
    if (util.isDefine(u_service)) {
        for (let i in u_service) {
            ideal.service.add(u_service[i]);
        };
    };

    // 载入ui模块
    ideal.view.show(config.launchPage);
};

module.exports.go = projectMgr.go.bind(projectMgr);
module.exports.get = projectMgr.get.bind(projectMgr);
