/**
 * Created by liulin on 2016/11/24.
 *
 * page的责任就是构建 这个页面
 *
 * 做 2 件事情
 */

ES.MuckOperat.MapMonitor = {};

ES.MuckOperat.MapMonitor.vertion = '0.0.1';

// 监控页面的所有配置
ES.MuckOperat.MapMonitor.Config = {
    //  所有事件

};

// 监控页面的所有配置
ES.MuckOperat.MapMonitor.Err = {
    //  所有事件

};

// 指明地图div 加载div


ES.MuckOperat.MapMonitor.Page = ES.Page.extend({

    oOption: {
        cPageDivJ: '#PagerMainBox',
        cMapContainId: 'MapContain',

        oUIConfig: {
            div: {
                id: 'PagerMainBox',
                div: {
                    'class': 'main-content',
                    div: [
                        {'class': 'pager-wrapper'},
                        {
                            'class': 'pager-wrapper',
                            div: [
                                // 放地图的地图
                                {'class': 'pager-left pager-content-wrapper tab-content'},
                                // 地图其他面板
                                {'class': 'pager-right pager-control'}
                            ]

                        }
                    ]

                },
            }
        }
    },

    // 构造函数
    initialize: function (id, options) {
        ES.setOptions(this, options);
        ES.Page.prototype.initialize.call(this, id);
    },

    // 地图的高度
    height: function () {
        return $(window).height();
    },

    // 地图的宽度
    width: function () {
        return $(window).width();
    },

    // 初始化地图结果
    initLayout: function () {
        ES.initTag($(ES.MuckOperat.Config.cBody), this.oOption.oUIConfig);

        this.oDivHeader = $(ES.MuckOperat.Config.cJClass + this.oOption.oUIConfig.div.div.div[0].class).eq(0);
        this.oBody = $(ES.MuckOperat.Config.cJClass + this.oOption.oUIConfig.div.div.div[0].class).eq(1);

        // 设置地图contain id 设置div
        this.oBody.find('div:eq(0)').attr({id: this.oOption.cMapContainId});
    },

    // 获得 页面的体
    getBody: function () {
        return this.oBody;
    },

    // 获得 页面的头
    getHead: function () {
        return this.oDivHeader;
    }


});