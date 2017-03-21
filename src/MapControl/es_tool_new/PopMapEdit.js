/**
 * Created by liulin on 2016/12/22.
 */

ES.MapControl.ESPOpMapEdit = ES.MapControl.ESMapEdit.extend({

    //初始化工具栏事件
    initEven: function () {
        var self = this;

        // 对象
        $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().bind('click', function () {
            self.oDrawPen.handler.enable();

            self.$_btnPlus.hide();
            self.$_btnSave.hide();
            self.$_btnEdit.hide();
            self.$_btnCal.show();
            self.$_btnDel.hide();
            self.dealEditUI();
        });

        // 确定修改
        $(this.oOption.cBtnContain).find('.ec-icon-save').parent().bind('click', function () {
            // 触发结束编辑
            self.oEditPen.handler.save();
            self.oEditPen.handler.disable();
            // 清除图层
            //self._oDrawLayer.clearLayers();

            // 点击确定 隐藏自身、取消、编辑
            self.$_btnPlus.hide();
            self.$_btnEdit.hide();
            self.$_btnCal.hide();
            $(this).hide();
            self.dealEditUI();

        });

        // 编辑
        $(this.oOption.cBtnContain).find('.ec-icon-pencil').parent().bind('click', function () {

            // 点击编辑隐藏自身，和添加功能，显示确定和取消
            $(self.oOption.cBtnContain).find('.ec-icon-plus').parent().hide();

            self.$_btnSave.show();
            $(self.oOption.cBtnContain).find('.ec-icon-ban').parent().show();
            $(this).hide();
            self.$_btnDel.hide();
            self.dealEditUI();
            self.oEditPen.handler.enable();
        });

        $(this.oOption.cBtnContain).find('.ec-icon-ban').parent().bind('click', function () {

            $(this).hide();

            if (self.cFlag === 'add') {
                // 全部隐藏
                self.$_btnPlus.show();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
                self.$_btnDel.hide();
                self.clearLayers();
            }

            if (self.cFlag === 'edit') {
                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.show();
                self.$_btnCal.hide();
                self.$_btnDel.hide();
            }

            self.oDrawPen.handler.disable();
            // 撤销修改
            self.oEditPen.handler.revertLayers();
            self.oEditPen.handler.disable();

            self.dealEditUI();
        });
        // 删除
        $(this.oOption.cBtnContain).find('.ec-icon-power-off').parent().bind('click', function () {

            $(this).hide();

            if (self.cFlag === 'add') {
                // 全部隐藏
                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
                self.$_btnDel.hide();
            }

            if (self.cFlag === 'edit') {
                self.$_btnPlus.show();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
                self.$_btnDel.hide();
            }


            self.deleteFence();
            //self.oDrawPen.handler.disable();
            // 撤销修改
            //self.oEditPen.handler.revertLayers();
            //self.oEditPen.handler.disable();

            self.dealEditUI();
        });
    },

    // 添加数据
    addFence: function () {
        this.$_btnPlus.show();
        this.$_btnSave.hide();
        this.$_btnEdit.hide();
        this.$_btnCal.hide();
        this.dealEditUI();
    },

    initCallBack: function () {
        var self = this;

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oDrawLayer.addLayer(oLayer);
            var oInfo = self._getGisObj(oLayer);
            self._oMapBase._oParent.fire('FenceView:UI.addFence', oInfo);
            self.fire('FenceView:UI.addFence', oInfo);
        });

        this._oMap.on('draw:edited', function (e) {

            var aoLayer = e.layers;
            aoLayer.eachLayer(function (oLayer) {
                var oInfo = self._getGisObj(oLayer);
                self._oDrawLayer.addLayer(oLayer);
                oInfo.cId = oLayer.cId;
                oInfo.oFenceInfo = oLayer.oFenceInfo;

                self._oMapBase._oParent.fire('FenceView:UI.updateFence', oInfo);
                self.fire('FenceView:UI.updateFence', oInfo);
            });
        });
    },

});