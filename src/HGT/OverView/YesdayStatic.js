/**
 * Created by liulin on 2016/12/27.
 */

ES.HGT.OverView.YesdayStatic = ES.HGT.OverView.Header.extend({

    initOn: function (oTemp) {
        this._oParent.on('TodayStatic:DataLoadFinish',this.dataHandler,this);

    },
    // 设置时间
    setStaticTime: function (oTemp) {
          $('.yesday-static').html(ES.template( '统计时间:{cB}--{cE}',oTemp));
    },

    dataHandler: function (oTemp) {
        ES.removeAn(this.$_oContainer);
        if (!oTemp) {
            return;
        }
        var oData = oTemp.oData;
        var oVal = oData[0].overViewStatDayData;
        for(var i=0;i< 2;i++){
            if(oData[i].OverViewStatKey ==='Yesterday'){
                oVal =oData[i].overViewStatDayData;
                this.setStaticTime(oData[i]);
            }
        }
        this.$_oContainer.empty();

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
    },
});