/**
 * 对图表的操作，如速度图表、密闭图表、载重图表
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PanelBox.SpeedDoorWeightPanel = ES.TrackView.PanelBox.BasePanel.extend({
    aoTrack:[],
    oOption: {
        cDivDoor: "divDoorChart",
        cDivSpeedWeight: 'divSpeedWeightChart'
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initOn();
    },

    // 点击查询
    initOn: function () {
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.initUI, this);

        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.refreshUI, this);

        //this._oParent.on("Track:Bar.drawParkMarkers", this.refreshUI, this);

        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    // 清除图表
    clearMap: function () {
        if (!this.aoTrack) {
            this.aoTrack.splice(0, this.aoTrack.length);
        }
        var oTemp = { acTime: [], adSpeed: [], adWeight: [], adDoor: [] };
        var oOption = this.getSpeedWeightChartOption(oTemp);
        if (this.oChart)
            this.oChart.setOption(oOption, true);
        oOption = this.getDoorChartOption(oTemp);
        if (this.oDoorChart)
            this.oDoorChart.setOption(oOption, true);
    },

    // 设置界面
    initUI: function (oData) {
        this.aoTrack.splice(0, this.aoTrack.length);
        $.merge(this.aoTrack, oData.aoPageTrack);
        var oData = this.dataConvert();

        // 创建第一个图表
        var oOption = this.getSpeedWeightChartOption(oData);

        this.oChart = echarts.init(document.getElementById(this.oOption.cDivSpeedWeight));
        this.oChart.setOption(oOption, true);

        this.oDoorChart = echarts.init(document.getElementById(this.oOption.cDivDoor));
        var oOption = this.getDoorChartOption(oData);
        this.oDoorChart.setOption(oOption, true);
        echarts.connect([this.oDoorChart, this.oChart]);
        //this.oChart.connect([this.oDoorChart]);
        //this.oDoorChart.connect([this.oChart]);
    },

    refreshUI: function (oData) {
        $.merge(this.aoTrack, oData.aoPageTrack);

        // 刷新图表数据
        var oData = this.dataConvert();

        // 创建第一个图表
        var oOption = this.getSpeedWeightChartOption(oData);

        this.oChart = echarts.init(document.getElementById(this.oOption.cDivSpeedWeight));
        this.oChart.setOption(oOption, true);

        this.oDoorChart = echarts.init(document.getElementById(this.oOption.cDivDoor));
        var oOption = this.getDoorChartOption(oData);
        this.oDoorChart.setOption(oOption, true);
        echarts.connect([this.oDoorChart, this.oChart]);
    },

    // 获得速度、载重 的配置
    getSpeedWeightChartOption: function (oDataTemp) {
        var oOption = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params.length) {
                        var res = params[0].name + '<br/>'
                        res += params[1].seriesName + '： ' + params[1].value + '<br/>';
                        res += params[0].seriesName + '： ' + params[0].value + ' Km/h<br/> ';
                        return res;
                    }
                }
            },
            calculable: true,
            dataZoom: {
                show: false,
                realtime: true,
                start: 0,
                end: 100
            },
            legend: {
                selected: {
                    '速度': true,
                    '载重': true
                },
                data: ['速度', '载重']
            },
            smooth: true,
            grid: {
                x: "18%",
                y: "35%",
                x2: "13%",
                y2: "5%"
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,

                    data: oDataTemp.acTime.length == 0 ? ['2015-01-01'] : oDataTemp.acTime
                }
            ],
            yAxis: [
                {
                    name: '速度',
                    type: 'value',
                    boundaryGap: false,
                    axisLabel: {
                        formatter: '{value}'
                    },

                },
                {
                    name: '载重',
                    type: 'value',
                    boundaryGap: false,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '速度',
                    type: 'line',
                    data: oDataTemp.adSpeed.length == 0 ? [0] : oDataTemp.adSpeed,
                    itemStyle: { normal: { color: 'green', lineStyle: { color: 'green' } } },
                },
                {
                    name: '载重',
                    type: 'line',
                    yAxisIndex: 1,
                    data: oDataTemp.adWeight.length == 0 ? [0] : oDataTemp.adWeight,
                    stack: '载重',
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值', itemStyle: { normal: { color: '#b62d22' } }, },
                            { type: 'min', name: '最小值', itemStyle: { normal: { color: '#3c924c' } }, }
                        ],
                    },
                    itemStyle: { normal: { color: '#f60', lineStyle: { color: '#f60' } } },
                }
            ]
        }
        return oOption;
    },

    //时间速度设置,数据转换工具，转换个数为{时间：[]，速度：[]}
    dataConvert: function () {
        if (!this.aoTrack || this.aoTrack.length <= 0) return { acTime: [], adSpeed: [], adWeight: [], adDoor:[]};
        // gps 时间
        var acGPSDate = [];
        // 门磁
        var adDoor = [];
        // 速度
        var adSpeed = [];
        // 重量
        var adWeight = [];
        for (var i = 0 ; i < this.aoTrack.length ; i++) {
            acGPSDate.push(ES.Util.dateFormat(this.aoTrack[i].GpsTime * 1000, 'yyyy-MM-dd hh:mm:ss'));
            adDoor.push((this.aoTrack[i].FrontDoor ? 1 : 0));
            adSpeed.push(this.aoTrack[i].Speed);
            adWeight.push(this.aoTrack[i].Weight);
        }

        return { acTime: acGPSDate, adSpeed: adSpeed, adWeight: adWeight, adDoor: adDoor };
    },

    getDoorChartOption: function (oDataTemp) {
        var option = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var res = params[0].name + '<br/> ';
                    res += params[0].seriesName + ' ' + (params[0].value == 1 ? "未密闭" : "密闭") + '<br/> ';
                    return res;
                }
            },
            calculable: true,
            dataZoom: {
                show: true,
                realtime: true,
                start: 0,
                end: 100
            },
            smooth: true,
            grid: {
                x: "18%",
                y: "15%",
                x2: "13%",
                y2: "43%"
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,

                data: oDataTemp.acTime.length == 0 ? ['2015-01-01'] : oDataTemp.acTime
            },
            yAxis: {
                type: 'value',
                //boundaryGap: [0, 1, 2, 3],
                axisLabel: {
                    formatter: function (params) {
                        if (params == 0) {
                            return "密闭";
                        }
                        else if (params == 1) {
                            return "未密闭";
                        }
                        else {
                            return "";
                        }

                    }
                },
                max: 1,
                min: 0,
            },
            series: {
                name: '顶棚：',
                type: 'line',
                data: oDataTemp.adSpeed.length == 0 ? [0] : oDataTemp.adDoor
            }
        }

        return option;
    },

});