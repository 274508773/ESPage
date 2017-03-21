/**
 * Created by liulin on 2017/1/7.
 */

ES.HGT.MapView.TabPanel.VehTree = ES.HGT.MapView.TabPanel.SiteTree.extend({

    drawSite: function (oData) {

        this._oPage.fire('MapView:LiveMange.addLive', { aoGpsInfo: oData.DataList });
    },

    removeDrawSite:function(oNode) {
        var acId = this.oPopTree.getSelfChildNode(oNode);
        this._oParent.fire('MapView:LiveMange.removeLive', { acId: acId });
    },

    drawCheckSite:function() {
        //获得所有的工地
        var anDeptId = this.oPopTree.getTreeCheckNode();

        if (!anDeptId) {
            return;
        }

        this._oParent.fire('MapView:VehLst.initVehLst', { anDeptId: anDeptId });

    },

    // 初始化树
    InitTree: function () {
        var self = this;

        if (!this.oPopTree) {
            this.oPopTree =new ES.HGT.MapView.VehTreeTemp(this._oParent, {  cSelecter: this.oTreeContainer },this.oTreeOption);
            this.oPopTree.readyCallBack = function () {
                self.clearTree();
                this.checkAll();
            };

            this.oPopTree.checkAllCallBack = function () {
                self.drawCheckSite();
            };

            this.oPopTree.uncheckCallBack = function (e, oThisNode) {
                self.drawCheckSite(oThisNode.node);
            };

        }
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

