/**
 * Created by liulin on 2017/3/16.
 */


ES.HGT.CloudMap.PostLinePopWnd = ES.Evented.extend({

    oOption: {
        cContainerSel: '#MapView',
        cFlag: 'Grid',
        oText: {},
        oOffset: {nW: 0, nH: 30}
    },

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        //ES.Common.Pop.prototype.initialize.call(this, oParent, oOption);
        ES.setOptions(this, oOption);
        //this.hideDefaultButton();
        this.cFlag = oOption.cFlag;//'Grid';
        // 窗体在地图上弹出的位置信息
        this.oPopLatLng = null;

        this.initUI();
        this.initOn();

        this.setParentEvent();


        //this.setContent(ES.template(this.cContent, {cFlag: this.cFlag}));
    },

    initUI: function () {
        this.$_oContainer = $(ES.template(this.cContent, {cFlag: this.cFlag}));
        $(this.oOption.cContainerSel).append(this.$_oContainer);
        this.$_oContainer.hide();
        this.afterOpen();
    },

    afterOpen: function () {
        var self = this;
        this.$_oContainer.find('.ec-icon-save').parent().bind('click', function () {
            self.save();
        });

        //type="button"
        this.$_oContainer.find('a[type="button"]').bind('click', function () {
            self.$_oContainer.hide();
            self._oParent.fire('CloudMap:EditTool.clearLayer');
        });
        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTree(this, {
                    cSelCls: this.oOption.cSelCls,
                    cBandSel: $('#' + this.cFlag + 'Type')
                },
                ES.HGT.oConfig.CloudMap[this.cFlag]);
        }
        this.oSelectTree.on('selectVal',  this.setVal,this);
    },

    setVal: function (oData) {
        $('#'+this.cFlag+'Type').val(oData.cVal);

        this.nDeptId = parseInt(oData.cId)
    },

    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener( this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    check: function () {

        if (!$('#' + this.cFlag + 'Name').val()) {
            ES.aWarn('请录入网格名称！');
            return false;
        }


        if (!$('#' + this.cFlag + 'Type').val()) {
            ES.aWarn('请录入网格类型！');
            return false;
        }
        return true;
    },

    save: function () {
        if (!this.check()) { return; }

        ES.loadAn(this.$_oContainer);

        var oParam = {
            Id:this.oBusData.Id,
            CloudName: $('#' + this.cFlag + 'Name').val(),
            CloudType: this.oOption.nFlag,
            Map: this.oBusData.oInfo,
            Source: 1,
            DeptId: this.nDeptId,
            MapType: this.oBusData.oInfo.nType,
        };

        ES.getData(oParam,'/CloudMap/Edit',this.saveHandler,this,{nId:oParam.Id});
    },

    saveHandler: function (oTemp) {
        ES.removeAn(this.$_oContainer);
        var oData = oTemp.oData;
        var bAdd = false;
        if (!oTemp.nId) {
            bAdd = true;
        }

        if (oData && oData.IsSuccess) {
            ES.aSucess(bAdd ? ES.Common.Lang[10] : ES.Common.Lang[20]);
            // 刷新grid列表
            this._oParent.fire('CloudMap:EditTool.clearLayer');
            // 刷新listview
            this._oParent.fire(this.cFlag + 'TreeView.reflesh');
            // 保存数据成功，触发事件
            this._oParent.fire('Edit:saveSuccess');

            this.$_oContainer.hide();
        }
        else {
            ES.aErr(ES.template(bAdd ? '添加数据失败,原因:{Msg}' : '修改数据失败,原因:{Msg}', oData));
            this._oParent.fire('Edit:saveFail');
        }
    },

    // 接口
    initOn: function () {

        this._oParent.on('CloudMap:' + this.cFlag + 'PopWnd.show', this.showModal, this);
        this._oParent.on('CloudMap:' + this.cFlag + 'PopWnd.editShow', this.editShow, this);

        this._oParent.on('CloudMap:' + this.cFlag + 'PopWnd.setPos', this.setPos, this);
    },

    setPos:function() {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();
        if(!this.oPopLatLng) {return;}
        var oPos = this._oParent.getPosByLatLng(this.oPopLatLng);
        if (!oPos) {
            return;
        }

        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});
    },


    editShow: function (oData) {
        if (!oData || !oData.oInfo) {
            return;
        }

        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();
        var oPos = this._oParent.getPosByLatLng(oData.oLatLng);
        this.oPopLatLng =oData.oLatLng;



        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        this.oBusData = {
            Id: oData.oInfo.oBusInfo.Id,
            oInfo: oData.oInfo
        }
        this.nDeptId = oData.oInfo.oBusInfo.DeptId;
        $('#' + this.cFlag + 'Name').val(oData.oInfo.oBusInfo.CloudName);
        $('#' + this.cFlag + 'Type').val(oData.oInfo.oBusInfo.DeptName);

        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = this._oParent.getPosByLatLng(oData.oLatLng);
        this.oPopLatLng = oData.oLatLng;

        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        $('#' + this.cFlag + 'Name').val();
        $('#' + this.cFlag + 'Type').val();

        this.oBusData = oData;
        this.oBusData.Id = 0;
        this.$_oContainer.show();

    },

});

// 树的选择初始化
ES.HGT.CloudMap.PopGridWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box {cFlag}PopWnd"   style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">网格名称：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="{cFlag}Name" name="form-sitename" placeholder="请输入名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+
        //'    <li class="ec-form-group">'+
        //    '    <label for="form-sitename" class="ec-u-sm-4 ec-form-label">网格别名：</label>'+
        //'        <div class="ec-u-sm-8"><input type="text" id="{cFlag}ShowName" name="form-sitename" placeholder="请输入工地名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
        //    '</li>'+
    '    <li class="ec-form-group">'+
    '    <label for="form-selectDate" class="ec-u-sm-4 ec-form-label">类型：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="{cFlag}Type" name="form-sitename"  placeholder="请输入类型" class="ec-form-field ec-radius ec-input-sm">'+
    '    </div>'+
    '    </li>'+
    '    <li class="ec-form-group">'+
    '    <div class="ec-u-sm-12 ex-final-button">'+
    '    <button type="button" class="ec-btn ec-btn-sm ec-btn-primary"><i class="ec-icon-save"></i> 保存 </button>'+
    '    <a href="#" type="button" class="ec-btn ec-btn-sm ec-btn-warning" style="color:#fff;">' +
    '        <i class="ec-icon-link"></i> 关闭 </a>'+
    '   </div>'+
    '</li>'+
    '</ul>'+
    '</div>',


});
