/**
 * Created by liulin on 2016/12/27.
 */

ES.MapView.PopSiteInfo = ES.Common.Pop.extend({

    // 车辆列表构造函数
    initialize: function (oParent, oBus) {
        this.oBus = oBus;

        this.cContentCls = 'business-type-' + this.oBus.Id;

        // data
        //this.aoList = [
        //    {'label': '工地信息', 'content': '/Site/TabSiteInfo'},
        //    {'label': '车辆出入记录', 'content': '/Site/TabTransportInfo'},
        //    //{'label': '相关路线', 'content': '/Template/BlankTpl'},
        //    {'label': '违法记录', 'content': '/Site/TabAlarmInfo'},
        //]


        var oOption = {
            content: '',
            cancel: function () {
                this.close();
                return true;
            },
            title: '查看工地详情',
            //align: "right bottom",
            //width:960,
            //height:470,
        };

        ES.Common.Pop.prototype.initialize.call(this, oParent, oOption);

    },


    afterOpen:function() {
        if( this.oBus.SiteType ===2){
            ES.getData({id: this.oBus.Id}, '/TemporarySite/Detail', this.setContent, this, null, {dataType: 'html'});
        }
        else{
            ES.getData({id: this.oBus.Id}, '/Site/Detail', this.setContent, this, null, {dataType: 'html'});
        }
        //ES.getData({id: this.oBus.Id}, '/Site/Detail', this.setContent, this, null, {dataType: 'html'});
    },



    showModal: function () {
        this.oDialog.showModal();
        this.oDialog._$('footer').hide();
    },

    initButton: function () {
        this.oOption.button = [];
    },



});