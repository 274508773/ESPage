/**
 * Created by liulin on 2017/2/4.
 */
/**
 * Created by liulin on 2017/1/7.
 */


ES.MapView.TabPanel.LineTree = ES.MapView.TabPanel.SiteTree.extend({

    removeDrawSite:function(oNode) {
        var acId = this.oPopTree.getSelfChildNode(oNode);
        this._oPage.fire('CloudMap:ShowLayer.removeLayers', { acId: acId });
    },

    // 初始化树
    InitTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Common.JsTree(this._oParent,
                {cSelecter: this.oTreeContainer},
                this.oTreeOption);

            this.oPopTree.readyCallBack = function () {
                this.checkAll();
            };

            this.oPopTree.checkAllCallBack = function () {
                self.drawNode();
            };

            this.oPopTree.checkCallBack = function () {
                self.drawNode();
            };

            this.oPopTree.uncheckCallBack = function (e, oThisNode) {
                self.removeDrawSite(oThisNode.node);
            };

        } else {
            //self.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
            //self.oPopTree.$_oTree.refresh();
        }
    },
    // 移除邮路
    removeDrawSite: function (oNode) {
        var anId = this.oPopTree.getSelfChildNode(oNode);
        this._oPage.fire('MapView:ShowLayer.removeLayers', {anId: anId});
    },
    // 获得所有的 节点
    drawNode: function () {
        var anId = this.oPopTree.getTreeCheckNode();

        if (!anId || anId.length <= 0) {
            return;
        }
        /*var aoNode =[];
        for (var i = 0; i < anId.length; i++) {
            var oTemp = this.oPopTree.$_oTree.get_node(anId[i]);
            if (!oTemp.data) {
                continue;
            }
            aoNode.push(oTemp.data);
        }*/
        ES.getData({yldm:anId.join(',')}, '/hbgps/gisCar/getStationByYLDM', this.LineHandler, this);
    },
    // 获得线路数据
    LineHandler: function (oData) {
        if (!oData || oData.length <= 0) {
            return;
        }

        this._oPage.fire('MapView:ShowLayer.DrawLayers', { oData: oData });

        //var oBusData = {aoLatLng: {lat: oData[0].lat, lng: oData[0].lng, alt: oData[0].zm}, nId: 1, cId: oData[0].yldm, cName: oData[0].ylmc};


    },
    // 初始化界面
    initOn: function () {

        // 内部面板监听
        this._oParent.on("MapView:Struct.show", this.show, this);
        this._oParent.on("MapView:Struct.hide", this.hide, this);

        // 外部面板监听
        //this._oPage.on("MapView:SiteStatic.Select", this.selectNode, this);

    },

});