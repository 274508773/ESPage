/**
 * 载重码表
 * Created by liulin on 2017/2/23.
 */

ES.VehTrackInfo.WeightChart = ES.VehTrackInfo.extend({
    oOption: {
        cDivContain: 'echartsWeight',
        nAvgSpeed: 60,
        nMaxSpeed: 100,
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        // 初始化界面
        this.initUI();
        //初始化事件监听
        this.initOn();

    },

    // 初始化图表
    initUI: function () {
        this.oChart = echarts.init(document.getElementById(this.oOption.cDivContain));
        this._setChartConfig();
    },
    initOn: function () {
        this._oParent.on("ES.MapOpr.TrackView.TrackPos:drawVecPos", this.callBack, this);

    },
    callBack: function (oData) {
        this.changeWeight(oData.oGpsInfo);

    },
    // 设置图表属性
    _setChartConfig: function (ec) {

        var nRedSpeed = this.oOption.nAvgSpeed / this.oOption.nMaxSpeed;

        this.oChartOption = {
            backgroundColor: '#136635',
            tooltip: {
                formatter: "{a} <br/>{c}"
            },
            grid: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0

            },
            series: [
                {
                    name: '载重',
                    type: 'gauge',
                    radius: '90%',
                    min: 0,
                    max: 30,
                    splitNumber: 5,
                    axisLine: {
                        lineStyle: {
                            width: 3,
                            color: [[0.1, '#fff'], [0.6, '#00ff00'], [0.8, '#f5c01b'], [1, '#b62d22']]
                        }
                    },
                    axisTick: {
                        length: 6,
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {
                        length: 9,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        formatter: '载重\n{value}', offsetCenter: [0, '45%'], textStyle: {
                            color: '#fff', fontSize: 12, fontWeight: 'bold'
                        },
                    },
                    data: [{ value: 0, name: '速度' }]
                }
            ]
        };
        this.oChart.setOption(this.oChartOption, true);


    },
    // 设置载重值
    changeWeight: function (oGpsInfo) {
        return;
        //if (!oGpsInfo) return;
        ////ES.TrackHelper.convertVehStatus(oGpsInfo);
        //var nMax = 100;
        //var dWeight = oGpsInfo.Weight || 0;
        //if ((oGpsInfo.nGreenOn + oGpsInfo.nRedOn + oGpsInfo.nYelloOn) != 1) {
        //    //此时为白灯
        //    nMax = dWeight * 100 / 5;
        //}
        //else if (oGpsInfo.nGreenOn == 1) {
        //    nMax = dWeight * 100 / 50;
        //}
        //else if (oGpsInfo.nYelloOn == 1) {
        //    nMax = dWeight * 100 / 70;
        //}
        //else {
        //    nMax = dWeight * 100 / 90;
        //}


        //this.oChartOption.series[0].max = nMax || 100;


        //this.oChartOption.series[0].data[0].value = oGpsInfo.Weight;
        //this.oChart.setOption(this.oChartOption, true);
    },

})