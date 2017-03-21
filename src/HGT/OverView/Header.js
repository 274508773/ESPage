/**
 * Created by liulin on 2016/12/27.
 */


ES.HGT.OverView.Header = ES.Class.extend({

    oOption: {
        cContainSel: 'div.ex-layout-counter-top>.ex-layout-counter>ul.ex-theme-counter-top',
        cUrl: '/Site/GetSiteTypeStatic',

    },

    // 初始化界面
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this.$_oContainer = $(this.oOption.cContainSel);

        this._oParent = oParent;

        this.initUI({nDeptId:ES.HGT.oConfig.nDeptId});

        this.initOn();
    },


    initOn: function () {
        this._oParent.on('region:click', this.reflesh,this);
    },

    reflesh: function (oTemp) {
        this.initUI({nDeptId: oTemp.oData.Id});
    },

    // 界面实现
    initUI: function (oParam) {
        if(!this.oOption.cUrl){
            return;
        }

        ES.loadAn(this.$_oContainer);

        ES.getData(oParam, this.oOption.cUrl, this.dataHandler, this);
    },

    dataHandler: function (oData) {
        ES.removeAn(this.$_oContainer);
        if (!oData) {
            return;
        }
        this.$_oContainer.empty();


        var list = [
            {
                'cTitle': '在建工地个数',
                'cIcon': 'ex-i-c-01',
                'cUnit': '[单位：个]',
                'nCnt': oData[0].Cnt,
                'nPercent': oData[0].Cnt,
                'cUrl': '#',
                'cAlarmCls': 'green'
            }, {
                'cTitle': '出土工地个数',
                'cIcon': 'ex-i-c-1',
                'cUnit': '[单位：个]',
                'nCnt': oData[1] ? oData[1].Cnt : 0,
                'nPercent': oData[1] ? oData[1].Cnt : 0,
                'cUrl': '#',
                'cAlarmCls': 'green'
            }, {
                'cTitle': '非出土工地个数',
                'cIcon': 'ex-i-c-1',
                'cUnit': '[单位：个]',
                'nCnt': oData[3] ? oData[3].Cnt : 0,
                'nPercent': oData[3] ? oData[3].Cnt : 0,
                'cUrl': '#',
                'cAlarmCls': 'green'
            }, {
                'cTitle': '临时工地个数',
                'cIcon': 'ex-i-c-1',
                'cUnit': '[单位：个]',
                'nCnt': oData[2] ? oData[2].Cnt : 0,
                'nPercent': oData[2] ? oData[2].Cnt : 0,
                'cUrl': '#',
                'cAlarmCls': 'green'
            }
        ]


        this.initLI(list);
    },

    initLI: function (aoData) {
        if (!aoData || aoData.length <= 0) {
            return;
        }

        for (var i = 0; i < aoData.length; i++) {
            var cHtml = ES.HGT.OverView.oConfig.oUILiConfig;
            if (typeof  cHtml === 'object') {
                var $_oTemp = ES.getTag(ES.HGT.OverView.oConfig.oUILiConfig);
                cHtml = ES.template($_oTemp.prop('outerHTML'), aoData[i]);
            }

            this.$_oContainer.append(cHtml, aoData[i]);
        }
    }

});