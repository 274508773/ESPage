/**
 * 把图层管理 放在这里
 *
 *
 * Created by liulin on 2017/3/17.
 */


// 菜单项 站点,一个菜单管理面板、操作、弹出层
ES.CloudMap.PostPosMenu = ES.CloudMap.BaseMenu.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p>站点</p></li>',

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
            var oPos = this.latLngToLayerPoint(aoLayer[0].getLatLng());

            self.fire('CloudMap:PopWnd.setPos', {oPos:oPos});
        });
    },


    endMenu: function () {
        if (this.oEditTool) {
            this.oEditTool.calEdit();
        }
        if (this.oDrawTool) {
            this.oDrawTool.calDraw();
        }

        this.clearLayers();
    }
});


// 管理面板
ES.CloudMap.PostPosMenu.include({

    // 树面板
    initPenal: function () {

        this.oPenal = new ES.CloudMap.PosTree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    'url': '/hbgps/gisCar/getStationTree',
                }

            },
            plugins: ['types', 'search', 'unique'],
        });
    },

    hidePenal: function () {
        this.oPenal.hide();

    },
});


// 对图形进行编辑、删除操作
ES.CloudMap.PostPosMenu.include({

    // 树面板
    initEditTool:function(){

        this.oEditTool = new ES.CloudMap.EditTool(this,{oDrawLayer: this._oDrawLayer});
        this.oDelTool = new ES.CloudMap.DeleteTool(this,{});
        // 编辑
        this.aoEditTool.push(this.oEditTool);
        // 取消编辑
        this.aoEditTool.push(this.oDelTool);
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
ES.CloudMap.PostPosMenu.include({

    // 树面板
    initDrawTool:function() {
        this.oDrawTool = new ES.CloudMap.DrawMarkerTool(this, {})
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
ES.CloudMap.PostPosMenu.include({

    // 树面板
    initSaveACalTool:function(){
        this.oSaveTool = new ES.CloudMap.SaveTool(this,{oDrawLayer: this._oDrawLayer});
        this.oCalTool =  new ES.CloudMap.CalEditTool(this,{});

        this.aoSaveACalTool.push( this.oSaveTool );
        this.aoSaveACalTool.push( this.oCalTool );
    },

    // 添加到UI
    addSaveACalToUI:function() {

        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoSaveACalTool.length; i++) {
            this.oPContainer.appendTool(this.aoSaveACalTool[i]);
            this.aoSaveACalTool[i].bandClick();
        }
    },



});

// 弹出层的基本操作
ES.CloudMap.PostPosMenu.include({

    // 树面板 新增 弹出层
    initPopWnd:function() {

        this.oEditWnd = new ES.CloudMap.PostPosWnd(this, {
            oOffset: {nW: 10, nH: 80},
            cContainerSel: this._oParent.getMap()._mapPane
        });

        this.oDelWnd = new ES.CloudMap.DelCloudMap(this, {
            title: '删除操作-局站',
            cancelValue: '取消',
            content: '是否要删除数据！',
            cUrl: '/hbgps/gisCar/removeStation'
        });

        this.aoPopWnd.push(this.oEditWnd);
        this.aoPopWnd.push(this.oDelWnd);
    },

});


