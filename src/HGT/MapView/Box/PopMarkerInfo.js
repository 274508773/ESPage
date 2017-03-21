/**
 * Created by liulin on 2016/12/23.
 */


ES.HGT.MapView.PopMarkerInfo = ES.Common.Pop.extend({

    // 车辆列表构造函数
    initialize: function (oParent, oBus) {
        this.oBus = oBus;

        this.cContentCls = 'business-type-' + this.oBus.Id;

        // data
        this.aoList = [
            {'label': '工地信息', 'content': '/Site/TabSiteInfo'},
            {'label': '车辆出入记录', 'content': '/Site/TabTransportInfo'},
            //{'label': '相关路线', 'content': '/Template/BlankTpl'},
            {'label': '违法记录', 'content': '/Site/TabAlarmInfo'},
        ]


        var oOption = {
            content: this.getContent(),
            cancel: function () {
                this.close();
                return true;
            },
            title: '工地详情',
            width:960,
            height:470,
        };

        ES.Common.Pop.prototype.initialize.call(this, oParent, oOption);

    },

    showModal: function () {
        this.oDialog.showModal();
        this.oDialog._$('footer').hide();
    },

    initButton: function () {
        this.oOption.button = [];
    },

    getContent: function () {
        var cHtml = ' <div class="ex-layout-pop-tab  '+this.cContentCls+'"><ul class="ex-layout-pop-tab-title ec-avg-sm-' + this.aoList.length + '">';
        var cLiT = '';
        var cLiC = ''
        for (var i = 0; i < this.aoList.length; i++) {
            cLiT += ' <li content="' + this.aoList[i].content + '">' + this.aoList[i].label + '</li>';
            cLiC += '<li class="flipInX"></li>'
        }
        cHtml = cHtml + cLiT + '</ul> <ul class="ex-layout-pop-tab-content">' + cLiC + '</ul></div>'

        return cHtml;
    },

    initEvent: function () {
        var self = this;
        var $_cContentLi = $('.' + this.cContentCls + '>ul.ex-layout-pop-tab-content>li');
        //$_cContentLi.parent().height(this.oOption.height);

        $('.' + this.cContentCls + '>ul.ex-layout-pop-tab-title>li').bind('click', function () {
            var nIndex = $(this).index();
            $(this).siblings().removeClass('ec-active');
            $(this).addClass('ec-active');

            $_cContentLi.eq(nIndex).siblings().removeClass('ec-active in');
            $_cContentLi.eq(nIndex).addClass('ec-active in');

            var oTabPage = $(this).data('oTabPage');

            if (!oTabPage) {
                oTabPage = new ES.HGT.MapView.TabSite(self, {
                    cPageUrl: $(this).attr('content'),
                    cContentSel: $_cContentLi.eq(nIndex),
                    height:self.oOption.height,
                });
                oTabPage.loadDetailView(self.oBus);
                $(this).data('oTabPage', oTabPage);
            }
        });

        $('.' + this.cContentCls + '>ul.ex-layout-pop-tab-title>li').eq(0).click();
    }

});
