/**
 * Created by liulin on 2017/3/20.
 */


// 菜单项 站点,一个菜单管理面板、操作、弹出层
ES.CloudMap.PostLine = ES.Evented.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p>邮路</p></li>',

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);

        this._oMap = oParent.getMap();
        this._oDrawLayer = L.featureGroup();
        this._oDrawLayer.addTo(this._oMap);
        this.bActive = false;

        this.aoTool = [];
        this.aoEditTool=[];
        this.aoPopWnd = [];
        this.aoSaveACalTool= [];

        this.$_oLi = null;

        this.initOn();
        this.initUI();
        this.initPenal();
        this.initEditTool();
        this.initDrawTool();
        this.initPopWnd();
        this.initSaveACalTool();
    },

    initOn: function () {
        var self =this;
        this._oMap.on('moveend', function (e) {
            var aoLayer = self._oDrawLayer.getLayers();
            if(!aoLayer ||aoLayer.length<=0){
                return;
            }

            var oPos = this.latLngToLayerPoint(aoLayer[0].getLatLngs()[0]);

            self.fire('CloudMap:PopWnd.setPos', {oPos:oPos});
        });
    },

    clearLayers: function () {
        this._oDrawLayer.clearLayers();
    },

    addLayer: function (oLayer) {
        oLayer.addTo( this._oDrawLayer);
    },


    getMenu: function () {
        return this.$_oLi;
    },

    initUI: function () {
        this.$_oLi = $(this.cHtml);
        var self = this;
        this.$_oLi.find('button').bind('click', function () {
            if (self.oPenal) {
                self.oPenal.show();
                self.oPContainer.setActive(self);

                // 显示工具面板
                self.oPContainer.showTool();

                // 添加编辑按钮
                self.addToUI();
            }

        });

    },

    addClass: function (cCls) {
        this.$_oLi.find('button').addClass(cCls);
    },

    removeClass: function (cCls) {
        this.$_oLi.find('button').removeClass(cCls);
    },

    setPContainer: function (oPContainer) {
        this.oPContainer = oPContainer;
    },



});


// 管理面板
ES.CloudMap.PostLine.include({

    // 树面板
    initPenal: function () {

        this.oPenal = new ES.CloudMap.TagTree(this, {cTitle:'邮路组织结构'}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    'url': '/hbgps/gisCar/getYLTree',
                }

            },
            plugins: ['types', 'search', 'unique'],
        });

        // 面板
        this.oPenalPos = new ES.CloudMap.CreatePos(this,{oDrawLayer:this._oDrawLayer});

    },

    // 显示界面
    oPenalShow:function(){

        this.oPenal.show();
        this.oPenalPos.show();
        this.bActive = true;
    },

    // 隐藏界面
    oPenalHide: function () {
        this.oPenal.hide();
        this.oPenalPos.hide();

        this.bActive = false;
    },
});


// 对图形进行编辑、删除操作
ES.CloudMap.PostLine.include({

    // 树面板
    initEditTool:function(){
        // 编辑
        this.aoEditTool.push(new ES.CloudMap.PostLineEditTool(this,{oDrawLayer: this._oDrawLayer}));

        // 取消编辑
        this.aoEditTool.push(new ES.CloudMap.DeleteTool(this,{}));
    },

    // 添加到UI
    addEditToUI:function() {
        if (!this.oPContainer || this.aoEditTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoEditTool.length; i++) {
            this.oPContainer.appendTool(this.aoEditTool[i].$_oLi);
            this.aoEditTool[i].bandClick();
        }
    },

    setActive: function (oCtrl) {
        if (this.aoEditTool.length <= 0) {
            oCtrl.addClass('ec-active');
        }

        for (var i = 0; i < this.aoEditTool.length; i++) {

            if (oCtrl !== this.aoEditTool[i]) {
                oCtrl.removeClass('ec-active');
            }
            else {
                oCtrl.addClass('ec-active');

            }
        }
    },



});

// 对图形进行绘制
ES.CloudMap.PostLine.include({

    // 树面板
    initDrawTool:function(){
        this.aoTool.push(new ES.CloudMap.PostLineDrawTool(this,{}));
    },

    // 添加到UI
    addToUI:function() {
        if (!this.oPContainer || this.aoTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoTool.length; i++) {
            this.oPContainer.appendTool(this.aoTool[i].$_oLi);
            this.aoTool[i].bandClick();
        }
    },

    setActive: function (oCtrl) {
        if (this.aoTool.length <= 0) {
            oCtrl.addClass('ec-active');
        }

        for (var i = 0; i < this.aoTool.length; i++) {

            if (oCtrl !== this.aoTool[i]) {
                oCtrl.removeClass('ec-active');
            }
            else {
                oCtrl.addClass('ec-active');

            }
        }
    },

});

// 对图形进行保存和取消
ES.CloudMap.PostLine.include({

    // 树面板
    initSaveACalTool:function(){
        // 编辑
        this.aoSaveACalTool.push(new ES.CloudMap.SaveTool(this,{oDrawLayer: this._oDrawLayer}));

        // 取消编辑
        this.aoSaveACalTool.push(new ES.CloudMap.CalEditTool(this,{}));
    },

    // 添加到UI
    addSaveACalToUI:function() {
        if (!this.oPContainer || this.aoSaveACalTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoSaveACalTool.length; i++) {
            this.oPContainer.appendTool(this.aoSaveACalTool[i].$_oLi);
            this.aoSaveACalTool[i].bandClick();
        }
    },

    setActive: function (oCtrl) {
        if (this.aoSaveACalTool.length <= 0) {
            oCtrl.addClass('ec-active');
        }

        for (var i = 0; i < this.aoSaveACalTool.length; i++) {

            if (oCtrl !== this.aoSaveACalTool[i]) {
                oCtrl.removeClass('ec-active');
            }
            else {
                oCtrl.addClass('ec-active');
            }
        }
    },

});

// 弹出层的基本操作
ES.CloudMap.PostLine.include({

    // 树面板 新增 弹出层
    initPopWnd:function() {

        this.oEditWnd = new ES.CloudMap.PostLineWnd(this, {
            oOffset: {nW: 10, nH: 80},
            cContainerSel: this._oParent.getMap()._mapPane
        });

        this.oDelWnd = new ES.CloudMap.DelCloudMap(this, {
            title: '删除操作-邮路',
            cancelValue: '取消',
            content: '是否要删除数据！',
            cUrl: '/hbgps/gisCar/removeRoute'
        });

        this.aoPopWnd.push(this.oEditWnd);
        this.aoPopWnd.push(this.oDelWnd);
    },

});
