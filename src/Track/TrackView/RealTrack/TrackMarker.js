/**
 * 轨迹点在地图上的展示,存在问题，轨迹点可能重复画
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.RealTrack.TrackMarker = ES.TrackView.RealTrack.BaseRealTrack.extend({
    // 系统构造函数
    initialize: function (oParent, oOption) {
        ES.TrackView.RealTrack.BaseRealTrack.prototype.initialize.call(this, oParent, oOption);
        this._oParent = oParent;

        //单次轨迹停车计算
        this.aoParkInfo = new Array();
        this.initOn();
        this.initGroup();
    },

    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.firstReqTrackBC, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.firstReqTrackBC, this);
        this._oParent.on(this._oParent.getEvenName("setPosClass"), this.setPosClass, this);

        this._oParent.on(this._oParent.getEvenName("setToFront"), this.setToFront, this);
    },

    setToFront: function () {
        this._oLayerGroup.bringToFront();
    },
    /*
     // 第一次轨迹回放,
     firstReqTrackBC: function (oData) {
     if (!oData || !oData.aoPageTrack || oData.aoPageTrack.length <= 0) return;
     var self = this;
     $.each(oData.aoPageTrack, function (nIndex,oItem) {
     var oPosMarker = L.circleMarker([oItem.Lat, oItem.Lng], ES.TrackView.Config.oTrackPosConfig);
     var cHtml = self.getVecMarkerHtmlNotBtn(oItem);
     oPosMarker.bindPopup(cHtml);
     oPosMarker.addTo(self._oLayerGroup);
     })
     this.setPosClass();
     },
     setPosClass: function () {
     var oCkbStatus = this._oParent.getCkbStatus();
     if (!oCkbStatus) return;
     var aoLayer = this._oLayerGroup.getLayers();
     if (!aoLayer || aoLayer.length <= 0) return;

     for (var i = 0 ; i < aoLayer.length; i++) {
     if (oCkbStatus.bIsTrackPos) {
     L.DomUtil.removeClass(aoLayer[i]._path, 'ec-hide');
     }
     else {
     L.DomUtil.addClass(aoLayer[i]._path, 'ec-hide');
     }
     }
     },
     */
    //轨迹点
    firstReqTrackBC: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;
        this.aoTrack = oData.aoTrack;
        this.setPosClass();
    },

    setPosClass: function () {
        var oCkbStatus = this._oParent.getCkbStatus();
        if (!oCkbStatus) return;
        if (oCkbStatus.bIsTrackPos) {
            var self = this;
            $.each(this.aoTrack, function (nIndex, oItem) {
                var oPosMarker = L.circleMarker([oItem.Lat, oItem.Lng], ES.TrackView.Config.oTrackPosConfig);
                var cHtml = self.getVecMarkerHtmlNotBtn(oItem);
                oPosMarker.bindPopup(cHtml);
                oPosMarker.addTo(self._oLayerGroup);
            })
        } else {
            this.clearMap();
        }
    },



});