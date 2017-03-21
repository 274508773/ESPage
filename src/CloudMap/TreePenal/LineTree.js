/**
 * Created by liulin on 2017/3/21.
 */


ES.CloudMap.LineTree = ES.CloudMap.TagTree.extend({

    // 选择树节点 的操作
    selectDeal: function (oNode) {

        var oParam = {yldm: oNode.node.id};
        // 获得节点信息，为邮路信息
        var oTemp = this.oPopTree.$_oTree.get_node( oNode.node.id);
        // 选树节点
        ES.getData(oParam, '/hbgps/gisCar/getStationByYLDM', this.selectHandler, this);

        ES.getData(oParam, '/hbgps/gisCar/getRouteGPSByYLDM', this.LineHandler, this);
    },

    // 获得线路数据
    LineHandler: function (oData) {
        if (!oData || oData.length <= 0) {
            return;
        }
        var aoLatLng = oData[0].Data.map(function (oItem) {
            return {lat: oItem.lat, lng: oItem.lng, alt: oItem.zm};
        });

        var oBusData = {aoLatLng: aoLatLng, nId: 1, cId: oData[0].yldm, cName: oData[0].ylmc};

        this._oParent.oPenalPos.setBusData(oBusData);
    },

    selectHandler: function (oData) {
        if (!oData || oData.length <= 0) {
            return;
        }



        var aoLatLng = oData.map(function (oItem) {
            return {data: {lat: oItem.lat, lng: oItem.lng}, id: oItem.zm, text: oItem.jgqc};
        });

        var oTemp = {
            aoData: aoLatLng,

        };

        this._oParent.oPenalPos.setGridData(oTemp);
        this._oParent.oPenalPos.show();
    }
});