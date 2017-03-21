/**
 * Created by exsun on 2017-01-12.
 */

ES.HGT.CloudMap.DelCloudMap=ES.Common.Pop.DelEntity.extend({
    initOn: function () {
        this._oParent.on('CloudMap:DelCloudMap.del', this.del, this);
    },

    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));

        if (oData && oData.IsSuccess) {
            ES.aSucess(ES.Common.Lang[32]);

            this._oParent.fire(this._oParent.getFlag() + 'TreeView.reflesh');
        }
        else {
            ES.aErr(ES.template(ES.Common.Lang[33], oData));
        }

        this.oDialog.close();
    },

})
