/**
 * Created by liulin on 2016/12/19.
 *
 * 容器 tab 加载项
 *
 *
 * 包括 2 个部分，
 * 一个部分为查询面板
 *
 * 一个部分为 车辆列表
 *
 * 要支持2种
 * 一种为全加载
 * 一种为部分加载
 */


ES.MapView.TabPanel = ES.Evented.extend({

    oUIConfig: {
        div: {
            'class': 'ex-layout-sider ex-theme-sider',
        }
    },

    oOption: {

        bIsCreate: true,

        // 初始化监听事件
        cEvenName: 'MV:VehSitePanel.initVehSite',

        // 当前div通用的样式,如果为空，以html 为容器
        acContainerDivClass: ['ex-layout-sider', 'ex-theme-sider'],

        cContainerSel: '.ex-layout-main',

        // 当前面板标志
        cFlag: 'site',

        // 是否显示查询面板
        bIsShowPanel: true,


        cTitle: '工地搜索车辆',

        // -- 界面加载完成 后触发的事件,url 加载
        cEventNameTabLoad: 'MapView:TabPanel.TabLoad',

    },

    oPagerParam: {
        // 分页总数
        nTotalCnt: 0,
        //当前页数
        nPageIndex: 1,
        //按钮总数
        nBtnCnt: 8,
        //每页大小
        nPageSize: 10,
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this._oPage = oParent._oParent
        // 保存当前页面对象
        this.$_oPanel = null;

        // 车辆list
        this.oListView =null;
        
        // 查询list
        this.oStrcukBox = null;
        
        // 简化变量定义
        this.cFlag = this.oOption.cFlag;

        this.cDivVehContent = '.ex-layout-sider.ex-theme-sider.' + this.cFlag + ' .ex-layout-carlist-content';

        this.initOn();

        this.initUI();
    },

    initUI: function () {

        if (!this.oOption.bIsCreate) {
            return;
        }
        this.$_oPanel = ES.getTag(this.oUIConfig);
        this.$_oPanel.addClass(this.oOption.cFlag);
        this.$_oPanel.css({width: '220px'});
        $(this.oOption.cContainerSel).append(this.$_oPanel);
        this._oParent.fire(this.oOption.cEventNameTabLoad);

        // 查询过滤树结构
        this.initPanel();

        // 车辆列表结构
        this.initListView();

        this.showBox();


    },

    // 初始化面板数据cListView
    initPanel: function () {
        // 是否显示查询面板
        if (!this.oOption.bIsShowPanel) {
            return;
        }
        var oTemp = eval(this.oOption.cObject);

        this.oStrcukBox = new oTemp(this, {
                // 树的顶级容器，不是树容器
                cDivContainerSel: this.$_oPanel,
                //cUrl: '',
                cTitle: this.oOption.cTitle
            },
            ES.oConfig[this.oOption.cFlag]);


    },

    // 初始化面板数据cListView
    initListView: function () {
        if (!this.oOption.cListView) {
            return;
        }


        var oTemp = eval(this.oOption.cListView);

        // list 控件
        this.oListView = new oTemp(this, {
                // 树的顶级容器，不是树容器
                cDivContainerSel: this.$_oPanel,
                cTitle: this.oOption.cListTitle,
                nPageSize: 15,
                cUrl:this.oOption.cUrl,
            },
            ES.oConfig[this.oOption.cFlag]);
        var $_oPanel = this.oListView.getPanel();
        // 分页控件
        this.oPager = new ES.MapView.TabPanel.LstPager(this, {nPageSize: 15, $_oPanel: $_oPanel});
    },

    // 监听事件
    initOn: function () {
        //this._oParent.on(this.oOption.cEvenName, this.initTabPanel, this);
        //this._oParent.on('flishLoaded', this.loadTree, this);
    },

    // 显示查询面板
    showBox: function () {
        if (!this.$_oPanel) {
            return;
        }

        this.$_oPanel.show();



    },

    // 隐藏查询面板
    hideBox: function () {
        this.$_oPanel.hide();

    },


    getWidth: function () {
        var nWidth = 0;
        if (this.oListView) {
            nWidth = this.oListView.getWidth();
        }

        if (this.oStrcukBox) {
            nWidth =nWidth+ this.oStrcukBox.getWidth();
        }

        return nWidth;
    }
    
});
