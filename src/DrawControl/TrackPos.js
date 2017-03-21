/**
 * Created by liulin on 2016/12/28.
 *
 * 实时跟踪点显示
 *
 * 必须使用 movemarker 插件
 * 实时监控点 只保存2个点信息数据
 *
 */
// 地图基础操作
//L.MapLib.MapMaster.MapOpr
//L.MapLib.MapMaster.Map

ES.TrackPosLayer = L.MapLib.MapMaster.MapOpr.extend({

    // 系统构造函数
    initialize: function (oParent, oOption) {

        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption);
        //this._oParent = oParent;

        // 定时器
        //this.oTimes = new ES.MonitorTimer(this, { nIntervalSpeed: 100, bIsStart: false });

        //单次轨迹停车计算
        //this.aoParkInfo = new Array();

        this.initOn();

        this.initGroup();


    },

    initGroup: function () {
        this._oLayerGroup = new L.featureGroup();
        this._oLayerGroup.addTo(this._oMap);
    },

    // 重写父亲类的 方法 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on('TrackPosLayer:createMarker', this.createMarker, this);
        this._oParent.on('TrackPosLayer:MoveTo', this.play, this);

        //通知定时器开始执行播放轨迹
        //this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.noticeTimerPlay, this);

        //setPlaySpeed//playFinish
        //this._oParent.on(this._oParent.getEvenName("setPlaySpeed"), this.setPlaySpeed, this);

        // 判断是否播放轨迹
        //this._oParent.on(this._oParent.getEvenName("setPopupOpen"), this.setPopupOpen, this);

        // 暂停轨迹回放
        //this._oParent.on(this._oParent.getEvenName("pause"), this.stop, this);

        // 触发停止播放轨迹
        //this._oParent.on(this._oParent.getEvenName("playFinish"), this.stop, this);
    },

    // 创建点
    createMarker: function (oLatLng,oOption,oBusData) {

        var oMarkerOpt = {};
        if (oOption.oIconConfig) {
            var oIcon = L.icon(oOption.oIconConfig);
            oMarkerOpt.icon = oIcon;
        }

        this.oMarker = L.Marker.movingMarker(oLatLng, oOption.duration, oMarkerOpt);
        this.oMarker.cId = oBusData.id;
        this.oMarker.oData = oBusData

    },

    showMarker:function(){
        this.oMarker.addTo(this._oLayerGroup);
    },

    moveTo: function (oLatLng,option,oBusData) {

        var oLayer = this.findLayer(this._oLayerGroup ,oBusData.id);

        if(!oLayer){
            console.log('没有找到移动的点!');
            return;
        }

        oMarker.moveTo(oLatLng, option.duration);

        if(oOption.oIconConfig) {
            var oIcon = L.icon(oOption.oIconConfig);
            oLayer.setIcon(oIcon);
        }
    },

    clearMarker: function () {
        this._oLayerGroup.clearLayers();
    }

});



ES.PosLayer = ES.Class.extend({

    // 系统构造函数
    initialize: function (oParent, oOption) {

        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption);
        //this._oParent = oParent;

        // 定时器
        //this.oTimes = new ES.MonitorTimer(this, { nIntervalSpeed: 100, bIsStart: false });

        //单次轨迹停车计算
        //this.aoParkInfo = new Array();

        this.initOn();

        this.initGroup();


    },

    initGroup: function () {
        this._oLayerGroup = new L.featureGroup();
        this._oLayerGroup.addTo(this._oMap);
    },

    // 重写父亲类的 方法 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on('TrackPosLayer:createMarker', this.createMarker, this);
        this._oParent.on('TrackPosLayer:MoveTo', this.play, this);

        //通知定时器开始执行播放轨迹
        //this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.noticeTimerPlay, this);

        //setPlaySpeed//playFinish
        //this._oParent.on(this._oParent.getEvenName("setPlaySpeed"), this.setPlaySpeed, this);

        // 判断是否播放轨迹
        //this._oParent.on(this._oParent.getEvenName("setPopupOpen"), this.setPopupOpen, this);

        // 暂停轨迹回放
        //this._oParent.on(this._oParent.getEvenName("pause"), this.stop, this);

        // 触发停止播放轨迹
        //this._oParent.on(this._oParent.getEvenName("playFinish"), this.stop, this);
    },

    // 创建点
    createMarker: function (oLatLng,oOption,oBusData) {

        var oMarkerOpt = {};
        if (oOption.oIconConfig) {
            var oIcon = L.icon(oOption.oIconConfig);
            oMarkerOpt.icon = oIcon;
        }

        this.oMarker = L.Marker.movingMarker(oLatLng, oOption.duration, oMarkerOpt);
        this.oMarker.cId = oBusData.id;
        this.oMarker.oData = oBusData

    },

    showMarker:function(){
        this.oMarker.addTo(this._oLayerGroup);
    },

    moveTo: function (oLatLng,option,oBusData) {

        var oLayer = this.findLayer(this._oLayerGroup ,oBusData.id);

        if(!oLayer){
            console.log('没有找到移动的点!');
            return;
        }

        oMarker.moveTo(oLatLng, option.duration);

        if(oOption.oIconConfig) {
            var oIcon = L.icon(oOption.oIconConfig);
            oLayer.setIcon(oIcon);
        }
    },

    clearMarker: function () {
        this._oLayerGroup.clearLayers();
    }

});

ES.PosLayer1 = ES.PosLayer.extend({

    initOn: function () {
        ES.PosLayer.prototype.initOn.call(this);


    }
});