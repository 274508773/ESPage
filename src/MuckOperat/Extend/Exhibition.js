/*

name:   Exhibition.js
des:    演示用的新页面

date:   2016-11-8
name:   liulin
     
*/

var m_cSignal = '';
var m_aoDeptId = [];
function getDistrictByCode() {

}
var m_nUserId = 0;
var m_nPlatId = 0;
var m_cDeptId = '';


 


ES.MuckOperat.Extend.Exhibition.Page = ES.Page.extend({
    // 整个页面显示的告警
    oAlarmClass: {
        2: 'a-speed',// '超速报警'
        203: 'a-uncover',//'未密闭'
        204: 'a-weight',//'超载'
        209: 'a-unload',//'可疑消纳'
        208: 'a-load',//可疑出土,
        210: 'a-speed'//非工作时间运输
    },

    getShowAlarm: function () {
        return this.oAlarmClass;
    },

    getTypeId: function () {
        var anId = [];
        for (var cKey in this.oAlarmClass) {
            anId.push(parseInt(cKey));
        }
        return anId;
    },

    // class 的对应关系，没有找到对应关系的用 420102 来代替
    getClassName: function (cKey) {
        var oParam = {
            // 黄陂
            420116: 1,
            // 新洲
            420117: 2,
            // 东西湖
            420112: 3,
            // 桥口
            420104: 4,
            // 江汉
            420103: 5,
            // 江岸
            420102: 6,
            //青山
            420107: 7,
            // 化工
            420121: 8,
            // 武昌
            420106: 9,
            // 洪山区
            420111: 10,
            // 汉阳区
            420105: 11,
            // 蔡甸区
            420114: 12,
            // 汉南区
            420113: 13,
            // 江夏
            420115: 14,
            //东湖高新区
            420118: 15,
            // 东湖风景区
            420120: 6,
        };
        var nVal = 6;
        if (oParam[cKey]) {
            nVal = oParam[cKey];
        }
        return nVal;
    },

});

// 表头数据
ES.MuckOperat.Extend.Exhibition.Header = ES.Class.extend({
    oOption: {
        cContain: 'div.ex-layout-exhibition-header>ul.ex-layout-exhibition-basecoder',
        cUrl: '/Extend/HeaderData',

    },

    // 初始化界面
    initialize: function (oPage, oOption) {
        ES.setOptions(this, oOption);
        this.aoLi = $(this.oOption.cContain).find('li');

        this._oParent = oPage;

        this.initUI();
    },

    // 界面实现
    initUI: function () {
        ES.loadAn(this.aoLi.parent());
        ES.getData({}, this.oOption.cUrl, this.dataHandler, this);
    },

    dataHandler: function (oData) {
        ES.removeAn(this.aoLi.parent());
        if (!oData) {
            return;
        }
        this.setText(1, oData.siteTotal);
        this.setText(2, oData.unloadTotal);
        this.setText(0, oData.vehTotal);
    },

    setText: function (nIndex, cVal) {
        var oEm = this.aoLi.eq(nIndex).find('span');

        oEm.html(cVal || '0');

    },
});

// 图表基础对象
ES.MuckOperat.Extend.Exhibition.BaseChart = ES.Class.extend({

    oOption: {
        cDivId: 'echartsBox1',
        cUrl: '/Extend/AlarmStatics',
    },

    initialize: function (oPage, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oPage;
        // 设置图表默认值
        this.setDefaultData();
        this.initOn();
        this.initChart();
        this.getData();
        this.onresize();
    },

    onresize: function () {
        var self = this;
        this._oParent.on('window.onresize', function () {
            self.oChart.resize();
        });
    },

    // 设置默认值
    setDefaultData: function () {

    },

    // 初始化图表
    initChart: function () {
        var oChart = echarts.init(document.getElementById(this.oOption.cDivId));
        this.oChart = oChart;
        this.getOption();
        oChart.setOption(this.oOpt);
    },

    // 添加监听
    initOn: function () {
        this._oParent.on('reflesh', this.getData, this);
    },

    getData: function () {
        if (!this.oOption.cUrl) {
            return;
        }

        ES.getData({}, this.oOption.cUrl, this.updateChart, this);
    },

    // 更新chart 图表数据
    updateChart: function (oData) {
        oData = {};
    },

    // 显示进度条
    showLoad: function () {
        this.oChart.showLoading();
    },
    // 隐藏进度条
    hideLoad: function () {
        this.oChart.hideLoading();
    },

    // 设置图表参数
    getOption: function () {

    },
});

// 告警车辆图表
ES.MuckOperat.Extend.Exhibition.AlarmStatics = ES.MuckOperat.Extend.Exhibition.BaseChart.extend({

    initialize: function (oPage, oOption) {
        oOption.cUrl = '/Extend/AlarmStatics';
        ES.MuckOperat.Extend.Exhibition.BaseChart.prototype.initialize.call(this, oPage, oOption);
    },

    setDefaultData: function () {
        this.aoData = [{ value: 0, name: ES.MuckOperat.Extend.Exhibition.Config.work },
            { value: 0, name: ES.MuckOperat.Extend.Exhibition.Config.illegal },
            { value: 0, name: ES.MuckOperat.Extend.Exhibition.Config.over },
            { value: 0, name: ES.MuckOperat.Extend.Exhibition.Config.speed },
            { value: 0, name: ES.MuckOperat.Extend.Exhibition.Config.weigh}
        ];
    },
      
    // 更新chart 图表数据
    updateChart: function (oData) {

        this.aoData.splice(0, this.aoData.length);
        $.merge(this.aoData,
            [{value: oData.nWorkCnt, name: ES.MuckOperat.Extend.Exhibition.Config.work},
                {value: oData.nAlarmCnt, name: ES.MuckOperat.Extend.Exhibition.Config.illegal},
                {value: oData.nNoCloseTotalCount, name: ES.MuckOperat.Extend.Exhibition.Config.over},
                {value: oData.nOverSpeedTotalCount, name: ES.MuckOperat.Extend.Exhibition.Config.speed},
                {value: oData.nOverLoadTotalCount, name: ES.MuckOperat.Extend.Exhibition.Config.weigh}]);

        // 广播接口数据给其他对象
        this._oParent.fire('DustStatics.setSiteCnt', {oData: oData});

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getOption: function () {
        //var aoName = this.aoData.map(function (oItem, nIndex) {
        //    return oItem.name;
        //});

        // 指定图表的配置项和数据
        var carOption = {
            tooltip: {
                trigger: 'axis',

                formatter: function (params) {
                    var res = params[0].data.name + ':' + params[0].data.value;
                    return res;
                }
            },

            backgroundColor: 'transparent',
            color: ['#5280d5', '#ddc02b', '#ed6d88'],
            legend: {
                left: 'right',
                textStyle: {
                    color: '#fff',
                    fontSize: 13
                },
                data: [ES.MuckOperat.Extend.Exhibition.Config.over, ES.MuckOperat.Extend.Exhibition.Config.speed]
            },
            grid: {
                left: 40,
                right: 150,
                top: 60,
                bottom: 50

            },
            xAxis: [
                {
                    type: 'category',
                    data: [ES.MuckOperat.Extend.Exhibition.Config.workShort, ES.MuckOperat.Extend.Exhibition.Config.illegalShort],
                    name: ES.MuckOperat.Extend.Exhibition.Config.alarm,
                    splitLine: {
                        show: false
                    },
                    nameTextStyle: {
                        color: '#fff'

                    },
                    axisLabel: {
                        'interval': 0,
                        rotate: 75,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: ES.MuckOperat.Extend.Exhibition.Config.unitVeh,
                    splitLine: {
                        show: false
                    },

                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            color: '#fff',
                            fontSize: 10
                        }
                    },
                    nameTextStyle: {
                        color: '#fff'
                    }
                }
            ],

            series: [
                {
                    type: 'bar',
                    name: ES.MuckOperat.Extend.Exhibition.Config.illegalStat,
                    barWidth: 30,
                    data: [
                        this.aoData[0],
                        this.aoData[1],
                    ],
                    label: {
                        normal: {
                            position: 'inside',
                            formatter: '{c}' + ES.MuckOperat.Extend.Exhibition.Config.unitVeh,
                            textStyle: {
                                color: '#fff',
                                fontSize: 18,
                                fontWeight: 'bold'
                            },
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                            smooth: 0,
                            length: 10,
                            length2: 20
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0.85
                        }
                    }
                }, {
                    type: 'pie',
                    name: ES.MuckOperat.Extend.Exhibition.Config.illegal,
                    radius: '42%',
                    center: ['77%', '50%'],
                    data: [
                        //{ value: 0, name: '投入运营车辆', label: { normal: { show: false } } },
                        this.aoData[2],
                        this.aoData[3],
                    ],
                    barWidth: 20,
                    // zlevel:99999,
                    label: {
                        normal: {
                            position: 'inside',
                            formatter: '{c}' + ES.MuckOperat.Extend.Exhibition.Config.unitVeh,
                            textStyle: {
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: 'bold'
                            },
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                            smooth: 0,
                            length: 10,
                            length2: 20
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0.85
                        }
                    }
                }

            ]
        };

        this.oOpt = carOption;
    },
});

// 各个区域运营车辆图表
ES.MuckOperat.Extend.Exhibition.VehStatics = ES.MuckOperat.Extend.Exhibition.BaseChart.extend({
    nCnt: 8,
    initialize: function (oPage, oOption) {
        oOption = oOption || {};
        oOption.cUrl = '/Extend/VehTransportStat';
        oOption.cDivId = 'echartsBox2';
        ES.MuckOperat.Extend.Exhibition.BaseChart.prototype.initialize.call(this, oPage, oOption);

    },

    setDefaultData: function () {
        //模拟参数
        this.aoData = [];
        this.aoTotal = [];
        this.RegionName = ES.MuckOperat.Extend.Exhibition.Config.RegionName;
        var nSum = 0;
        for (var i = 0; i <= 16; i++) {
            //k = 2 + i;
            this.aoData.push({name: this.RegionName[i], value: 0});
            //nSum = nSum + k;
        }
        this.aoTotal.push({name: ES.MuckOperat.Extend.Exhibition.work, value: nSum});
    },


    // 更新chart 图表数据
    updateChart: function (oData) {
        if (!oData || oData.length <= 0) {
            return;
        }
        this.RegionName.splice(0, this.RegionName.length);
        this.aoData.splice(0, this.aoData.length);
        this.aoTotal.splice(0, this.aoTotal.length);
        // 分回值求和 
        var nSum = 0;
        // 倒叙
        oData.sort(function (a, b) {
            return b.cnt - a.cnt;
        });
        var oTemp = {name: ES.MuckOperat.Extend.Exhibition.Config.other, value: 0};
        for (var i = 0; i < oData.length; i++) {
            nSum = nSum + oData[i].cnt;

            if (i >= this.nCnt) {
                oTemp.value = oTemp.value + oData[i].cnt;
                continue;
            }

            this.aoData.push({
                name: oData[i].Name.replace(ES.MuckOperat.Extend.Exhibition.Config.wuhan, '')
                    .replace(ES.MuckOperat.Extend.Exhibition.Config.donghu, ''),
                value: oData[i].cnt
            });
        }

        this.aoData.push(oTemp);


        this.aoTotal.push(nSum);
        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getOption: function () {

        // 指定图表的配置项和数据
        var carOption = {
            backgroundColor: 'transparent',
            color: ['transparent', '#1d2c51', '#ffd000', '#82040c', '#00e4ff', '#00036e', '#f000ff', '#d8ff00', '#ffcc00', '#a40000'],
            title: {
                text: ES.MuckOperat.Extend.Exhibition.Config.regionWork,
                left: 5,
                top: 5,
                textStyle: {
                    fontSize: 16,
                    color: '#fff'
                }
            },
            //radiusAxis: { nameGap: 15 },
            series: [
                {
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '55%'],
                    avoidLabelOverlap: false,
                    data: this.aoTotal,
                    label: {
                        normal: {
                            //position: 'inside',
                            formatter: '{c}',
                            textStyle: {
                                color: '#fff',
                                fontSize: 18,
                                fontWeight: 'bold'
                            },
                            position: 'center'
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0
                        }
                    }
                },
                {
                    type: 'pie',
                    radius: ['45%', '75%'],
                    center: ['50%', '55%'],
                    selectedOffset: 1,
                    avoidLabelOverlap: false,
                    data: this.aoData,
                    label: {
                        normal: {
                            position: 'outer',
                            formatter: '{b}:{c}',
                            textStyle: {
                                color: '#fff',
                                fontSize: 12,
                            },
                        }
                    },
                    itemStyle: {
                        normal: {
                            opacity: 0.5
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                            smooth: 0,
                            length: -10,
                            length2: -30
                        }
                    },

                }
            ]
        };

        this.oOpt = carOption;
    },
});

// 各个区域在线车辆图表
ES.MuckOperat.Extend.Exhibition.OnlineStatusStatics = ES.MuckOperat.Extend.Exhibition.BaseChart.extend({

    // 显示统计数据个数
    nCnt: 5,

    initialize: function (oPage, oOption) {
        oOption = oOption || {};
        oOption.cDivId = 'echartsBox3';
        oOption.cUrl = m_cSignal + '/api/device/GetDistrictRealGpsStatCount';
        ES.MuckOperat.Extend.Exhibition.BaseChart.prototype.initialize.call(this, oPage, oOption);

    },

    setDefaultData: function () {
        //模拟参数
        this.aoData = [];

        this.RegionName = ES.MuckOperat.Extend.Exhibition.Config.RegionName;
        //var nSum = 0;
        for (var i = 0; i <= 8; i++) {
            var k = 100 * (i + 1);
            this.aoData.push({name: this.RegionName[i], value: k});
        }

        this.aoData.sort(function (a, b) {
            return a.value - b.value;
        });
    },

    //获得区域数据
    getData: function () {

        if (!this.oOption.cUrl) {
            return;
        }

        var oParam = {DeptIds: m_aoDeptId, DistrictCode: '420000', WorkMode: 0, OilLine: 0};
        ES.getData(JSON.stringify(oParam), this.oOption.cUrl, this.updateChart, this);
    },


    // 更新chart 图表数据
    updateChart: function (oData) {
        //return;
        if (!oData || !oData.Data) {
            return;
        }
        this.aoData.splice(0, this.aoData.length);

        for (var cKey in oData.Data) {

            this.aoData.push({
                name: getDistrictByCode(cKey).replace(ES.MuckOperat.Extend.Exhibition.Config.wuhan, '')
                    .replace(ES.MuckOperat.Extend.Exhibition.Config.donghu, ''),
                value: oData.Data[cKey]
            });
        }

        this.aoData.sort(function (a, b) {
            return a.value - b.value;
        });


        var oOther = {name: ES.MuckOperat.Extend.Exhibition.Config.other, value: 0};
        for (var i = this.nCnt; i < this.aoData.length; i++) {
            oOther.value = oOther.value + this.aoData[i].value;
        }
        if (this.aoData.length > this.nCnt) {
            this.aoData.splice(0, this.aoData.length - this.nCnt);
        }

        this.aoData.push(oOther);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getOption: function () {
        var nOtherCnt = this.aoData[this.aoData.length - 1].value;
        this.aoData[this.aoData.length - 1].value = this.aoData[this.aoData.length - 2].value + 20;
        var nTemp = this.aoData[this.aoData.length - 1].value;
        // 指定图表的配置项和数据
        var carOption = {
            title: {
                text: ES.MuckOperat.Extend.Exhibition.Config.regionOnline,
                left: 5,
                top: 5,
                textStyle: {
                    fontSize: 16,
                    color: '#fff'
                }
            },
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series: [
                {
                    name: 'sourse',
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '55%'],
                    data: this.aoData,
                    roseType: 'angle',
                    label: {
                        normal: {
                            textStyle: {
                                color: '#fff'
                            },
                            formatter: function (a) {
                                if (a.data.value === nTemp) {
                                    return a.data.name + ':' + nOtherCnt;
                                }
                                else {
                                    return a.data.name + ':' + a.data.value;
                                }
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.5)'
                            },
                            smooth: 0,
                            length: -10,
                            length2: 5
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#c23531',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        this.oOpt = carOption;
    },

});

// 出土量的统计
ES.MuckOperat.Extend.Exhibition.CuteStatics = ES.MuckOperat.Extend.Exhibition.BaseChart.extend({

    initialize: function (oPage, oOption) {
        oOption = oOption || {};
        oOption.cDivId = 'echartsBox4';
        oOption.cUrl = '/Extend/getDayCute';
        ES.MuckOperat.Extend.Exhibition.BaseChart.prototype.initialize.call(this, oPage, oOption);
        this.oMuliData = null;
    },

    setDefaultData: function () {
        //模拟参数
        this.aoToday = [];
        this.aoYesDay = [];
        this.aoTodayTemp = [];
        this.aoYesDayTemp = [];
        this.RegionName = ES.MuckOperat.Extend.Exhibition.Config.RegionName;

        for (var i = 0; i <= 16; i++) {
            //var k = 2 + i;
            //var jj = k + 2;
            this.aoToday.push({name: this.RegionName[i], value: 0});
            this.aoYesDay.push({name: this.RegionName[i], value: 0});
        }
    },


    // 计算倍数，来确定数据大小 
    getMuli: function (nMaxToday, nMaxYesDay) {
        var nTM = 0;
        if (nMaxToday !== 0) {
            nTM = nMaxYesDay / nMaxToday;
        }
        var nYM = 0;
        if (nMaxYesDay !== 0) {
            nYM = nMaxToday / nMaxYesDay;
        }

        this.oMuliData = {nTM: nTM, nYM: nYM};

        return this.oMuliData;
    },

    // 更新chart 图表数据
    updateChart: function (oData) {
        if (!oData) {
            return;
        }
        this.RegionName.splice(0, this.RegionName.length);
        this.aoToday.splice(0, this.aoToday.length);
        this.aoYesDay.splice(0, this.aoYesDay.length);
        this.aoTodayTemp.splice(0, this.aoTodayTemp.length);
        this.aoYesDayTemp.splice(0, this.aoYesDayTemp.length);

        var nToday = 0;
        var nYesDay = 0;
        var nMaxToday = 0;
        var nMaxYesDay = 0;

        for (var i = 0; i < oData.length; i++) {
            this.RegionName.push(oData[i].cName);
            this.aoToday.push(oData[i].nCurTotal.toFixed(0));
            if (oData[i].nCurTotal > nMaxToday) {
                nMaxToday = oData[i].nCurTotal;
            }
            nToday = nToday + oData[i].nCurTotal;

            nYesDay = nYesDay + oData[i].nPreTotal;
            if (oData[i].nPreTotal > nMaxYesDay) {
                nMaxYesDay = oData[i].nPreTotal;
            }
            this.aoYesDay.push(oData[i].nPreTotal.toFixed(0));
        }

        this.getMuli(nMaxToday, nMaxYesDay);

        // 更新值
        if (this.oMuliData) {
            for (var j = 0; j < this.aoToday.length; j++) {
                if (this.oMuliData.nTM > 1) {
                    this.aoTodayTemp[j] = this.aoToday[j] * (this.oMuliData.nTM - 1).toFixed(0);
                    this.aoYesDayTemp[j] = this.aoYesDay[j];

                } else if (this.oMuliData.nYM > 1) {
                    this.aoTodayTemp[j] = this.aoToday[j];
                    this.aoYesDayTemp[j] = this.aoYesDay[j] * (this.oMuliData.nYM - 1).toFixed(0);
                }
                else {
                    this.aoYesDayTemp[j] = this.aoYesDay[j];
                    this.aoTodayTemp[j] = this.aoToday[j];
                }
            }
        }


        this._oParent.fire('DustStatics.setCuteCnt', {nToday: nToday, nYesDay: nYesDay});
        // 重新初始化结构
        this.getOption();
        this.oChart.setOption(this.oOpt, true);
    },

    getOption: function () {
        var self = this;
        // 指定图表的配置项和数据
        var carOption = {

            tooltip: {
                trigger: 'axis',

                formatter: function (params) {
                    var res = params[0].name + '<br/>';
                    for (var i = 0; i < self.RegionName.length; i++) {
                        if (params[0].name === self.RegionName[i]) {
                            if (params.length === 1) {
                                if (params[0].seriesName === ES.MuckOperat.Extend.Exhibition.Config.todayCute) {
                                    res += params[0].seriesName + '： ' + self.aoToday[i] + ES.MuckOperat.Extend.Exhibition.Config.unitCute;
                                }
                                else {
                                    res += params[0].seriesName + '： ' + self.aoYesDay[i] + ES.MuckOperat.Extend.Exhibition.Config.unitCute;
                                }
                            } else {
                                res += params[0].seriesName + '： ' + self.aoToday[i] + ES.MuckOperat.Extend.Exhibition.Config.unitCute + '<br/> ';

                                res += params[1].seriesName + '： ' + self.aoYesDay[i] + ES.MuckOperat.Extend.Exhibition.Config.unitCute;
                            }
                        }
                    }
                    return res;
                }
            },
            color: ['#659dff', '#09274c'],
            legend: {
                data: [ES.MuckOperat.Extend.Exhibition.Config.todayCute, ES.MuckOperat.Extend.Exhibition.Config.yesdayCute],
                left: 'left',
                textStyle: {
                    fontSize: 13,
                    color: '#fff'
                }

            },
            grid: {
                left: 65,
                right: 65,
                top: 65,
                bottom: 70

            },
            xAxis: [
                {
                    type: 'category',
                    data: this.RegionName,
                    name: ES.MuckOperat.Extend.Exhibition.Config.region,
                    splitLine: {
                        show: false
                    },
                    nameTextStyle: {
                        color: '#fff'

                    },
                    axisLabel: {
                        'interval': 0,
                        rotate: 75,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: ES.MuckOperat.Extend.Exhibition.Config.cute,
                    splitLine: {
                        show: false
                    },

                    axisLabel: {
                        formatter: '{value} ' + ES.MuckOperat.Extend.Exhibition.Config.unitCute,
                        textStyle: {
                            color: '#fff',
                            fontSize: 10
                        }
                    },
                    nameTextStyle: {
                        color: '#fff'

                    }
                }
            ],
            stack: true,
            series: [
                {
                    name: ES.MuckOperat.Extend.Exhibition.Config.todayCute,
                    type: 'bar',

                    data: this.aoTodayTemp,
                    label: {
                        normal: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                },
                {
                    name: ES.MuckOperat.Extend.Exhibition.Config.yesdayCute,
                    type: 'bar',
                    data: this.aoYesDayTemp,
                    label: {
                        normal: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                }
            ]
        };

        this.oOpt = carOption;
    },
});

// 各区出土趋势图 
ES.MuckOperat.Extend.Exhibition.RegionCuteStatics = ES.Class.extend({

    // api地址 
    oOption: {

        // 地图容器
        cContainerId: 'DustBoxMap',
        // 5秒钟切换一次播放
        nIntervalSpeed: 10 * 1000,
        // 请求的url
        cUrl: m_cSignal + '/api/chart/GetDistrictWorkSiteTrendStat',
        cDivTime: '.ex-layout-exhibition-right >.ex-layout-exhibition-dustbox >.ex-layout-exhibition-dustbox-time'
    },

    // 点信息html数据
    cPointSvg: '<div class="ex-svg-dots ex-poi-{nIndex}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.5 57.28">' +
    '<path d="M316.11,435.81l4.12-2.39V427.8h3v7.34l-5.61,3.25Zm4.12-27.59-4.83-2.8,1.49-2.58,6.32,3.65v5.71h-3v-4Zm-21.78-12.6L294.33,' +
    '398l-1.49-2.58,5.61-3.25,5,2.89L302,397.65ZM280.9,405.78l-4.22,2.44v4h-3V406.5l5.7-3.3Zm-4.22,27.64,3.51,2L278.71,' +
    '438l-5-2.89V427.8h3v5.62ZM298.46,446l4.22-2.44,1.48,2.58-5.7,3.3-6.32-3.65,1.48-2.58Z" transform="translate(-273.71 -392.18)" />' +
    '</svg><span>{cRegionName}</span></div>',

    // 运输线路信息
    cLineSvg: '<svg width="1000" height="2000" xmlns="http://www.w3.org/2000/svg"> ' +
    '<defs><linearGradient id="red_black" x1="0%" y1="0%" x2="0%" y2="100%">' +
    '<stop offset="0%" style="stop-color:rgb(142,120,0);stop-opacity:1"/>' +
    '<stop offset="100%" style="stop-color:rgb(255,216,0);stop-opacity:1"/></linearGradient>' +
    '<marker id="markerArrow" markerUnits="strokeWidth" markerWidth="6" markerHeight="6" refx="6" refy="6" viewBox="0 0 12 12" orient="auto">' +
    '<path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill: #ffd800;" /></marker></defs>' +
    '<text font-family="microsoft yahei" font-size="14" x="20" y="0" fill="#ffd800">' +
    ES.MuckOperat.Extend.Exhibition.Config.unitWork + '：{nTotalCube} ' + ES.MuckOperat.Extend.Exhibition.Config.unitCute +
    '<animateMotion path="M{nStartX},{nStartY} C{nSEToX},{nSSToY} {nSSToX},{nSEToY} {nEndX},{nEndY}' +
    'begin="0s" dur="3s" repeatCount="indefinite" /></text>' +
    '<path d="M{nStartX},{nStartY}' +
    ' C{nSEToX},{nSEToY} {nESToX},{nESToY} {nEndX},{nEndY}"' +
    ' fill="none" style="stroke-width: 6px;stroke:url(#red_black)"  marker-end="url(#markerArrow)"></path></svg>',

    initialize: function (oPage, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oPage;

        // 需要增加定时器来完成工作，来回播放一次请求的数据
        this.oTimer = new ES.MonitorTimer(this, {
            // 默认定时不打开
            bIsStart: false,
            // 定时器执行时间间隔
            nIntervalSpeed: this.oOption.nIntervalSpeed,
            // 执行回调函数
            aoActive: [{oContext: this, fnCallBack: this.tickCallBack}]
        });
        this.oContainer = $('#' + this.oOption.cContainerId);
        this.initOn();
        this.nCur = 0;
        this.aoData = [];
        this.getData();
    },

    // 添加监听
    initOn: function () {
        this._oParent.on('reflesh', this.getData, this);

    },

    setDefaultData: function () {
        //模拟参数
        this.aoData = [];

        this.RegionName = ES.MuckOperat.Extend.Exhibition.Config.RegionName;
        //var nSum = 0;
        for (var i = 0; i <= 8; i++) {
            var k = 100 * (i + 1);
            this.aoData.push({name: this.RegionName[i], value: k});
        }


        this.aoData.sort(function (a, b) {
            return a.value - b.value;
        });
    },

    //获得区域数据
    getData: function () {
        if (!this.oOption.cUrl) {
            return;
        }

        var nEndT = (new Date()).getTime();
        var nBeginT = nEndT - 12 * 60 * 60 * 1000;
        var cBeginData = ES.Util.dateFormat(nBeginT, 'yyyy-MM-dd hh:mm:ss');
        var cEndDate = ES.Util.dateFormat(nEndT, 'yyyy-MM-dd hh:mm:ss');

        $(this.oOption.cDivTime).html(ES.Util.dateFormat(nBeginT, 'hh:mm') + '-' + ES.Util.dateFormat(nEndT, 'hh:mm'));
        var oParam = {
            nType: 1,
            BeginTime: cBeginData,
            EndTime: cEndDate,
            PageIndex: 1,
            PageSize: '100'
        };

        ES.getData(JSON.stringify(oParam), this.oOption.cUrl, this.updateChart, this);
    },

    // 更新chart 图表数据
    updateChart: function (oData) {

        // 查询运输次数
        if (!oData || !oData.Data || oData.Data.length <= 0) {
            return;
        }

        this.oTimer.stop();
        this.aoData.splice(0, this.aoData.length);
        $.merge(this.aoData, oData.Data);
        this.filterData();
        this.nCur = 0;
        this.oTimer.start();
    },

    // 数据过滤
    filterData: function () {
        if (this.aoData.length <= 0) {
            return;
        }

        for (var i = this.aoData.length - 1; i >= 0; i--) {
            var cName = getDistrictByCode(this.aoData[i].UnloadSiteDistrictId);
            var cEName = getDistrictByCode(this.aoData[i].WorkSiteDistrictId);
            if (!cName || !cEName) {
                this.aoData.splice(i, 1);
            }
        }
    },

    // 定时切换数组数据
    tickCallBack: function () {
        this.oContainer.empty();
        var oItem = this.aoData[this.nCur];
        this.nCur = this.nCur + 1;
        if (this.nCur >= (this.aoData.length - 1)) {
            this.nCur = 0;
        }

        var oStart = {
            nIndex: this._oParent.getClassName(oItem.WorkSiteDistrictId),
            cRegionName: getDistrictByCode(oItem.WorkSiteDistrictId)
        };
        var oEnd = {
            nIndex: this._oParent.getClassName(oItem.UnloadSiteDistrictId),
            cRegionName: getDistrictByCode(oItem.UnloadSiteDistrictId)
        };
        // 开始计算加载区域信息
        var cHTML = ES.Util.template(this.cPointSvg, oStart);
        cHTML = cHTML + ES.Util.template(this.cPointSvg, oEnd);
        this.oContainer.append(cHTML);

        var nStartX = parseInt($('.ex-poi-' + oStart.nIndex).css('left')) + 22;
        var nStartY = parseInt($('.ex-poi-' + oStart.nIndex).css('top')) + 22;
        var nEndX = parseInt($('.ex-poi-' + oEnd.nIndex).css('left')) + 22;
        var nEndY = parseInt($('.ex-poi-' + oEnd.nIndex).css('top')) + 22;

        var nSSToX = nStartX - 50;
        var nSSToY = nStartY - 50;
        var nSEToX = nStartX + 50;
        var nSEToY = nStartY + 50;
        var nESToX = nEndX - 50;
        var nESToY = nEndY - 50;

        var oParam = {
            nTotalCube: oItem.TotalCube,
            nStartX: nStartX,
            nStartY: nStartY,
            nEndX: nEndX,
            nEndY: nEndY,
            nSSToX: nSSToX,
            nSSToY: nSSToY,
            nSEToX: nSEToX,
            nSEToY: nSEToY,
            nESToX: nESToX,
            nESToY: nESToY
        };
        // 开始添加线路信息
        cHTML = ES.Util.template(this.cLineSvg, oParam);

        this.oContainer.delay(1000).append(cHTML);
    },

});


// 接口的数据来源分别来源于其他接口
ES.MuckOperat.Extend.Exhibition.DustStatics = ES.Class.extend({

    oOption: {
        cContain: 'div.ex-layout-exhibition-dustdata>ul.ec-avg-sm-3',
        //cUrl: '/Extend/DustStatics',

    },

    // 初始化界面
    initialize: function (oPage, oOption) {
        ES.setOptions(this, oOption);
        this.$_aoLi = $(this.oOption.cContain).find('li');

        this._oParent = oPage;

        this.initUI();
        this._initOn();
    },

    _initOn: function () {
        // 设置今天出土工地
        this._oParent.on('DustStatics.setSiteCnt', this.setSiteCnt, this);

        this._oParent.on('DustStatics.setCuteCnt', this.setCuteCnt, this);
    },

    // 界面实现
    initUI: function () {

    },
     
    // 设置今日出土工地个数
    setSiteCnt: function (oTemp) {
        this.setText(0, oTemp.oData.nSiteCnt);
    },

    setCuteCnt: function (oData) {
        this.setText(1, oData.nToday);
        this.setText(2, oData.nYesDay);
    },

    setText: function (nIndex, cVal) {
        var $_oEm = this.$_aoLi.eq(nIndex).find('span');

        $_oEm.html(cVal || '0');

    },

});

// 地图对象设置,负责加载地图组件
ES.MuckOperat.Extend.Exhibition.Map = L.MapLib.MapMaster.Map.extend({

    //外部要重写此方法 当前html加载到页面中后触发
    loadMapMaster: function () {
        this.nMapWidth = $(window).width() - 240;
        this.nMapHeight = $(window).height();
        this._loadMap();
        // 初始化地图控件
        this.initOn();
    },

    // 设置地图监听
    initOn: function () {

        // 监听放大地图的宽度
        this._oParent.on('MapView:Map.inMap', this.inMap, this);

        // 监听缩小地图的宽度
        this._oParent.on('MapView:Map.outMap', this.outMap, this);

        //监听设置地图的高度
        this._oParent.on('MapView:Map.setMapConterH', this.setMapConterH, this);

        // 移动地图
        this._oParent.on('MapView:Map.flyTo', this.flyTo, this);

        //reflesh
        this._oParent.on('MapView:Map.reflesh', this.reflesh, this);

        this._oParent.on('MapView:Map.startRectBox', this.startRectBox, this);

        this._oMap.on('rectboxend', this.endRectBox, this);
        
    },

    // 设置地图高度
    setMapConterH: function (oData) {
        var self = this;
        this.$_oMapDiv.stop().animate({
            'height': $(window).height() - oData.nH + 'px',
        }, oData.nTick, self._oMap._onResize);

    },

    // 地图宽度展开
    inMap: function () {
        //var self = this;
        this.$_oMapDiv.stop().animate({
            'height': $(window).height() + 'px',
            'width': $(window).width() - 240 + 'px'
        }, 500);
         
    },

    //地图宽度缩小
    outMap: function () {
        //var self = this;
        this.$_oMapDiv.stop().animate({
            'height': $(window).height() + 'px',
            'width': $(window).width() - 320 + 'px'
        }, 500);
 
    },

    // 开启拉框模式
    startRectBox: function () {
        if (!this._oMap || !this._oMap.rectBox) {
            return;
        }

        // 开启拉框查询
        this._oMap.rectBox.enable();
    },

    // 结束拉框查询
    endRectBox: function (oData) {
        this._oMap.rectBox.disable();
        this._oParent.fire('MapView:RectSearch.setRectValue', oData);
    },

});


/*
    车辆订阅管理， 管理一辆、多辆车,继承订阅服务
    防止车里重复订阅

    管理告警订阅 ，告警订阅，不用管理，这个对象只负责代理管理，订阅告警的车辆不做内存管理

    多台 hub 的订阅告警 ，保存hub 车辆用数组
    订阅告警中心 不对告警数据管理，只负责对hubsvr 进行扩展
*/
ES.HubSvr.HubMange = ES.HubSvr.extend({

    // 保存订阅的车辆信息，字典的形式缓存
    _aoHubVeh: [],

    // 重新hub 服务监听
    initOn: function () {

        // 订阅单台车的GPS
        this._oParent.on('HubSvr:HubMange.addHub', this.addHub, this);

        // 移除单台车订阅Gps
        this._oParent.on('HubSvr:HubMange.removeHub', this.removeHub, this);

        // 提供单台车告警服务
        this._oParent.on('HubSvr:HubMange.addSingleAlarmHub', this.addSingleAlarmHub, this);

        // 移除单台车的告警
        this._oParent.on('HubSvr:HubMange.unSubSingleAlarmHub', this.unSubSingleAlarmHub, this);

        // 订阅告警，订阅所有车辆告警
        this._oParent.on('HubSvr:subAlarm', this.subAlarm, this);
    },

    // 订阅车辆，实时跟踪
    addHub: function (oData) {
        if (!oData || !oData.oGpsInfo) {
            console.log(ES.Lang.HubSvr.HubMange.addHub[1]);
            return;
        }
        // 添加订阅
        this.subGpsByGpsData(oData.oGpsInfo);
    },

    // 注销订阅车辆信息
    removeHub: function (oData) {

        if (!oData || oData.oGpsInfo) {
            return;
        }

        // 取消订阅
        this.unSubGpsByGpsData(oData.oGpsInfo);
        //this.subSingleAlarmByGpsData(oData.oGpsInfo); 
    },

    // 订阅单台车的车辆告警
    addSingleAlarmHub: function (oData) {
        if (!oData || !oData.oGpsInfo) {

            return;
        }

        this.subSingleAlarmByGpsData(oData.oGpsInfo);
    },

    unSubSingleAlarmHub: function (oData) {
        if (!oData || !oData.oGpsInfo) {

            return;
        }
        this.unSubSingleAlarmByGpsData(oData);
    },

    // 订阅的告警类型才能高发送告警数据
    subAlarmType: function () {

        var oParam = {
            UserId: m_nUserId,
            PlatId: m_nPlatId,
            Types: this._oParent.getTypeId()
        };
        var cParam = JSON.stringify(oParam);
        ES.getData(cParam, m_cSignal + '/api/UserAlarmSub/set', this.subAlarmTypeHandler, this);

    },

    // 订阅告警成功后进行处理
    subAlarmTypeHandler: function (oData) {
        //var oTemp = oData;
        if (!oData) {
            console.log('UserAlarmSub/set feil');
            return;
        }
        if (oData.RetCode !== 0) {
            console.log('UserAlarmSub/set feil,return RetCode=' + oData.RetCode);
            return;
        }
        console.log('UserAlarmSub/set secuss');
    }

});


//管理对象实时跟踪 
/*      
    缓存第一次添加的点数据，当监控大于设置的点时，删除正在的监控
    要用数组管理，不能用对象管理

    订阅 也在 liveMange 管理起来， 如果是告警订阅，直接订阅(告警订阅只能订阅单台车，所有不再队列中管理)
*/
ES.MuckOperat.Extend.Exhibition.LiveMange = ES.Class.extend({
    oOption: {
        MonitorCnt: 1,
    },
    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.initOn();
    },

    // 缓存车辆数据
    aoLivePos: null,

    initOn: function () {
        this._oParent.on('MapView:LiveMange.addLivePos', this.addLivePos, this);
        this._oParent.on('MapView:LiveMange.removePos', this.removePos, this);
        // hub 推送GPS数据 监听接口
        this._oParent.on('HubSvr:setGpsInfo', this.setGpsInfo, this);

    },

    // 是一个数组，分发数据到包
    setGpsInfo: function (oData) {
        var aoGpsInfo = oData.aoGpsInfo;
        // 监听轨迹数据
        if (!aoGpsInfo || aoGpsInfo.length <= 0) {
            return;
        }
        var self = this;
        $.each(aoGpsInfo, function (nIndex1, oGpsInfo) {
            var nIndex = ES.Util.arrayIndex(self.aoLivePos, oGpsInfo, 'PhoneNum');
            if (nIndex < 0) {

                return;
            }

            oGpsInfo.bOpenBubble = false;

            // 包装gpsdata
            ES.TrackHelper.convertVehStatus(oGpsInfo);

            // 画实时跟踪点
            self.aoLivePos[nIndex].drawLiveTrack({oGpsInfo: oGpsInfo});

            // 判断点是否在地图范围内，不在就飞行
            self.aoLivePos[nIndex].toPoint(oGpsInfo);
        });
    },

    // 添加实时跟踪 marker , 
    addLivePos: function (oData) {
        if (!oData || !oData.oGpsInfo) {
            return;
        }

        if (!this.aoLivePos) {
            this.aoLivePos = [];
        }

        //var oGpsInfo = oData.oGpsInfo;
        if (ES.Util.isInArray(this.aoLivePos, oData.oGpsInfo, 'PhoneNum')) {

            return;
        }

        // 要判断是否超出了监控设备个数，如果是，要移除最后一个元素
        if (this.aoLivePos.length >= this.oOption.MonitorCnt) {
            var oMapLiveTemp = this.aoLivePos.pop();
            this.removeMonitor(oMapLiveTemp);

            // 取消订阅这台车
            this._oParent.fire('HubSvr:HubMange.removeHub', { oGpsInfo: oMapLiveTemp.oOption });
        }

        var oMapLive = new ES.MuckOperat.Extend.Exhibition.MapLive(this._oParent, oData.oGpsInfo);
        this.aoLivePos.push(oMapLive);
        oData.oGpsInfo.bOpenBubble = false;
        oMapLive.drawLiveTrack(oData);

        oMapLive.flyTo(L.latLng(oData.oGpsInfo.Lat, oData.oGpsInfo.Lon));

    },

    // 移除监控
    removeMonitor: function (oMapLive) {
        if (!oMapLive) {
            return;
        }
        oMapLive.offEven();
        oMapLive.clearLiveTrack();
    },

    // 设备号 为唯一的判断
    removePos: function (oData) {
        if (!oData || !oData.oGpsInfo || !oData.oGpsInfo.hasOwnProperty('PhoneNum')) {
            return;
        }

        //var oGpsInfo = oData.oGpsInfo;
        var nIndex = ES.Util.arrayIndex(this.aoLivePos, oData.oGpsInfo, 'PhoneNum');
        if (nIndex === -1) {

            return;
        }
        var oMapLive = this.aoLivePos[nIndex];
        if (!oMapLive) {
            return;
        }
        this.removeMonitor(oMapLive);
        this.aoLivePos.splice(nIndex, 1);

  
    },

});

ES.MuckOperat.Extend.Exhibition.MapView = L.MapLib.MapMaster.MapOpr.extend({

    // 地图弹出的宽带设置
    oPopOption: {maxWidth: 400},

    // 注册弹出层事件
    _getVecMarkerHtml: function (oGpsInfo) {
        oGpsInfo = '';
        return '';
    },

    // 注册弹出层事件,弹出层绑定对象,每次不是最新oGpsInfo数据，不能用匿名的函数，需要注销
    initPopEven: function (oPopup) {

        var self = this;

        if (!oPopup) {
            return;
        }
        oPopup.self = this;
        oPopup.on('contentupdate', function () {
            // 车辆详情按钮
            var oBtnDetail = $('.leaflet-popup').find('i.ec-icon-truck').parent();

            // 车辆轨迹按钮
            var oBtnTrack = $('.leaflet-popup').find('i.ec-icon-exchange').parent();


            var oMeassageClick = $('.leaflet-popup').find('i.ec-icon-commenting').parent();

            var oGpsInfo = this.oGpsInfo;

            // 绑定事件
            oBtnDetail.bind('click', function () {

                // 显示详细数据
                self._oParent.fire('MapView:VehDetail.showDetail', {oGpsInfo: oGpsInfo});

                // 添加内存数据，并刷新 grid
                self._oParent.fire('MapView:TrackLst.addRow', {oGpsInfo: oGpsInfo});
                // 添加 hub 监听 
                self._oParent.fire('HubSvr:HubMange.addHub', {oGpsInfo: oGpsInfo});
                // 添加监听点
                //self._oParent.fire('MapView:LiveMange.addLivePos', { oGpsInfo: oGpsInfo });
                // 设置明细标准
                self._oParent.setDetailStatus(1);
            });

            oBtnTrack.bind('click', function () {
                self._oParent.fire('MapView:VehDetail.showTrack', {oGpsInfo: oGpsInfo});
                // 设置明细标准
                self._oParent.setDetailStatus(2);
            });

            //WQ
            oMeassageClick.bind('click', function () {
                //devcmd.sendMsg(oGpsInfo.VehicleNo, oGpsInfo.PhoneNum);

            });

            //设置状态
            self.setMobileInfo(oGpsInfo);

        }, oPopup);
    },

    // 设置车辆gps信息 和 网络信息 
    setMobileInfo: function (oGpsInfo) {
        //去掉on状态
        var $_oIMobile = $('.ex-icon-mobile');
        var $_oIBD = $('.ex-icon-bd');

        $_oIMobile.removeClass('on').removeClass('off');
        $_oIBD.removeClass('on').removeClass('off');

        //判断当前位置信息
        if (oGpsInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.travel ||
            oGpsInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.stop ||
            oGpsInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.cutoff) {
            $_oIMobile.addClass('on');
            $_oIBD.addClass('on');
        }
        else if (oGpsInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.disNet) {
            $_oIMobile.addClass('l-mobile-off');
            $_oIBD.addClass('l-bd-off');
        }
        else if (oGpsInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.disLocal) {
            $_oIMobile.addClass('on');
            $_oIBD.addClass('off');
        }
        else {
            $_oIMobile.addClass('off');
            $_oIBD.addClass('off');
        }
    },


    // 弹出车辆状态设置
    getVehStatusClass: function (oPosInfo) {

        var cClass = 'l-bd-off l-mobile-off';
        //判断当前位置信息
        if (oPosInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.travel ||
            oPosInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.stop ||
            oPosInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.cutoff) {
            cClass = 'l-bd-on l-mobile-on';

        }
        else if (oPosInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.disNet) {//通讯中断;定位失败
            cClass = 'l-bd-off l-mobile-off';
        }
        else if (oPosInfo.VehicleStatus === ES.MuckOperat.Extend.Exhibition.Config.disLocal) {
            cClass = 'l-bd-off l-mobile-on ';
        }
        return cClass;
    },

    // 设置车辆的角度
    _setHeading: function (oPosInfo, nInitDir) {
        if (!oPosInfo) {
            return;
        }
        if (!nInitDir) {
            nInitDir = 0;
        }
        var nDir = oPosInfo.Direction + nInitDir;
        $('div[cId="' + oPosInfo.PhoneNum + '"]').attr('style', 'transform: rotate(' +
            nDir + 'deg);-webkit-transform: rotate(' +
            nDir + 'deg);');
    },

    //判断是否应该画对象
    _isDrawLayer: function (oGpsInfo) {
        var aoLayer = this.findLayerInMap(oGpsInfo.cDevId);
        if (!aoLayer || aoLayer.length <= 0) {
            return true;
        }

        for (var i = 0; i < aoLayer.length; i++) {
            var oLayer = aoLayer[i];
            if (!oLayer || !oLayer.nW) {
                continue;
            }

            if (oGpsInfo.nW > oLayer.nW) {
                return false;
            }
        }
        return true;
    },


    // 获得实时跟踪点, 地图统计点数据
    _getPosIconInfo: function (oItem) {
        //var oClass = this.alarmToCls(oItem);

        var cHTML = '<div class="car_status">' +
            '<div class="car_tips">' +
            '    <span>{VehicleNo}</span>' +
            '    <em class="car_tips_arrow"></em>' +
            '</div>' +
            '<div class="car_body" cid="{PhoneNum}" style="transform: rotate({Direction}deg);-webkit-transform: rotate({Direction}deg)">' +
            '<em class="car_arrow"></em>' +
            '</div>' +
            '<i class="car_border">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.5 57.28">' +
            '    <path class="cls-1" d="M316.11,435.81l4.12-2.39V427.8h3v7.34l-5.61,3.25Zm4.12-27.59-4.83-2.8,' +
            '1.49-2.58,6.32,3.65v5.71h-3v-4Zm-21.78-12.6L294.33,398l-1.49-2.58,5.61-3.25,5,2.89L302,397.65ZM280.9,' +
            '405.78l-4.22,2.44v4h-3V406.5l5.7-3.3Zm-4.22,27.64,3.51,2L278.71,438l-5-2.89V427.8h3v5.62ZM298.46,' +
            '446l4.22-2.44,1.48,2.58-5.7,3.3-6.32-3.65,1.48-2.58Z" transform="translate(-273.71 -392.18)" />' +
            '</svg>' +
            '</i>' +
            '</div>';

        var cTemp = ES.Util.template(cHTML, oItem);
        return new L.DivIcon({
            html: cTemp,
            className: '',
            iconSize: L.point(20, 20),
            //popupAnchor: L.point(-0, -20),
        });
    },

    //GPSdata处理告警
    _getGpsDataIconInfo: function (oGpsInfo, oOption) {


        return new L.DivIcon({
            html: '<div cid="' + oGpsInfo.cDevId + '" class="car-body" ></div> <div class="' + oGpsInfo.cVehClass + '"></div>',
            className: 'ex-monitor-mapicon-car ' + this.getLightStatus(oGpsInfo),
            iconSize: L.point(oOption.nSize, oOption.nSize),
            popupAnchor: L.point(-0, -20),

        });
    },

    //根据告警类型，生成告警样式
    alarmToCls: function (oGpsInfo) {
        // 获得车辆的样式 和 车辆告警样式
        var oClass = {cAlarm: ''};
        //oClass.cLightStatus = 'green';
        // 车灯要修改
        if (!oGpsInfo) {
            return oClass;
        }

        if ((oGpsInfo.Status.FrontDoor && oGpsInfo.Speed > 0)) {
            oClass.cAlarm = 'car-state cover';
        }
        if (oGpsInfo.nRedOn === 1) {
            oClass.cAlarm = 'car-state';
        }
        if (oGpsInfo.Speed > 60) {
            oClass.cAlarm = 'car-state speed';
        }
        return oClass;
    },

    //告警判断,根据GPSdata判断当前告警
    gpsDataToCls: function (oGpsInfo) {
        if (!oGpsInfo) {
            return '';
        }
        if (!oGpsInfo.abShow) {
            return '';
        }
        if (oGpsInfo.cVehStatus === ES.MuckOperat.Extend.Exhibition.Config.disNet ||
            oGpsInfo.cVehStatus === ES.MuckOperat.Extend.Exhibition.Config.disLocal) {
            return '';
        }

        if (!oGpsInfo.abShow.bDoor && (oGpsInfo.bDoor && oGpsInfo.dSpeed > 0)) {
            return 'car-state cover';
        }
        if (!oGpsInfo.abShow.bOverWeight && oGpsInfo.nRedOn === 1) {
            return 'car-state';
        }
        if (!oGpsInfo.abShow.bOverSpeed && oGpsInfo.dSpeed > 50) {
            return 'car-state speed';
        }
        return '';
    },

    getAllAlarm: function (oGpsInfo) {
        var oAlarm = {};
        if (!oGpsInfo || oGpsInfo.dSpeed === undefined) {
            oAlarm.bSpeed = false;
        }
        else {
            if (oGpsInfo.dSpeed > 50) {
                oAlarm.bSpeed = true;
            } else {
                oAlarm.bSpeed = false;
            }
        }

        if (oGpsInfo.nRedOn === 1) {
            oAlarm.bRed = true;
        } else {
            oAlarm.bRed = false;
        }
        if (oGpsInfo.oStatus && oGpsInfo.oStatus.FrontDoor) {
            oAlarm.bDoor = true;
        }
        else {
            oAlarm.bDoor = false;
        }

        return oAlarm;
    },

    //获得顶灯的状态
    getLightStatus: function (oGpsInfo) {
        var cClass = '';
        if ((oGpsInfo.nGreenOn + oGpsInfo.nRedOn + oGpsInfo.nYelloOn) !== 1 ||
            oGpsInfo.cVehStatus === ES.MuckOperat.Extend.Exhibition.Config.disNet ||
            oGpsInfo.cVehStatus === ES.MuckOperat.Extend.Exhibition.Config.disLocal) {
            cClass += 'gray';
        }
        else if (oGpsInfo.nGreenOn === 1) {
            cClass += 'green';
        }
        else if (oGpsInfo.nRedOn === 1) {
            cClass += 'red';
        }
        else {
            cClass += 'yellow';
        }

        return cClass;
    },

});

/*
地图实际监控图标操作，只负责画实时点对象和图钉对象
实时跟踪tipmarker的处理思想：
公司相关信息缓存在图层中，如果切换了车辆信息，公司信息重新获取
*/
ES.MuckOperat.Extend.Exhibition.MapLive = ES.MuckOperat.Extend.Exhibition.MapView.extend({

    /*
     为构造函数
     @oParent 为父级页面对象
     @oOption 为参数，设置当前的参数
    */
    initialize: function (oParent, oOption, oMap) {

        ES.MapOpr.prototype.initialize.call(this, oParent, oOption, oMap);
        // 添加图层
        this._loadLayerGroup();

        // 注册监听事件
        this._initOn();

        this.PhoneNum = oOption.PhoneNum || '-1';
        this.cId = null;
    },

    // 初始化监听事件
    _initOn: function () {

        this._oMap.on('moveend', this._mapMoveHandler, this);

        // 画实时点
        this._oParent.on('MV:Real.drawLiveTrack', this.drawLiveTrack, this);

        // 判断是否显示弹出层
        this._oParent.on('MV:Real.showVecMarkerPop', this._showVecMarkerPop, this);

        // 放大实时监控点
        this._oParent.on('MV:Real.setLiveZoomIn', this.setLiveZoomIn, this);

        // 清除实时跟踪的点、历史点、轨迹线
        this._oParent.on('MV:Real.clearLiveTrack', this.clearLiveTrack, this);



    },

    // 关闭事件
    offEven: function () {
        this._oMap.off('moveend', this._mapMoveHandler, this);

        // 画实时点
        this._oParent.off('MV:Real.drawLiveTrack', this.drawLiveTrack, this);

        //解决聚合和实时同时存在问题
        this._oParent.off('MV:Real.unVisibleMarker');

        // 判断是否显示弹出层
        this._oParent.off('MV:Real.showVecMarkerPop', this._showVecMarkerPop, this);

        // 放大实时监控点
        this._oParent.off('MV:Real.setLiveZoomIn', this.setLiveZoomIn, this);

        // 清楚实时跟踪的点、历史点、轨迹线
        this._oParent.off('MV:Real.clearLiveTrack', this.clearLiveTrack, this);
    },

    //添加实时跟踪状态数据
    _loadLayerGroup: function () {

        //线路
        this._oLineGroup = L.featureGroup();
        this._oMap.addLayer(this._oLineGroup);

        //轨迹点
        this._oTrackGroup = L.featureGroup();
        this._oMap.addLayer(this._oTrackGroup);

        //实时跟踪点
        this._oLivePosGroup = L.featureGroup();
        this._oMap.addLayer(this._oLivePosGroup);
    },

    //判断弹出层是否应该弹出，如果地图为当前获得页，就弹出层，否则不弹出
    //对地图进行了放大缩小操作
    _showVecMarkerPop: function (oData) {
        if (!this._oLivePosGroup) {
            return;
        }
        var bActive = $('#Map').hasClass('active');

        var oGpsInfo = oData.oGpsInfo;
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (oGpsInfo.cDevId !== oLayer.cId) {
                oLayer.closePopup();
                return;
            }

            if (bActive) {
                this._oMap.setView(oLayer.getLatLng(), 17);
                if (oGpsInfo.bOpenBubble) {
                    oLayer.openPopup();
                } else {
                    oLayer.closePopup();
                }
            }
            else {
                oLayer.closePopup();
            }
        }, this);

    },

    //修改弹出层样式错误，
    _updateVecMarkerPop: function (oLivePosLayer, cHtml) {
        if (!oLivePosLayer) {
            return;
        }
        oLivePosLayer.setPopupContent(cHtml);
    },

    //画布,实时跟踪绘制，如线，轨迹点等，oPosInfo，为当前点信息
    _drawLiveHis: function (oPosInfo) {

        var oLatLng = L.latLng(oPosInfo.Lat, oPosInfo.Lon);

        var oPrePosInfo = null;
        var oLineLayer = this.findLayer(this._oLineGroup, oPosInfo.PhoneNum);
        if (!oLineLayer) {
            //创建线图层 
            var oPloyLine = L.polyline([oLatLng], ES.TrackView.Config.oLiveExhibitionLineConfig);
            oPloyLine.cId = oPosInfo.PhoneNum;
            oPloyLine.oPrePosInfo = oPosInfo;
            oPloyLine.addTo(this._oLineGroup);
        }
        else {
            oPrePosInfo = oLineLayer.oPrePosInfo;
            oLineLayer.oPrePosInfo = oPosInfo;
            oLineLayer.addLatLng(oLatLng);
        }

    },

    // 创建实时跟踪点
    _createLive: function (oPosInfo) {
        this._oParent.fire('MV:Real.unVisibleMarker', oPosInfo);
        this._oParent.fire('MapView:MapVehMark.updataMarker', oPosInfo);
        this.selectLi(oPosInfo);
        //this.cId = oPosInfo.PhoneNum
        var oLatLng = L.latLng(oPosInfo.Lat, oPosInfo.Lon);
        //创建当前点
        //添加点到点图层
        var oLayer = L.marker(oLatLng, {
            icon: this._getPosIconInfo(oPosInfo, {nSize: 30})
        });

        oLayer.cId = oPosInfo.PhoneNum;
        oLayer.cVehNo = oPosInfo.VehicleNo;
        oLayer.nW = 10;
        oLayer.oData = oPosInfo;
        //var oOption = L.extend({ radius: 100 },ES.TrackView.Config.oLiveCircleConfig);

        //把矢量点添加到地图上
        oLayer.addTo(this._oLivePosGroup);

        return oLayer;
    },

    // 在地图上绘制实时跟踪的点
    _drawLive: function (oPosInfo) {
        if (!this._oLivePosGroup) {
            return;
        }

        var oLayer = this.findLayer(this._oLivePosGroup, oPosInfo.PhoneNum);
        var oLatLng = L.latLng(oPosInfo.Lat, oPosInfo.Lon);
        //var cHtml = this._getVecMarkerHtml(oPosInfo);
        if (!oLayer) {
            this.clearLiveTrack();
            this.oLayer = oLayer = this._createLive(oPosInfo);
        }
        else {
            this._oParent.fire('MV:Real.unVisibleMarker', oPosInfo);
            this._oParent.fire('MapView:MapVehMark.updataMarker', oPosInfo);
            this.selectLi(oPosInfo);
            oLayer.setLatLng(oLatLng);
            if (oLayer.oCircle) {
                oLayer.oCircle.setLatLng(oLatLng);
            }
        }
        oLayer._bringToFront();
        this._setHeading(oPosInfo, 0);

        //删除实时车辆数据
        this._oParent.fire('MV:Real.clearVehicle', oPosInfo);

        return oLayer;
    },

    //WQ通过class获取li
    selectLi: function (oPosInfo) {
        var cId = oPosInfo.PhoneNum;
        var oLi = $('.ex-layout-carlist-content').find('li');
        for (var i = 0; i < oLi.length; i++) {
            var oLiData = $(oLi[i]).data('data');
            if (oLiData.PhoneNum === cId) {
                $(oLi[i]).removeData('data');
                $(oLi[i]).data('data', oPosInfo);
            }
        }
    },

    // 地图监控移动设置
    _mapMoveHandler: function () {
        if (!this._oLivePosGroup) {
            return;
        }
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (!oLayer._bringToFront) {
                return;
            }
            oLayer._bringToFront();

        }, this);
    },

    // 清除实时跟踪的点
    clearLiveTrack: function () {
        this._oLivePosGroup.clearLayers();
        this._oLineGroup.clearLayers();
        this._oTrackGroup.clearLayers();

        //如果字不为空，就返回
        if (!this.oLayer || !this.oLayer.oData) {
            return;
        }
        if (this.oLayer.oData.text) {
            return;
        }
        this._oParent.fire('MV:RegionDraw.addMarker', { oLayer: this.oLayer });
    },

    // 画实时跟踪轨迹数据
    drawLiveTrack: function (oData) {
        this._drawLiveHis(oData.oGpsInfo);
        this._drawLive(oData.oGpsInfo);
        this._oParent.fire('MV:Real.reComerVehMarker', oData.oGpsInfo);
    },

    // 放大地图,放大
    setLiveZoomIn: function () {

        var aoLayer = this._oLivePosGroup.getLayers();
        if (!aoLayer || aoLayer.length <= 0) {
            return;
        }
        if (!aoLayer[0].getLatLng) {
            return;
        }

        var oLatLng = aoLayer[0].getLatLng();

        var nMaxZoom = this._oMap.getMaxZoom();

        this._oMap.setView(oLatLng, nMaxZoom - 1);

    },


});

// grid 报警数据,处理意见是用数组加载所有数据
// 用队列的机制来做，新来的告警加入队列中
ES.MuckOperat.Extend.Exhibition.AlarmGridLst = ES.Class.extend({

    oOption: {
        cDivContain: 'ex-layout-exhibition-alert',

        // 最大显示车辆数
        nMaxCnt: 6,

        // 地图换车  30  秒
        nMaxHub: 30 * 1000,

        // 队列出队的最大判断时间
        nOutQeuen: 10 * 60 * 1000,

        // 显示每天数据的时间间隔
        nIntervalSpeed: 1 * 1000,

        cCurPosUrl: m_cSignal + '/api/location/GetCurPosByDevIdsExtend',
    },

    cHTMLTemp: '<dl class="flow in"><dd class="v_t_red">{cAlarmName}</dd>' +
    '<dd class="v_t_num">{VehicleNo}</dd>' +
    '<dd class="v_t_poi">{POI}</dd>' +
    '<dd class="v_t_timer">{cTime}</dd></dl>',


    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.oAlarmClass = this._oParent.getShowAlarm();
        // 当前游标处理
        this.nCur = 0;
        //订阅车辆时间/查询轨迹数据
        this.nLastTimeTick = 0;
        this._initOn();
        this._aoAlarm = [];

        this.oTimer = new ES.MonitorTimer(this, {
            nIntervalSpeed: this.oOption.nIntervalSpeed,
            aoActive: [{oContext: this, fnCallBack: this.showAlarm}]
        });
    },

    _initOn: function () {
        // 监听所有的告警消息
        this._oParent.on('HubSvr:setAllAlarmInfo', this.initUI, this);

    },

    //推送的数据，如队列
    initUI: function (oData) {
        if (!oData || !oData.aoAlarmInfo || oData.aoAlarmInfo.length <= 0) {
            return;
        }
        // 定时器暂停
        this.oTimer.stop();
        for (var i = 0; i < oData.aoAlarmInfo.length; i++) {
            if (!this.oAlarmClass[oData.aoAlarmInfo[i].AlarmType]) {
                continue;
            }
            this._aoAlarm.push(oData.aoAlarmInfo[i]);
        }
        // 定时器开始执行
        this.oTimer.start();
    },

    // 定时执行显示数据
    showAlarm: function () {
        // 监听数据
        var cDivContain = this.oOption.cDivContain;
        if (!this._aoAlarm || this._aoAlarm.length <= 0) {
            return;
        }
        var oItem = this._aoAlarm.pop();
        this.dealData(oItem);

        var cHTML = ES.Util.template(this.cHTMLTemp, oItem);
        $('.' + cDivContain).find('ul>li').eq(this.nCur).html(cHTML);
        this.nCur = this.nCur + 1;
        if (this.nCur >= this.oOption.nMaxCnt) {
            this.nCur = 0;
        }
        var nTick = (new Date()).getTime();
        // 如果告警小于 10 分钟，加入告警队列，循环显示
        if ((nTick - oItem.AlarmStartTimeStamp * 1000) < this.oOption.nOutQeuen) {
            this._aoAlarm.unshift(oItem);
        }

        // hub订阅，请求车辆当前位置，并在地图上绘制当前任务
        // 可疑换成
        this.subVeh(oItem);
    },

    // 订阅车辆GPS数据
    subVeh: function (oAlarm) {
        if (!oAlarm) {
            return;
        }

        oAlarm.nSwith = this.oOption.nMaxHub;
        // 换另外一辆车
        var nTick = 0;
        if (this.nLastTimeTick === 0) {
            this.nLastTimeTick = (new Date()).getTime();
            this._oParent.fire('TrackAnimation.getTrack', oAlarm);
            //ES.getData(oAlarm.PhoneNum, this.oOption.cCurPosUrl, this.subVehHandler, this, { oAlarmInfo: oAlarm });
            return;
        } else {
            nTick = (new Date()).getTime() - this.nLastTimeTick;
        }

        if (nTick <= this.oOption.nMaxHub) {
            return;
        }

        this.nLastTimeTick = (new Date()).getTime();
        this._oParent.fire('TrackAnimation.getTrack', oAlarm);

        //ES.getData(oAlarm.PhoneNum, this.oOption.cCurPosUrl, this.subVehHandler, this, { oAlarmInfo: oAlarm });
    },

    // 立马请求它的位置信息
    subVehHandler: function (oTemp) {
        if (!oTemp) {
            return;
        }

        if (!oTemp.oData || !oTemp.oData.DataList) {
            return;
        }

        ES.TrackHelper.convertVehStatus(oTemp.oData.DataList[0]);

        // 订阅单台车的GPS
        this._oParent.fire('HubSvr:HubMange.addHub', {oGpsInfo: oTemp.oData.DataList[0]});

        // 管理订阅车辆数据
        this._oParent.fire('MapView:LiveMange.addLivePos', {oGpsInfo: oTemp.oData.DataList[0]});

        this._oParent.fire('RealStatus.setGpsInfo', {oGpsInfo: oTemp.oData.DataList[0], oAlarmInfo: oTemp.oAlarmInfo});
    },

    dealData: function (oItem) {
        oItem.cAlarmName = ES.TrackHelper.getAlarmTypeName(oItem.AlarmType);
        oItem.cTime = ES.Util.dateFormat(oItem.AlarmStartTimeStamp * 1000, 'hh:mm:ss');
        return;
    },
});

// 明细数据显示，如车辆速度 位置 载重顶棚、违规次数
ES.MuckOperat.Extend.Exhibition.RealStatus = ES.Class.extend({

    // 设置明细信息
    oOption: {

        cTagAni: 'div.ex-layout-exhibition-mirror-tips.flip',

        // 告警名称
        cTagAlarmName: 'div.ex-layout-exhibition-mirror-tips > div.ex-layout-exhibition-m-alert-t > span',

        // 告警状态图表
        cTagAlarmImg: 'div.ex-layout-exhibition-mirror-tips > div.ex-layout-exhibition-m-car-t> div.ex-layout-exhibition-m-car-img',

        // 车牌号，定位时间
        cTagTitle: 'div.ex-layout-exhibition-mirror-tips> div.ex-layout-exhibition-info-t> div.title',

        // Gps 基本信息
        cTagGpsInfo: 'div.ex-layout-exhibition-mirror-tips>  div.ex-layout-exhibition-info-t > div.info',

        // Gps 的位置信息
        cTagPoiInfo: 'div.ex-layout-exhibition-mirror-tips>  div.ex-layout-exhibition-info-t > div.poi',

    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.oAlarmClass = this._oParent.getShowAlarm();

        //初始化事件监听
        this.initOn();

        $(this.oOption.cTagAni).animate({'bottom': '-100%'}, 100);

    },

    // 监听事件
    initOn: function () {
        this._oParent.on('RealStatus.setRealInfo', this.setRealInfo, this);

        this._oParent.on('HubSvr:setGpsInfo', this.setGpsInfo, this);
    },

    // 每次换车时切换
    setRealInfo: function (oData) {
        if (!oData || !oData.oGpsInfo) {
            return;
        }
        $(this.oOption.cTagAni).animate({'bottom': '-100%'}, 100);

        this.setGpsInfo(oData);
        this.setAlarmInfo(oData);

        $(this.oOption.cTagAni).animate({'bottom': '0'}, 500);
    },

    // 第一个，加载GPS状态
    setGpsInfo: function (oData) {
        if (!oData || !oData.aoGpsInfo) {
            return;
        }
        var oGpsInfo = oData.aoGpsInfo[0];
        $(this.oOption.cTagTitle).find('h3').html(oGpsInfo.VehicleNo);
        $(this.oOption.cTagTitle).find('.timer').html(ES.TrackHelper.getDateMsg(oGpsInfo.GpsTime * 1000));

        $(this.oOption.cTagGpsInfo).find('.speed>p>b').html(oGpsInfo.Speed);

        $(this.oOption.cTagGpsInfo).find('ul.data>li:eq(1)>span').html(' ' + oGpsInfo.Weight);
        $(this.oOption.cTagGpsInfo).find('ul.data>li:eq(2)>span').html(oGpsInfo.Status.FrontDoor ?
            ES.MuckOperat.Extend.Exhibition.Config.overShort : ES.MuckOperat.Extend.Exhibition.Config.unOver);

        $(this.oOption.cTagGpsInfo).find('ul.data>li:eq(0)>span').html(oGpsInfo.VehicleStatus);
        $(this.oOption.cTagPoiInfo).html(oGpsInfo.PoiInfo);

    },

    // 设置告警明细信息
    setAlarmInfo: function (oData) {
        if (!oData || !oData.oAlarmInfo) {
            return;
        }

        var oAlarmInfo = oData.oAlarmInfo;

        $(this.oOption.cTagAlarmName).html(oAlarmInfo.cAlarmName);

        for (var cKey in this.oAlarmClass) {
            $(this.oOption.cTagAlarmImg).removeClass(this.oAlarmClass[cKey]);
        }

        $(this.oOption.cTagAlarmImg).addClass(this.oAlarmClass[oAlarmInfo.AlarmType] || 'a-speed');
    },


});

// 做模拟推送数据，查询历史轨迹数据，然后轨迹定时播放
ES.MuckOperat.Extend.Exhibition.TrackAnimation = ES.Class.extend({

    //1.查询轨迹数据，大于0 的轨迹数据，没有找到就画当前点
    //2.查询到轨迹数据后，定时触发轨迹播放
    //3.播放30秒钟后，切换到下一辆车播放轨迹，下一辆车如何查找
    oOption: {
        nIntervalSpeed: 0.5 * 1000,

        cUrl: m_cSignal + '/api/location/GetHisLoc',
        // 最大轨迹条数
        nMaxTrackCnt: 30,
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        // 轨迹游标
        this._nCur = 0;

        //this.oAlarmClass = this._oParent.getShowAlarm();
        this.oTimer = new ES.MonitorTimer(this, {
            // 默认定时不打开
            bIsStart: false,
            // 定时器执行时间间隔
            nIntervalSpeed: this.oOption.nIntervalSpeed,
            // 执行回调函数
            aoActive: [{oContext: this, fnCallBack: this.tickCallBack}]
        });

        //初始化事件监听
        this.initOn();

    },

    // 获得查询参数，如果获得成功返回true，否则返回false
    getReqParam: function (oData) {

        var nEndT = (new Date()).getTime();
        var nBeginT = nEndT - 1 * 60 * 60 * 1000;
        var cBeginData = ES.Util.dateFormat(nBeginT, 'yyyy-MM-dd hh:mm:ss');
        var cEndDate = ES.Util.dateFormat(nEndT, 'yyyy-MM-dd hh:mm:ss');

        var oReqParam = {
            StartTime: cBeginData,
            EndTime: cEndDate,
            PhoneNum: oData.PhoneNum,
            MinSpeed: 0,
            PageSize: 10000,
            PageIndex: 1,
        };
        return oReqParam;
    },

    // 获得车辆的轨迹数据
    getTrack: function (oData) {
        if (!oData) {
            return;
        }
        this.oOption.nMaxTrackCnt = oData.nSwith / this.oOption.nIntervalSpeed;
        var oReqParam = this.getReqParam(oData);
        ES.getData(JSON.stringify(oReqParam), this.oOption.cUrl, this.getTrackHandler, this, oData);

    },

    getTrackHandler: function (oTemp) {
        var oData = oTemp.oData;
        if (!oData || oData.DataList.length <= 0) {
            return;
        }
        this.aoTrack = oData.DataList;
        // nMaxTrackCnt, 播放最近的轨迹30条
        if (this.aoTrack.length <= this.oOption.nMaxTrackCnt) {
            this._nCur = 0;
        }
        else {
            this._nCur = this.aoTrack.length - this.oOption.nMaxTrackCnt;
        }

        // 添加监控，添加播放轨迹
        this._oParent.fire('MapView:LiveMange.addLivePos', {oGpsInfo: this.aoTrack[this._nCur]});

        this._oParent.fire('RealStatus.setRealInfo', {oGpsInfo: this.aoTrack[this._nCur], oAlarmInfo: oTemp});

        // 定时器重新开始工作
        this.oTimer.restart();
    },

    // 定时器回调函数，推送轨迹
    tickCallBack: function () {
        if (!this.aoTrack || this.aoTrack.length <= 0) {
            return;
        }

        // 开始发送轨迹
        this._oParent.fire('HubSvr:setGpsInfo', {aoGpsInfo: [this.aoTrack[this._nCur]]});
        //this._oParent.on('HubSvr:setGpsInfo', this.setGpsInfo, this);
        if (this._nCur < this.aoTrack.length - 1) {
            this._nCur = this._nCur + 1;
        }

    },


    // 监听事件
    initOn: function () {

        this._oParent.on('TrackAnimation.getTrack', this.getTrack, this);

        //this._oParent.on('HubSvr:setGpsInfo', this.setGpsInfo, this);
    },

});



// 开始执行的地方
$(function () {

    // 1.负责通信
    var oPage = new ES.MuckOperat.Extend.Exhibition.Page();

    // 2.表头数据
    var oObj = new ES.MuckOperat.Extend.Exhibition.Header(oPage, {});

    // 3.各个区域运营车辆图表
    oObj = new ES.MuckOperat.Extend.Exhibition.VehStatics(oPage, {});

    // 4.在线车辆图表
    oObj = new ES.MuckOperat.Extend.Exhibition.OnlineStatusStatics(oPage, {});

    // 5.告警车辆图表
    oObj = new ES.MuckOperat.Extend.Exhibition.AlarmStatics(oPage, {});

    // 6.出土统计图表
    oObj = new ES.MuckOperat.Extend.Exhibition.CuteStatics(oPage, {});

    // 7.统计当日出土车辆，出土量、昨天出土量
    oObj = new ES.MuckOperat.Extend.Exhibition.DustStatics(oPage, {});

    //-------------------------地图相关操作---------------------------

    // 8.hub 订阅管理
    var oHub = new ES.HubSvr.HubMange(oPage, {cHubUrl: m_cSignal + '/signalr'});

    // 9.订阅所有的告警
    oHub.subAlarm({nUserId: m_nUserId, nPlatId: m_nPlatId, nDeptId: m_cDeptId});
    oHub.subAlarmType();

    // 10.管理实时跟踪的点;nMonitorCnt 监控车辆的数量
    oObj = new ES.MuckOperat.Extend.Exhibition.LiveMange(oPage, {});

    // 11.地图控件
    var oMap = new ES.MuckOperat.Extend.Exhibition.Map(oPage, {
        cDidId: 'MapView',
        nDefaultTile: 12,
    });

    // 加载地图控件
    oMap.loadCtrl();

    // 12.告警列表
    oObj = new ES.MuckOperat.Extend.Exhibition.AlarmGridLst(oPage, {});

    // 13.车辆实时状态
    oObj = new ES.MuckOperat.Extend.Exhibition.RealStatus(oPage, {});

    // 14.模拟轨迹推送
    oObj = new ES.MuckOperat.Extend.Exhibition.TrackAnimation(oPage, {});

    // 15.区域统计报表
    oObj = new ES.MuckOperat.Extend.Exhibition.RegionCuteStatics(oPage, {});

    // 16.刷新数据
    var oTimer = new ES.MonitorTimer(oPage, {nIntervalSpeed: 1 * 60 * 1000});

    oTimer.on({
        fnCallBack: function () {
            oPage.fire('reflesh');
        },
        oContext: oPage
    });

    $('a.basecoder-reflesh').bind('click', function () {
        oPage.fire('reflesh');
    });


});
