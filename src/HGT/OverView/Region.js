/**
 * Created by liulin on 2016/12/27.
 */

ES.HGT.OverView.Region =ES.HGT.OverView.Header.extend({

    initOn: function () {
        //this._oParent.on('region:click', this.reflesh,this);
    },
    dataHandler: function (oData) {
        ES.removeAn(this.$_oContainer);
        if (!oData) {
            return;
        }
        this.$_oContainer.empty();
        var self = this;
        $.each(oData, function (nIndex, oItem) {
            var oLi = $(ES.template('<li class="title">{Name}</li>', oItem));
            oLi.data('oData', oItem);
            self.$_oContainer.append(oLi);
        });

        this.initEvent();
    },


    initEvent: function () {
        var self = this;
        this.$_oContainer.find('li').bind('click', function () {
            $(this).addClass('ec-active').siblings().removeClass('ec-active');
            var oData = $(this).data('oData');
            self._oParent.fire('region:click', {oData: oData});
        });
    },

});