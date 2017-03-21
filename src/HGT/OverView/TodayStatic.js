/**
 * Created by liulin on 2016/12/27.
 */


ES.HGT.OverView.TodayStatic = ES.HGT.OverView.Header.extend({

    // 设置时间
    setStaticTime: function (oTemp) {
         $('.today-static').html(ES.template( '统计时间:{cB}--{cE}',oTemp));

    },

    dataHandler: function (oData) {
        ES.removeAn(this.$_oContainer);
        if (!oData) {
            return;
        }
        this.$_oContainer.empty();

        var oVal = oData[0].overViewStatDayData;
        for(var i=0;i< 2;i++){
            if(oData[i].OverViewStatKey ==='Today'){
                oVal =oData[i].overViewStatDayData;

                this.setStaticTime(oData[i]);
            }
        }

        var list = [
            {
                'cTitle': '报备开工工地数',
                'cIcon': 'ex-i-c-03',
                'cUnit': '[单位：个]',
                'nCnt': oVal.ReportSiteCount,
                'nPercent': oVal.ReportSiteCount,
                'cUrl': '#',
                'cAlarmCls': 'green',
            }, {
                'cTitle': '实际出土工地数',
                'cIcon': 'ex-i-c-04',
                'cUnit': '[单位：个]',
                'nCnt':  oVal.WorkSiteCount,
                'nPercent':  oVal.WorkSiteCount,
                'cUrl': '#',
                'cAlarmCls': 'green',
            }, {
                'cTitle': '投入运营车辆数',
                'cIcon': 'ex-i-c-05',
                'cUnit': '[单位：辆]',
                'nCnt':  oVal.OperationVehicleCount,
                'nPercent':  oVal.OperationVehicleCount,
                'cUrl': '#',
                'cAlarmCls': 'green',
            }, {
                'cTitle': '车辆运输次数',
                'cIcon': 'ex-i-c-06',
                'cUnit': '[单位：次]',
                'nCnt':  oVal.TransportCount,
                'nPercent':  oVal.TransportCount,
                'cUrl': '#',
                'cAlarmCls': 'green',
            }

        ];
        this.initLI(list);

        this._oParent.fire('TodayStatic:DataLoadFinish',{oData:oData});
    },
});