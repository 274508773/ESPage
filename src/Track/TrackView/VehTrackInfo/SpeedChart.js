/**
 * Created by liulin on 2017/2/23.
 */

ES.VehTrackInfo.SpeedChart = ES.VehTrackInfo.extend({
    oOption: {
        cDivContain: 'echartsSpeed',
        nAvgSpeed: 60,
        nMaxSpeed: 100,
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.oChart = null;
        this.oChartOption = null;

        this.initChart();
        //初始化事件监听
        this.initOn();

    },

    // 初始化图表
    initChart: function () {
        this.oChart = echarts.init(document.getElementById(this.oOption.cDivContain));
        this._setChartConfig();
    },

    // 监听事件
    initOn: function () {
        this._oParent.on("ES.MapOpr.TrackView.TrackPos:drawVecPos", this.callBack, this);

    },
    callBack: function (oData) {
        this.changeSpeed(oData.oGpsInfo);
    },

    // 设置图表属性
    _setChartConfig: function (ec) {

        var nRedSpeed = this.oOption.nAvgSpeed / this.oOption.nMaxSpeed;

        // 农机的样式设计
        this.oChartOption = {
            backgroundColor: '#b68500',
            tooltip: {
                formatter: "{a} <br/>{c}km/h"
            },
            grid: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0

            },
            series: [
                {
                    name: '速度',
                    type: 'gauge',
                    radius: '100%',
                    min: 0,
                    max: this.oOption.nMaxSpeed,
                    splitNumber: 11,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 10,
                            color: [[nRedSpeed, '#e2f4e0'], [1, '#ffc09d']]
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length: 15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
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
                        formatter: '速度\n{value}km/h', offsetCenter: [0, '45%'], textStyle: {
                            color: '#fff', fontSize: 16, fontWeight: 'bold'
                        }
                    },
                    data: [{ value: 80, name: '速度' }]
                }
            ]
        };

        // 渣土车样式设计
        this.oChartOption = {
            backgroundColor: '#136635',
            tooltip: {
                formatter: "{a} <br/>{c}km/h"
            },
            grid: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0

            },
            series: [
                {
                    name: '速度',
                    type: 'gauge',
                    radius: '90%',
                    min: 0,
                    max: this.oOption.nMaxSpeed,
                    splitNumber: 5,
                    axisLine: {
                        lineStyle: {
                            width: 3,
                            color: [[nRedSpeed, '#72d572'], [1, '#f4511e']]
                        }
                    },
                    axisTick: {
                        length: 6,
                        lineStyle: {
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
                        formatter: '速度\n{value}km/h', offsetCenter: [0, '45%'], textStyle: {
                            color: '#fff', fontSize: 12, fontWeight: 'bold'
                        }
                    },
                    data: [{ value: 0, name: '速度' }]
                }
            ]
        };

        this.oChart.setOption(this.oChartOption, true);
    },

    // 设置速度值
    changeSpeed: function (oGpsInfo) {
        this.oChartOption.series[0].data[0].value = oGpsInfo.Speed;
        this.oChart.setOption(this.oChartOption, true);
    },

    // 清空图表
    clearChart: function () {
        if (!this.oChart) return;
        this.oChart.clear();
    },

})