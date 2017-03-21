/**
 * Created by liulin on 2016/12/27.
 *
 * 工地违规趋势
 */


ES.HGT.OverView.AlarmStaticChart = ES.HGT.OverView.BaseChart.extend({

    initialize: function (oPage, oOption) {

        ES.HGT.OverView.BaseChart.prototype.initialize.call(this, oPage, oOption);
    },

    setDefaultData: function () {
        this.aoDept = [];
        this.aoWorkSiteCount = [];
        this.aoApprovedSiteCount = [];
        this.aoEarlyWorkSiteCount = [];
        this.aoExpiredWorkSiteCount = [];
        this.aoNoQualificationWorkSiteCount=[];
    },

    // 更新chart 图表数据
    updateChart: function (oData) {


        var aoDept =[],aoWorkSiteCount =[],aoApprovedSiteCount =[],aoEarlyWorkSiteCount=[],aoExpiredWorkSiteCount=[],aoNoQualificationWorkSiteCount=[] ;

        for(var i = 0;i<oData.length;i++ ){
            aoDept.push(oData[i].Name);
            aoWorkSiteCount.push(oData[i].WorkSiteCount);
            aoApprovedSiteCount.push(oData[i].ApprovedSiteCount);
            aoEarlyWorkSiteCount.push(oData[i].EarlyWorkSiteCount);
            aoExpiredWorkSiteCount.push(oData[i].ExpiredWorkSiteCount);
            aoNoQualificationWorkSiteCount.push(oData[i].NoQualificationWorkSiteCount);
        }

        this.aoDept.splice(0, this.aoDept.length);
        this.aoWorkSiteCount.splice(0, this.aoWorkSiteCount.length);
        this.aoApprovedSiteCount.splice(0, this.aoApprovedSiteCount.length);
        this.aoEarlyWorkSiteCount.splice(0, this.aoEarlyWorkSiteCount.length);
        this.aoExpiredWorkSiteCount.splice(0, this.aoExpiredWorkSiteCount.length);
        this.aoNoQualificationWorkSiteCount.splice(0, this.aoNoQualificationWorkSiteCount.length);

        // 部门
        $.merge(this.aoDept, aoDept);
        // 核准工地数
        $.merge(this.aoWorkSiteCount, aoWorkSiteCount);
        // 车辆运输次数
        $.merge(this.aoApprovedSiteCount, aoApprovedSiteCount);
        // 投入运营车辆
        $.merge(this.aoEarlyWorkSiteCount, aoEarlyWorkSiteCount);
        // 临时工地
        $.merge(this.aoExpiredWorkSiteCount, aoExpiredWorkSiteCount);
        // 临时工地
        $.merge(this.aoNoQualificationWorkSiteCount, aoNoQualificationWorkSiteCount);


        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['资质过期出土', '不按规定时间出土', '未经许可报备开工']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data:this.aoDept// ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '资质过期出土',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data: this.aoExpiredWorkSiteCount
                },
                {
                    name: '不按规定时间出土',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data: this.aoEarlyWorkSiteCount
                },
                {
                    name: '未经许可报备开工',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {normal: {}},
                    data: this.aoNoQualificationWorkSiteCount
                }
            ]
        };

        this.oOpt = oOpt;
    },
});