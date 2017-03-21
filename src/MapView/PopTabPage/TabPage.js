/**
 * Created by liulin on 2016/12/23.
 */



ES.HGT.MapView.TabSite = ES.Evented.extend({
    oOption: {
        cPageUrl: '/MapMonitor/VehInfoView',
        //cOnLoadEven: 'VehInfo:RealStatus.loadVehInfoView',
        //cOnSwitchVehInfoView: "VehInfo:RealStatus.switchVehInfoView",
        cContentSel:'',
    },

    // 车辆列表构造函数
    initialize: function(oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.$_oContent = $(".ex-layout-cardetail-content.veh-other-info");

        // 初始化界面
        this.initUI();

        //初始化事件监听
        this.initOn();

    },

    // 监听事件
    initOn: function() {
        // 加载界面
        //this._oParent.on(this.oOption.cOnLoadEven, this.loadVehInfoView, this);

        // 切换数据，
        //this._oParent.on(this.oOption.cOnSwitchVehInfoView, this.loadVehInfoView, this);

    },

    // 加载详情界面
    loadDetailView: function (oGpsInfo) {
        //this.$_oContent.show();
        this.oOption.cContentSel.load(this.oOption.cPageUrl, { "id": oGpsInfo.Id });
    },


    switchDetailView: function (oData) {
        // 切换界面
        this.loadDetailView(oData);
    },

    // 初始化界面
    initUI: function() {
        //this.$_oContent.css({
        //    "width": "100%",
        //    "height": $('.ex-layout-cardetail').height() - 40,
        //    "overflow": "auto"
        //})
    }
});