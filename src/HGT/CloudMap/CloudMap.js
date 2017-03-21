/**
 * Created by exsun on 2017-01-09.
 */

ES.HGT.CloudMap={};

ES.HGT.CloudMap.version = '0.1.1';

// 存储页面公共的模块,保存页面当前编辑的模式
ES.HGT.CloudMap.Page = ES.Page.extend({

    //页面id
    initialize: function (id, oOption) {

        ES.Page.prototype.initialize.call(this, id, oOption);

        this.cFlag = 'Grid';
    },

    setFlag: function (cVal) {
        this.cFlag = cVal;
    },

    getFlag: function () {
        return this.cFlag;
    },

    getPosByLatLng: function (oLatLng) {
        if(!this._oMap||!oLatLng) {
            return null;

        }

        var oPos = this._oMap.latLngToLayerPoint(oLatLng);

        return oPos
    }

});
