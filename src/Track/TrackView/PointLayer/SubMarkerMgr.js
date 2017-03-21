/**
 *
 * 每段轨迹线的点的处理方式，不同的地方是在一个图层里添加没有个分段点
 *
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PointLayer.SubMarkerMgr = ES.TrackView.PointLayer.BaseMarker.extend({

    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        //this._oParent.on(this._oParent.getEvenName("drawMarker"), this.drawMarker, this);
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.drawMarker, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.drawMarker, this);
        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    // 设置
    getIcon: function (oData) {
        var oIcon = L.divIcon({
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-page-marker"><div>' + oData.nPage + '</div></div>',
        });
        return oIcon
    },

    drawMarker: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;
        if (oData.nPage === oData.nTotalPage ) return;
        var oGpsInfo = oData.aoPageTrack[oData.aoPageTrack.length - 1];
        if (!oGpsInfo) return;

        var oLayer = this.findLayer(this._oMarkerGroup, oData.nPage);
        if (!oLayer) {
            oLayer = L.marker([oGpsInfo.Lat, oGpsInfo.Lng], { icon: this.getIcon(oData) });
            oLayer.addTo(this._oMarkerGroup);
        } else {
            // 更新位置信息
            oLayer.setLatLng([oGpsInfo.Lat, oGpsInfo.Lng]);
        }
    },

})