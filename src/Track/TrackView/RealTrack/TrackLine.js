/**
 * Created by liulin on 2017/2/22.
 */

    // 实时画线操作
ES.TrackView.RealTrack.TrackLine =ES.TrackView.RealTrack.BaseRealTrack.extend({

    // 引用内部事件
    includes: ES.Mixin.Events,

    oEvenName:{ // 画起始点对象
        drawMarker: "Track:BeginEndMarker.drawMarker",
    },

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
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.noticeTimerPlay, this);

        this._oParent.on(this._oParent.getEvenName("setTrackClass"), this.setTrackClass, this);
    },

    // 画轨迹线
    firstReqTrackBC: function (oData) {
        this.noticeTimerPlay(oData);
        var oBound = this._oLayerGroup.getBounds();
        if (!oBound) {
            return;
        }
        if (!oBound.hasOwnProperty('_northEast')) {
            return;
        }

        this._oMap.fitBounds(oBound);

    },

    noticeTimerPlay: function (oData) {
        this.drawTrack(oData)
        this.setTrackClass(oData);
    },
    /*
     // 画轨迹，存在就更新、不存在画
     drawTrack: function (oData) {
     if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;
     var PhoneNum = oData.aoTrack[0].PhoneNum;
     var oLineLayer = this.findLayer(this._oLayerGroup, PhoneNum);
     var aoLatLng = oData.aoTrack.map(function (oItem) {
     return [oItem.Lat, oItem.Lng]
     })


     if (oLineLayer) {
     oLineLayer.setLatLngs(aoLatLng);
     }
     else {
     oLineLayer = L.polyline(aoLatLng, ES.TrackView.Config.oLiveLineConfig);
     oLineLayer.addTo(this._oLayerGroup);
     }
     },

     setTrackClass: function () {
     var oCkbStatus = this._oParent.getCkbStatus();
     if (!oCkbStatus) return;
     var aoLayer = this._oLayerGroup.getLayers();
     if (!aoLayer || aoLayer.length <= 0) return;

     for (var i = 0 ; i < aoLayer.length; i++) {
     if (oCkbStatus.bIsTrackLine) {
     L.DomUtil.removeClass(aoLayer[i]._path, 'ec-hide');
     }
     else {
     L.DomUtil.addClass(aoLayer[i]._path, 'ec-hide');
     }
     }
     },
     */
    drawTrack: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) {
            this.aoLatLng = [];
            return;
        }
        this.PhoneNum = oData.aoTrack[0].PhoneNum;

        this.aoLatLng = oData.aoTrack.map(function (oItem) {
            return [oItem.Lat, oItem.Lng]
        })
    },
    setTrackClass: function () {
        var oCkbStatus = this._oParent.getCkbStatus();
        if (!oCkbStatus) return;
        if (oCkbStatus.bIsTrackLine) {
            var oLineLayer = this.findLayer(this._oLayerGroup, this.PhoneNum);
            if (oLineLayer) {
                oLineLayer.setLatLngs(this.aoLatLng);
            }
            else {
                oLineLayer = L.polyline(this.aoLatLng, ES.TrackView.Config.oLiveLineConfig);
                oLineLayer.addTo(this._oLayerGroup);
            }
        } else {
            this.clearMap();
        }
    },

    //画线,传递经纬度数据
    drawLine: function (oData) {
        //this.reSizeMap();

        var oLineLayer = this.findLayer(this._oLayerGroup, oPosInfo.cDevId);
        if (!oLineLayer) {
            //创建线图层 fill-opacity
            oLineLayer = L.polyline(oPosInfo.aoLatLng, ES.TrackView.Config.oLiveLineConfig);
            oLineLayer.addTo(this._oLayerGroup);
            this._drawArrow(oPosInfo.aoLatLng);

            this.clearNullArrow(oPosInfo.cDevId);
        }
        else {
            oLineLayer.setLatLngs(oPosInfo.aoLatLng);
            this._drawArrow(oLineLayer.getLatLngs());
        }

        return oLineLayer;

    },


});