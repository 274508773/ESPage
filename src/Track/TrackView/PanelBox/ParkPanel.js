/**
 * Created by liulin on 2017/2/22.
 */
    // 停留面板操作,由于停留和行驶是同一个请求参数，所有这2个面板的初始化子同一个界面完成
ES.TrackView.PanelBox.ParkPanel = ES.TrackView.PanelBox.BasePanel.extend({

    oOption: {
        cParkDiv: "parkChartView",
        cRunDiv: "runChartsView",
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initOn();
    },

    // 点击查询
    initOn: function () {
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.initUI, this);

        //this._oParent.on("Track:Bar.drawParkMarkers", this.drawAllParkMarker, this);

        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    clearMap: function () {
        this.clearPark();
        this.clearRun();
        this.clearReport();
    },

    // 获得查询参数，如果获得成功返回true，否则返回false
    getReqParam: function () {
        var oParam = this._oParent.getSearchTime();
        if (!oParam) return false;
        this.oReqParam = {
            StartTime: "2000-01-01",
            EndTime: "2000-01-02",
            PhoneNum: m_PhoneNum,
            MinSpeed: this._oParent.getSearchSpeed(),
            PageSize: 100,
            PageIndex: 1,
        };
        ES.extend(this.oReqParam, oParam);
        return true;
    },

    // 设置界面
    initUI: function () {
        // 情况统计报表
        this.clearReport();
        if (!this.getReqParam()) return;
        if (!this._oParent.getUrl("oStatusUrl")) {
            return;
        }
        ES.getData(JSON.stringify(this.oReqParam), this._oParent.getUrl("oStatusUrl"), this.InitUIHandler, this);
    },

    getDefaultData: function () {
        return {
            "RetCode": 0,
            "RetMsg": "OK",
            "StartTime": '',
            "EndTime": '',
            "Data": {
                "RunTimeSec": 0,
                "Mileage": 0,
                "AverageSpeed": 0,
                "TraceCount": 0,
                "DataRange": [],
                "DataStop": [],
            }
        };
    },

    // 设置值
    InitUIHandler: function (oData) {
        // 请求的停留数据要做标记
        if (!oData || !oData.Data) return;
        for (var i = 0 ; i < oData.Data.DataStop.length; i++) {
            oData.Data.DataStop[i].nIndex = i;
        };

        // 设置数据
        this._oParent.fire(this._oParent.getEvenName("setParkData"), oData.Data);

        this.initDataPark(oData.Data);
        this.initDataRange(oData.Data);

        this.initReportUI(oData)
    },
})

// 停留处理
ES.TrackView.PanelBox.ParkPanel.include({

    clearPark: function () {
        $("#" + this.oOption.cParkDiv).empty();
    },

    //加载停留,数据要进行处理，方便定位
    initDataPark: function (oData) {
        var self = this;
        if (!oData || !oData.DataStop || oData.DataStop.length <= 0) return;
        var oLi = $("#" + this.oOption.cParkDiv).empty();

        for (var i = 0 ; i < oData.DataStop.length ; i++) {
            ES.Util.initTag(oLi, this.getParkConfig(oData.DataStop[i]));
            $("div.parkRecord[cId='" + oData.DataStop[i].nIndex + "']").data("oItem", { oItem: oData.DataStop[i] });
        }

        // 注册点击事件
        $(".parkRecord").bind("click", this, function (e) {
            var oItem = $(this).data('oItem');
            self._oParent.fire(self._oParent.getEvenName('localParkMarker'), oItem);

            $(this).siblings().removeClass("selected");
            $(this).addClass("selected");
        })

        //this.oParent.fire("TV:stopFinish");
    },

    // 初始化停留面板的值
    //停留告警设置
    getParkConfig: function (oItem) {
        var oDate = ES.TrackHelper.getTrackDateMsg((oItem.EndGps.GpsTime - oItem.StartGps.GpsTime) * 1000);
        oRunConfig = {
            div: {
                div: [
                    { class: 'travel-date', span: { html: oItem.StartGps.GpsDateTime.replace("T", " ") }, html: '停留记录' },
                    {
                        class: 'TrackPanel-mRow TrackPanel-hoverRow parkRecord',
                        cId: oItem.nIndex,
                        span: [{ class: 'TrackPanel-icon stay' },
                            { html: oItem.StartGps.GpsDateTime.replace("T", " ") + " 至 " + oItem.EndGps.GpsDateTime.replace("T", " ") },
                            { html: '  停留时长：' },
                            { class: 'TrackPanel-emOrStrongWithoutWeight', html: oDate.nTime + oDate.cMsg + " " },
                            { html: oItem.EndGps.PoiInfo }]
                    }]
            }
        }

        return oRunConfig;
    },

    // 画所有停留点


})

// 行程处理
ES.TrackView.PanelBox.ParkPanel.include({

    clearRun: function () {
        $("#" + this.oOption.cRunDiv).empty();
    },

    //加载行程
    initDataRange: function (oData) {

        if (!oData || !oData.DataRange || oData.DataRange.length <= 0) return;
        var oLiTrackTrip = $("#" + this.oOption.cRunDiv).empty();

        for (var i = 0 ; i < oData.DataRange.length ; i++) {
            ES.Util.initTag(oLiTrackTrip, this.getRunConfig(oData.DataRange[i].StartGps, oData.DataRange[i].EndGps));
        }
    },

    //行驶停留告警设置
    getRunConfig: function (oBItem, oEItem) {
        //设置时间格式
        var oDate = ES.TrackHelper.getTrackDateMsg((oEItem.GpsTime - oBItem.GpsTime) * 1000);
        var oRunConfig = {
            div: {
                div: [
                    { class: 'travel-date', span: { html: oBItem.GpsDateTime.replace("T", " ") }, html: '行程记录' },
                    {
                        div: {
                            class: 'travel-item',
                            div: [{
                                class: 'TrackPanel-mRow',
                                i: { class: 'glyphicon glyphicon-map-marker text-success' },
                                span: [{ html: oBItem.GpsDateTime.replace("T", " ") },
                                    { html: '从:' },
                                    { html: oBItem.PoiInfo }]
                            },
                                {
                                    class: 'TrackPanel-mRow',
                                    i: { class: 'glyphicon glyphicon-map-marker text-danger' },
                                    span: [{ class: 'js_endTime', html: oEItem.GpsDateTime.replace("T", " ") },
                                        { html: '到:' },
                                        { html: oEItem.PoiInfo }]
                                },
                                {
                                    table: {
                                        class: 'travel-item-table',
                                        tbody: {
                                            tr: {
                                                td: [
                                                    { html: '行驶里程' },
                                                    {
                                                        class: 'text-right TrackPanel-emOrStrongWithoutWeight',
                                                        cid: 'total_travelPeriod',
                                                        html: ((oEItem.Mileage - oBItem.Mileage) / 1000).toFixed(2)
                                                    }, { html: 'km' },
                                                    { html: '行驶时耗' },
                                                    {
                                                        class: 'text-right TrackPanel-emOrStrongWithoutWeight',
                                                        cid: 'total_travelPeriod',
                                                        html: oDate.nTime
                                                    }, { html: oDate.cMsg }
                                                ]
                                            }
                                        }

                                    }
                                }]
                        }
                    }],
            }
        }
        return oRunConfig;
    },

})

// 加载统计面板数据
ES.TrackView.PanelBox.ParkPanel.include({
    // 行驶时长,行驶里程,平均速度,轨迹点,开始时间,结束时间
    _oItem: {
        "total_travelPeriod": "nTime",
        "total_mileage": "dMileage",
        "total_avgSpeed": "AverageSpeed",
        "total_points": "TraceCount",
        "tdBeginDate": "StartTime",
        "tdEndDate": "EndTime",
        "travelPeriod_msg": 'cMsg',
    },

    // 清空界面
    clearReport: function () {
        for (var cKey in this._oItem) {
            $("#" + cKey).text("");
        }
    },

    // 初始化面板
    initReportUI: function (oData) {

        if (!oData || oData.RetMsg !== "OK" || !oData.Data) return;
        var oTemp = oData.Data;
        oTemp.dMileage = (oTemp.Mileage / 1000).toFixed(2);
        var oMsg = ES.TrackHelper.getTrackDateMsg(oTemp.RunTimeSec * 1000);

        // 还有和查询条件合并
        ES.Util.extend(oTemp, this.oReqParam, oMsg);
        for (var cKey in this._oItem) {
            $("#" + cKey).text(oTemp[this._oItem[cKey]]);
        }
    },

})