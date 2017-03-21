/**
 * Created by liulin on 2017/2/23.
 */

ES.TrackView.AlarmTrack = L.MapLib.MapMaster.MapOpr.extend({

    oOption: {
        trackConfig:{ color: 'orange',opacity: 1 },
    },

    initialize: function (oParent, oOption) {
        ES.MapOpr.prototype.initialize.call(this, oParent, oOption);
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.cUrl = this._oParent.getUrl("oTrackUrl");

        this.initLayer();
        this.initOn();
    },

    initLayer: function () {
        this._oAlarmLayerGroup = new L.featureGroup();
        this._oAlarmLayerGroup.addTo(this._oMap);
    },

    initOn: function () {
        this._oParent.on(this._oParent.getEvenName('localAlarmMarker'), this.getReqParam, this);
        this._oParent.on("ES.MapOpr.TrackView.TrackArrow: moveend", this.bringToTop, this);
        this._oParent.on("Track:Bar.dealAlarmMarkers", this.closeWindow, this);
    },

    //轨迹线置顶
    bringToTop: function () {
        if (!this._oAlarmLayerGroup) return;
        this._oAlarmLayerGroup.bringToFront();
    },

    //获取查询参数
    getReqParam: function (oData) {
        var oParam = this.getSearchTime(oData);

        if (!oParam) return false;

        this.oReqParam = {
            StartTime: "2000-01-01",
            EndTime: "2000-01-02",
            PhoneNum: m_PhoneNum,
            MinSpeed: this._oParent.getSearchSpeed(),
            PageSize: 800,
            PageIndex: 1,
        };

        ES.extend(this.oReqParam, oParam);
        this.getAlarmTrack()

    },

    //获取查询时间
    getSearchTime: function (oData) {

        var nBeginT = oData.oItem.AlarmStartTimeStamp * 1000;
        var nEndT = oData.oItem.LastUpdateTimeStamp * 1000;

        var cBeginData = ES.Util.dateFormat(nBeginT, "yyyy-MM-dd hh:mm:ss");
        var cEndDate = ES.Util.dateFormat(nEndT, "yyyy-MM-dd hh:mm:ss");

        var oParam = {
            nBeginT: nBeginT,
            nEndT: nEndT,
            EndTime: cEndDate,
            StartTime: cBeginData
        }
        return oParam;

    },

    //获取告警轨迹数据
    getAlarmTrack: function () {
        ES.getData(JSON.stringify(this.oReqParam), this.cUrl, this.fnCallBack, this);
    },

    //画告警轨迹线
    fnCallBack: function (oData) {
        this.clearMap();
        var aoLatLng = oData.DataList.map(function (oItem) {
            return [oItem.Lat, oItem.Lng]
        })
        var oLineLayer = L.polyline(aoLatLng, this.oOption.trackConfig);
        oLineLayer.addTo(this._oAlarmLayerGroup);
    },

    //关闭窗口时，清除告警线
    closeWindow: function (oData) {
        if (!oData.bIsDraw) {
            this.clearMap()
        }
    },

    clearMap: function () {
        this._oAlarmLayerGroup.clearLayers();
    },
})