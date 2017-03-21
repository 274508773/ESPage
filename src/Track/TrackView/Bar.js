/**
 * des: 对状态条的控制操作
 *
 *
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.Bar = ES.Class.extend({
    oOption: {
        cEvenShowBox: 'TrackView:TrackChart.showBox',
    },
    // 构造函数
    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        // bar 的操作
        this.$_oBar = $(".ex-layout-trackbar");

        this.initEven()
    },

    initEven: function () {

        var self = this;
        this.$_oBar.find(".ex-maptool-box:not(.pass)").bind('click', function () {
            var oBox = { nIndex: $(this).index(), bIsShow: false };

            self._oParent.fire(self.oOption.cEvenShowBox, { oBox: oBox })
            var cColor = oBox.bIsShow ? '#384b5e' : '#3bb4f2';

            var cEvenName = $(this).attr("even-name");
            if (cEvenName) {
                self._oParent.fire(cEvenName, { bIsDraw: !oBox.bIsShow });
            }

            $(this).css('background-color', cColor);
        });

    },
});