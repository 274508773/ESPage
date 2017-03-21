/**
 * Created by liulin on 2016/12/27.
 *
 *
 * 工地出土立方
 *
 */

ES.HGT.OverView.CuteStaticChart = ES.HGT.OverView.BaseChart.extend({

    initialize: function (oPage, oOption) {

        ES.HGT.OverView.BaseChart.prototype.initialize.call(this, oPage, oOption);
    },

    setDefaultData: function () {
        this.aoDept = [];
        //this.aoSite = [];
        this.aoTran = [];
        //this.aoOperationVehicleCount = [];
        //this.aoNoQualificationWorkSiteCount = [];
    },


    // 添加监听
    initOn: function () {
        this._oParent.on('DataStatic:loadData', this.updateChart, this);
    },



    // 更新chart 图表数据
    updateChart: function (oTemp) {

        var oData = oTemp.oData.aoRtn;

        this.setStaticTime(oTemp.oData);

        var aoDept =[], aoTran =[];

        for(var i = 0;i<oData.length;i++ ) {
            aoDept.push(oData[i].Name);
            //aoSite.push(oData[i].WorkSiteCount);
            aoTran.push(oData[i].TransportCount * 11);
            //aoOperationVehicleCount.push(oData[i].aoOperationVehicleCount);
            //aoNoQualificationWorkSiteCount.push(oData[i].aoNoQualificationWorkSiteCount);
        }

        this.aoDept.splice(0, this.aoDept.length);
        //this.aoSite.splice(0, this.aoSite.length);
        this.aoTran.splice(0, this.aoTran.length);
        //this.aoOperationVehicleCount.splice(0, this.aoOperationVehicleCount.length);
        //this.aoNoQualificationWorkSiteCount.splice(0, this.aoNoQualificationWorkSiteCount.length);

        // 部门
        $.merge(this.aoDept, aoDept);
        // 核准工地数
        //$.merge(this.aoSite, aoSite);
        // 车辆运输次数
        $.merge(this.aoTran, aoTran);
        // 投入运营车辆
        //$.merge(this.aoOperationVehicleCount, aoOperationVehicleCount);
        // 临时工地
        //$.merge(this.aoNoQualificationWorkSiteCount, aoNoQualificationWorkSiteCount);


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
                data: ['出土立方']
            },
            xAxis: [
                {
                    type: 'category',
                    data:   this.aoDept,
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
                    //interval: 50,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '出土立方',
                    type: 'bar',
                    data: this.aoTran
                }
            ]
        };

        this.oOpt = oOpt;
    },
});