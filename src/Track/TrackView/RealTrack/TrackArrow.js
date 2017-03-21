/**
 * 画箭头 ， 在轨迹线上画箭头、画箭头
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.RealTrack.TrackArrow = ES.TrackView.RealTrack.BaseRealTrack.extend({

    oOption: {
        // 像素显示
        nLenPx: 20,

    },

    // 系统构造函数
    initialize: function (oParent, oOption) {
        ES.TrackView.RealTrack.BaseRealTrack.prototype.initialize.call(this, oParent, oOption);
        this._oParent = oParent;

        this.initOn();

        this.initGroup();

        this._reDrawArrow();
    },


    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.firstReqTrackBC, this);

        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.setTrackClass, this);

        this._oParent.on(this._oParent.getEvenName("setTrackClass"), this.setTrackClass, this);


    },

    // 画箭头
    firstReqTrackBC: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;
        if (!this._oLayerGroup) return;
        this.oTrackData = oData;
        this.clearMap();

        this._drawArrow(this.oTrackData);

        this.setTrackClass();
    },
    /*
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
    setTrackClass: function () {
        var oCkbStatus = this._oParent.getCkbStatus();
        if (!oCkbStatus) return;

        if (oCkbStatus.bIsTrackLine) {
            this._drawArrow(this.oTrackData);
        }
        else {
            this.clearMap();
        }

    },

    //画箭头，在线上画箭头
    //画箭头的思想
    //1.按照像素来画，相隔10个像素画一个箭头
    _drawArrow: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;

        this.aoTrack = oData.aoTrack;

        var PhoneNum = oData.aoTrack[0].PhoneNum;
        var oLineLayer = this.findLayer(this._oLineGroup, PhoneNum);

        var aoLatLng = oData.aoTrack.map(function (oItem) {
            return L.latLng(oItem.Lat, oItem.Lng);
        })

        //像素间隔
        var nZoom = this._oMap.getZoom();

        // 累计长度
        var nPlen = 0;
        // 判断是否画箭头
        var bDrawA = false;
        for (var i = 0; i < aoLatLng.length; i++) {
            if (i == (aoLatLng.length - 1)) break;
            var nBP = this._oMap.project(aoLatLng[i], nZoom);
            var nEp = this._oMap.project(aoLatLng[i + 1], nZoom);

            // 累计长度
            var nPlen = nPlen + nBP.distanceTo(nEp);

            // 分段长度
            var nPSub = nBP.distanceTo(nEp);

            if (bDrawA) {
                if (nPSub < 2) {
                    continue;
                }
                bDrawA = false;
                //当前i值必须画箭头
                //添加点，在中间
                var oMidLatLng = L.latLng({ lat: ((aoLatLng[i].lat + aoLatLng[i + 1].lat) / 2).toFixed(6), lng: ((aoLatLng[i].lng + aoLatLng[i + 1].lng) / 2).toFixed(6) });

                var aoTemp = [aoLatLng[i], oMidLatLng];
                var oTempConfig = {};
                ES.extend(oTempConfig, ES.TrackView.Config.oLiveLineConfig, { bEndArrow: true,weight:2 });
                var oPloyLine = L.polyline(aoTemp, oTempConfig);
                oPloyLine.addTo(this._oLayerGroup);
                oPloyLine.bringToFront();

                nPlen = 0;
                continue;
            }

            if (nPlen > this.oOption.nLenPx) {
                //下一个点画箭头
                bDrawA = true;
            }
        }

        this._oParent.fire(this._oParent.getEvenName("setToFront"));
    },


    // 清除非法箭头
    _reDrawArrow: function () {
        var self = this;
        this._oMap.on("moveend", function (e) {
            if (!self.aoTrack || !self._oLayerGroup) return;
            self._oLayerGroup.clearLayers();
            self._drawArrow({ aoTrack: self.aoTrack });
            $("path[d='M0 0'][marker-end='url(#arrow)']").remove();
            self.setTrackClass();
            self._oParent.fire("ES.MapOpr.TrackView.TrackArrow: moveend")
            self._oParent.fire(this._oParent.getEvenName("setToFront"));
        }, this)
    },

});
