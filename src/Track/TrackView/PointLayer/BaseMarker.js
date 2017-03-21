/**
 * 所有div 点的 基本接口
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.PointLayer ={};

ES.TrackView.PointLayer.BaseMarker = L.MapLib.MapMaster.MapOpr.extend({

    oOption: {
        // 像素显示
        cPosName: "轨迹开始点",

    },

    // 系统构造函数
    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption);
        this._oParent = oParent;

        this.initOn();
        this.initGroup();
    },

    // 初始化图层
    initGroup: function () {
        this._oMarkerGroup = new L.featureGroup();
        this._oMarkerGroup.addTo(this._oMap);
    },

    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on(this._oParent.getEvenName("drawMarker"), this.drawMarker, this);
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.firstReqTrackBC, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.firstReqTrackBC, this);

    },

    clearMap: function () {
        this._oMarkerGroup.clearLayers();
    },
    // 获得popup 的html
    getHtml: function (oPosInfo) {

        var oTemp = ES.extend({}, oPosInfo, {cPoiInfo: oPosInfo.PoiInfo || ''});
        var cHtml = '<h4><b>{cPosName}</b></h4>'
            //+ '<b>总里程：{dMileage} Km</b><br />'
            + '<b>位置：{cPoiInfo} </b><br />'
            + '<b>时间：{cGpsDateTime} </b><br />';

        return ES.Util.template(cHtml, oTemp);
    },

    getIcon: function () {
        var oIcon = L.divIcon({
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-site-marker"></div>',
        });
        return oIcon
    },

    // 开始画点
    drawMarker: function (oData) {
        if (!oData || !oData.oGpsInfo) return;

        var oLayer = this.findLayer(this._oMarkerGroup, oData.oGpsInfo.PhoneNum);
        if (!oLayer) {
            oLayer = L.marker([oData.oGpsInfo.Lat, oData.oGpsInfo.Lng], { icon: this.getIcon() });
            oLayer.addTo(this._oMarkerGroup);
        } else {
            // 更新位置信息
            oLayer.setLatLng([oData.oGpsInfo.Lat, oData.oGpsInfo.Lng]);
        }
        var oTemp = {};
        ES.extend(oTemp, {
            cPosName: this.oOption.cPosName,
            cGpsDateTime: oData.oGpsInfo.GpsDate.replace("T", " "),
            dMileage: (parseInt(oData.oGpsInfo.Mileage)/1000).toFixed(2),
        });
        oLayer.bindPopup(this.getHtml(oTemp));

    },
})