/**
 * Created by liulin on 2017/3/22.
 */

ES.CloudMap.PostLineDelWnd = ES.Common.Pop.DelEntity.extend({
    initOn: function () {
        this._oParent.on('CloudMap:PostLineDelWnd.del', this.del, this);
    },

    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));

        if (oData && oData.IsSuccess) {
            ES.aSucess(ES.Common.Lang[32]);

            this._oParent.fire('PostLineTreeView.reflesh');
        }
        else {
            ES.aErr(ES.template(ES.Common.Lang[33], oData));
        }

        this.oDialog.close();
    },

});
