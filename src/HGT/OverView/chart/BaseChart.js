/**
 * Created by liulin on 2016/12/27.
 */

// 图表基础对象
ES.HGT.OverView.BaseChart = ES.Class.extend({

    oOption: {
        cDivId: 'eCharts_01',
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

    // 设置时间
    setStaticTime: function (oTemp) {
        var cText = $('#'+this.oOption.cDivId).parent().find('h3').text();

        $('#'+this.oOption.cDivId).parent().find('h3').html(cText+ES.template( '(统计时间:{cB}--{cE})',oTemp));
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