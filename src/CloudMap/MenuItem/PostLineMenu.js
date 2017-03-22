/**
 * Created by liulin on 2017/3/20.
 */


// 菜单项 站点,一个菜单管理面板、操作、弹出层
ES.CloudMap.PostLineMenu = ES.CloudMap.BaseMenu.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p>邮路</p></li>',

    initialize: function (oParent, oOption) {

        ES.CloudMap.BaseMenu.prototype.initialize.call(this,oParent, oOption);

        this.initPenal();
        this.initEditTool();
        this.initDrawTool();
        this.initPopWnd();
        this.initSaveACalTool();
    },

    initOn: function () {

        ES.CloudMap.BaseMenu.prototype.initOn.call(this);

        var self =this;
        this._oMap.on('moveend', function (e) {
            var aoLayer = self._oDrawLayer.getLayers();
            if(!aoLayer ||aoLayer.length<=0){
                return;
            }

            var oPos = this.latLngToLayerPoint(aoLayer[0].getLatLngs()[0]);

            self.fire('CloudMap:PopWnd.setPosPostLine', {oPos:oPos});
        });
    },

    endMenu: function () {
        if(!this.oPenalPos){
            return;
        }
        this.oPenalPos.calEdit();
        this.clearLayers();
    }

});


// 管理面板
ES.CloudMap.PostLineMenu.include({

    // 树面板
    initPenal: function () {

        this.oPenal = new ES.CloudMap.LineTree(this, {cTitle:'邮路组织结构'}, {
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


    // 隐藏界面
    hidePenal: function () {
        this.oPenal.hide();
        this.oPenalPos.hide();
    },



});


// 对图形进行编辑、删除操作
ES.CloudMap.PostLineMenu.include({

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
            this.oPContainer.appendTool(this.aoEditTool[i]);
            this.aoEditTool[i].bandClick();
        }
    },




});

// 对图形进行绘制
ES.CloudMap.PostLineMenu.include({

    // 树面板
    initDrawTool:function(){
        this.oDrawTool = new ES.CloudMap.PostLineDrawTool(this,{});
        this.aoDrawTool.push(this.oDrawTool);
    },

    // 添加到UI
    addDrawToUI:function() {
        if (!this.oPContainer || this.aoDrawTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoDrawTool.length; i++) {
            this.oPContainer.appendTool(this.aoDrawTool[i]);
            this.aoDrawTool[i].bandClick();
        }
    },


});

// 对图形进行保存和取消
ES.CloudMap.PostLineMenu.include({

    // 树面板
    initSaveACalTool:function(){
        // 编辑
        this.aoSaveACalTool.push(new ES.CloudMap.SaveTool(this,{oDrawLayer: this._oDrawLayer}));

        // 取消编辑
        this.aoSaveACalTool.push(new ES.CloudMap.PostLineCalTool(this,{}));
    },

    // 添加到UI
    addSaveACalToUI:function() {
        if (!this.oPContainer || this.aoSaveACalTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoSaveACalTool.length; i++) {
            this.oPContainer.appendTool(this.aoSaveACalTool[i]);
            this.aoSaveACalTool[i].bandClick();
        }
    },



});

// 弹出层的基本操作
ES.CloudMap.PostLineMenu.include({

    // 树面板 新增 弹出层
    initPopWnd:function() {

        this.oEditWnd = new ES.CloudMap.PostLineWnd(this, {
            oOffset: {nW: 10, nH: 80},
            cContainerSel: this._oParent.getMap()._mapPane
        });

        this.oDelWnd = new ES.CloudMap.PostLineDelWnd(this, {
            title: '删除操作-邮路',
            cancelValue: '取消',
            content: '是否要删除数据！',
            cUrl: '/hbgps/gisCar/removeRoute'
        });

        this.aoPopWnd.push(this.oEditWnd);
        this.aoPopWnd.push(this.oDelWnd);
    },

});
