/**
 * Created by liulin on 2016/12/27.
 *
 *
 * 基础数据统计
 *
 */


ES.HGT.OverView.DataStaticChart = ES.HGT.OverView.BaseChart.extend({

    initialize: function (oPage, oOption) {

        ES.HGT.OverView.BaseChart.prototype.initialize.call(this, oPage, oOption);
    },

    setDefaultData: function () {
        this.aoDept = [];
        this.aoSite = [];
        this.aoTran = [];
        this.aoOperationVehicleCount = [];

        this.aoNoQualificationWorkSiteCount = [];
    },



    // 更新chart 图表数据
    updateChart: function (oTemp) {

        this._oParent.fire('DataStatic:loadData', {oData: oTemp});
        //OperationVehicleCount
        var aoDept = [], aoSite = [], aoTran = [],  aoOperationVehicleCount = [], aoNoQualificationWorkSiteCount = [];

        this.setStaticTime(oTemp);
        var oData = oTemp.aoRtn;

        for (var i = 0; i < oData.length; i++) {
            aoDept.push(oData[i].Name);
            aoSite.push(oData[i].SiteCnt);
            aoTran.push(oData[i].TransportCount);
            // 投入运营车辆
            aoOperationVehicleCount.push(oData[i].OperationVehicleCount);
            aoNoQualificationWorkSiteCount.push(oData[i].TempCnt);
        }

        this.aoDept.splice(0, this.aoDept.length);
        this.aoSite.splice(0, this.aoSite.length);
        this.aoTran.splice(0, this.aoTran.length);
        this.aoOperationVehicleCount.splice(0, this.aoOperationVehicleCount.length);
        this.aoNoQualificationWorkSiteCount.splice(0, this.aoNoQualificationWorkSiteCount.length);

        // 部门
        $.merge(this.aoDept, aoDept);
        // 核准工地数
        $.merge(this.aoSite, aoSite);
        // 车辆运输次数
        $.merge(this.aoTran, aoTran);
        // 投入运营车辆
        $.merge(this.aoOperationVehicleCount, aoOperationVehicleCount);

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
                data: ['在建工地数', '临时工地数', '投入运营车辆', '车辆运输次数']
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.aoDept,
                    axisLabel: {
                        interval: 0,
                        rotate: 75,
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '数量',
                    interval: 500,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '次数',
                    interval: 250,
                    axisLabel: {
                        formatter: '{value} 次'
                    }
                }
            ],
            series: [
                {
                    name: '在建工地数',
                    type: 'bar',
                    stack: '总量',
                    data: this.aoSite
                },
                {
                    name: '临时工地数',
                    type: 'bar',
                    stack: '总量',
                    data: this.aoNoQualificationWorkSiteCount
                },
                {
                    name: '投入运营车辆',
                    stack: '总量',
                    type: 'bar',
                    data: this.aoOperationVehicleCount
                },
                {
                    name: '车辆运输次数',
                    type: 'line',
                    yAxisIndex: 1,
                    data: this.aoTran
                }
            ]
        };

        this.oOpt = oOpt;
    },
});