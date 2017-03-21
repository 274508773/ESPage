/**
 * Created by liulin on 2017/3/16.
 */

ES.HGT.CloudMap.POTagTree = ES.HGT.CloudMap.TagTree .extend({

    // 初始化树
    InitTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Common.JsTree(this._oParent,
                {cSelecter: this.oTreeContainer},
                this.oTOption);
            this.oPopTree.readyCallBack = function () {
                self.drawNode();
            };
            this.oPopTree.refreshCallBack = function () {
                self.drawNode();
            };
            // 选择树节点触发事件
            this.oPopTree.selectCallBack = function (e, oNode) {

                self.getLine(oNode.node);

                self.getPos(oNode.node);
            }
        }
    },

    // 编辑工具开始编辑
    getLine: function (oData) {
        var self = this;
        ES.getData({yldm:oData.id},'/hbgps/gisCar/getRouteGPSByYLDM', function (oData) {
            self._oParent.fire('CloudMap:EditTool.edit', {oNode:oData});
        })


    },

    getPos:function(oData){

        var self = this;
        ES.getData({yldm:oData.id},'/hbgps/gisCar/getStationByYLDM', function (oData) {
            self._oParent.fire('CloudMap:PostPos.drawLayers', {oNode:oData});
        })
    },
    
})