/**
 * Created by exsun on 2017-01-10.
 */

ES.HGT.CloudMap.TreeFrame = ES.Evented.extend({


    oOption: {

        bIsCreate: true,

        // 初始化监听事件
        cEvenName: 'MV:VehSitePanel.initVehSite',

        // 当前div通用的样式,如果为空，以html 为容器
        acContainerDivClass: ['ex-layout-sider', 'ex-theme-sider'],

        cContainerSel: '.ex-layout-main',

        // div 插入的位置
        //acInsertPosition: ['ex-layout-menu', 'ex-theme-menu', 'ec-avg-md-1'],

        // 资源url
        //cUIUrl: '/Asset/scripts/site/MapMonitor/VehPanel/VehSitePanel.html',

        // 当前面板标志
        cFlag: 'site',


        cTitle: '工地搜索车辆',


        // -- 界面加载完成 后触发的事件,url 加载
        cEventNameTabLoad: 'MapView:TabPanel.TabLoad',

        // 是否加载车辆列表
        bIsLoadVehLst: false,
    },


    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        // 保存当前页面对象
        this.$_oPanel = null;


        this._oFrame = {};
        this.initOn();


    },

    initUI: function () {

        if (!this.oOption.bIsCreate) {
            return;
        }

    },


    // 监听事件
    initOn: function () {
        this._oParent.on(this.oOption.cEvenName, this.initTabPanel, this);

    },

    initTabPanel: function (oData) {
        if (!this._oFrame[oData.cFlag]) {
            this._oFrame[oData.cFlag] = new ES.HGT.CloudMap.TagTree(
                this,
                {cFlag: oData.cFlag},
                ES.HGT.oConfig.CloudMap[oData.cFlag]);
        }
        else {
            // 加载所有的围栏
            this._oFrame[oData.cFlag].drawNode();
        }

        this._oFrame[oData.cFlag].show();

        for (var cKey in this._oFrame) {
            if (cKey !== oData.cFlag) {
                this._oFrame[cKey].hide();
            }
        }
    },

    // 显示查询面板
    showBox: function () {
        if (!this.$_oPanel) {
            return;
        }
        var cTitle = this.oOption.cTitle;
        this.$_oPanel.show();

        this.$_oPanel.find('.ex-layout-struckbox-title > h4').html(cTitle);

    },

    // 隐藏查询面板
    hideBox: function () {
        this.$_oPanel.hide();
        //$('.ex-layout-carlist').animate({'right': '0'}, 500);
        //$('.ex-layout-carlist a.ex-icon-turn.off').show();
        //$('.ex-layout-carlist a.ex-icon-turn.on').hide();
    },

});
