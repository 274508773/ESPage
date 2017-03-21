/**
 * 对显示面板的控制
 * 对 box 的显示控制操作
 *
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.TrackChart = ES.Class.extend({

    oOption: {
        cJTab: '.ex-layout-track-chart > li.track-chart-box',
        cEvenShowBox: 'TrackView:TrackChart.showBox',
    },

    // 构造函数
    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        // bar 的操作
        this.$_oTab = $(this.oOption.cJTab);

        this.initEven();

        this.initOn();
    },

    initOn: function () {
        this._oParent.on(this.oOption.cEvenShowBox, this.showBox, this);
    },

    // 显示box 的操作
    showBox: function (oData) {
        if (!oData || !oData.oBox || isNaN(oData.oBox.nIndex)) return;

        var oTab = this.$_oTab.eq(oData.oBox.nIndex);
        var cState = oTab.css("display");
        if (cState === "none") {
            oData.oBox.bIsShow = false;
            oTab.slideDown();
        }
        else {
            oTab.slideUp();
            oData.oBox.bIsShow = true;
        }
    },


    initEven: function () {
        var self = this;
        $('.ex-layout-track-chart-box > a.ec-close').bind('click', function () {
            var $this = $(this).closest('li.track-chart-box');
            var $that = $('.ex-layout-trackbar > .ex-maptool-box:not(".pass")').eq($this.index());
            $this.slideUp();
            $that.css('background-color', '#384b5e');

            var cDataEven = $(this).attr("even-name")
            if (cDataEven)
            {
                self._oParent.fire(cDataEven, { bIsDraw: true });
            }
        });
    },
})