let manage = {};

/**
 * 显示
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @param    {object}
 * @return   {void}
 */
manage.show = function(nodeName, param) {
    if (nodeName.slice(0, 4) == 'page') {
        this.page.show(nodeName, param);
    } else if (nodeName.slice(0, 3) == 'pop') {
        this.pop.show(nodeName, param);
    } else if (nodeName.slice(0,3) == 'fix') {
        this.fix.show(nodeName, param);
    } else {
        util.log_sys('%-#f00', 'Error: "{0}" is invalid name.', nodeName);
    }
};

/**
 * 隐藏
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @param    {string}
 * @return   {void}
 */
manage.hide = function(nodeName) {
    if (nodeName.slice(0, 3) == 'pop') {
        this.pop.hide(nodeName);
    } else if (nodeName.slice(0,3) == 'fix') {
        this.fix.hide(nodeName);
    } else {
        util.log_sys('%-#f00', 'Error: "{0}" is invalid name.', nodeName);
    }
};

/**
 * 刷新
 * @Author   Zjw
 * @DateTime 2018-04-12
 * @return   {void}
 */
manage.refresh = function() {
};

/**
 * 切换到指定项目
 * @Author   Zjw
 * @DateTime 2018-04-17
 * @param    {string}                 projectName 项目名称
 * @return   {void}
 */
manage.go = function(projectName) {
    this.project.go(projectName);

    util.log_sys('当前项目: {0}', projectName);
};


/**
 * 弹窗类
 */
manage.pop = {
    show: function(popName, param) {
        let p = cc.find(popName);
        if (p != null) {
            p.getComponent('basePop').show(param);
        } else {
            util.log_sys('%-#f00', 'Error: Pop "{0}" not found.', popName);
        }
    },

    hide: function(popName) {
        let p = cc.find(popName);
        if (p != null) {
            p.getComponent('basePop').hide();
        } else {
            util.log_sys('%-#f00', 'Error: Pop "{0}" not found.', popName);
        }
    },
};


/**
 * 常驻节点
 */
manage.fix = {
    // 得到常驻节点
    getFixed: function(fixName) {
        for (var i in cc.game._persistRootNodes) {
            if (fixName == cc.game._persistRootNodes[i]._name) {
                return cc.game._persistRootNodes[i];
            }
        }
        util.log_sys('%-#f00', 'Error: Fixed "{0}" not found.', fixName);
    },

    // 显示一个常驻节点
    show: function(fixName, param) {
        var p = this.getFixed(fixName);
        if (p) {
            p.getComponent('baseNode').show(param);
        } else {
            util.log_sys('%-#f00', 'Error: Fixed "{0}" not found.', fixName);
        }
    },

    // 隐藏一个常驻节点
    hide: function(fixName) {
        var p = this.getFixed(fixName);
        if (p) {
            p.getComponent('baseNode').hide();
        } else {
            util.log_sys('%-#f00', 'Error: Fixed "{0}" not found.', fixName);
        }
    }
};


/**
 * 页面类
 */
manage.page = {
    // 当前显示页
    ACTIVE_PAGE: null,

    /**
     * 本场景隐藏当前活动的页面
     * @return {void}
     */
    localHide: function() {
        if (this.ACTIVE_PAGE && this.ACTIVE_PAGE.isValid) {
            this.ACTIVE_PAGE.getComponent('basePage').hide();
            this.ACTIVE_PAGE = null;
        }
    },

    /**
     * 本场景切换Page显示
     * @param  pageName  页面名
     * @param  param     跳转传参
     * @return {boolean} 是否在本场景中
     */
    localShow: function(pageName, param) {
        var p = cc.find('Canvas/' + pageName);
        if (p) {
            this.localHide(); //关闭当前打开的Page
            this.ACTIVE_PAGE = p;
            p.getComponent('basePage').show(param);
        }
        return p;
    },

    /**
     * 通过页面名得到场景名
     * @param  pageName  页面名
     * @return {string}  场景名
     */
    getSceneName: function(pageName) {
        let project = manage.project.ACTIVE_PROJECT;
        for (var i in project.scenes) {
            for (var j in project.scenes[i]) {
                if (project.scenes[i][j] == pageName) {
                    return project.name + '_' + i;
                }
            }
        }
    },

    /**
     * 切换新场景显示
     * @param  sceneName  场景名称
     * @return {void}
     */
    showScene: function(sceneName, pageName, param) {
        // 关闭当前打开的Page
        this.localHide();
        cc.director.loadScene(sceneName, function() {
            util.fixedPage();
            this.localShow(pageName, param);
        }.bind(this));
    },

    /**
     * 显示指定页
     * @param  pageName  页面名
     * @param  param     参数
     */
    show: function(pageName, param) {
        if (!this.localShow(pageName, param)) {
            // 加载页面所在场景
            var sceneName = this.getSceneName(pageName);
            if (sceneName) {
                this.showScene(sceneName, pageName, param);
            } else {
                util.log_sys('%-#f00', 'Error: Page "{0}" not found.', pageName);
            }
        }
    },

    // 刷新页面
    refresh: function(pageName, param) {
        var p = (pageName == null ? this.ACTIVE_PAGE : cc.find('Canvas/' + pageName));
        if (p) {
            p.getComponent('baseNode').refresh(param);
        }
        return p;
    }
};

manage.project = {
    // 当前运作的项目
    ACTIVE_PROJECT: null,

    closeProject: function(config) {
        // 移除util模块
        let u_main = config.name + '_util_main';
        if (util.isDefine(u_main)) {
            for (let i in u_main) {
                delete util[i];
            };
        }
    },

    openProject: function(config) {
        // 载入util模块
        let u_main = require(config.name + '_util_main');
        if (util.isDefine(u_main)) {
            for (let i in u_main) {
                if (util[i] == undefined) {
                    util[i] = u_main[i];
                } else {
                    util.log_sys('%-#f00', 'util.{0} registration failed, already existed.', i);
                }
            };
        }

        // 载入ui模块
        manage.show(config.launchPage);
    },

    go: function(projectName, param) {
        // 关闭当前打开的项目
        if (this.ACTIVE_PROJECT) {
            if (projectName == this.ACTIVE_PROJECT.name) {
                return;
            }
            this.closeProject(this.ACTIVE_PROJECT);
        }

        let project = ideal.config.projects[projectName];

        if (util.isDefine(project)) {
            let projectConfig = require(project);
            this.ACTIVE_PROJECT = projectConfig;
            this.openProject(projectConfig);
        } else {
            util.log_sys('%-#f00', 'framework/core/ui/manage.js Error: no project was found "{0}"', projectName);
        }
    },
};


module.exports.go = manage.go.bind(manage);
module.exports.show = manage.show.bind(manage);
module.exports.hide = manage.hide.bind(manage);
module.exports.refresh = manage.refresh.bind(manage);