/**
 * Created by liulin on 2017/3/16.
 */


ES.HGT.CloudMap.POTreeFrame = ES.HGT.CloudMap.TreeFrame.extend({
    initTabPanel: function (oData) {
        if (!this._oFrame[oData.cFlag]) {
            this._oFrame[oData.cFlag] = new ES.HGT.CloudMap.POTagTree(
                this,
                {cFlag: oData.cFlag},
                ES.HGT.oConfig.CloudMap[oData.cFlag]);
        }
        else {
            // 加载所有的围栏
            this._oFrame[oData.cFlag].drawNode();
        }

        this._oFrame[oData.cFlag].show();

        for (var cKey in this._oFrame) {
            if (cKey !== oData.cFlag) {
                this._oFrame[cKey].hide();
            }
        }
    },
})