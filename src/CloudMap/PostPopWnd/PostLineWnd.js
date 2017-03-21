/**
 * Created by liulin on 2017/3/20.
 */

ES.CloudMap.PostLineWnd = ES.CloudMap.PopWnd.extend({

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
        this.cFlag = 'PostLine';
        // 窗体在地图上弹出的位置信息
        this.oPopLatLng = null;

        this.initUI();
        this.initOn();

        this.setParentEvent();

    },

    initUI: function () {
        this.$_oContainer = $(this.cContent);
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
            self._oParent.clearLayers();
        });

    },

    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener( this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    check: function () {

        if (!$('#PostLineNo').val()) {
            ES.aWarn('请线路编码！');
            return false;
        }



        if (!$('#PostLineName').val()) {
            ES.aWarn('请线路名称！');
            return false;
        }



        return true;
    },

    save: function () {
        if (!this.check()) {
            return;
        }

        ES.loadAn(this.$_oContainer);

        var oParam = {
            Id: this.oBusData.Id,
            CloudName: $('#PostLineName').val(),
            CloudNo: $('#PostLineNo').val(),
            CloudType: 1,
            Map: this.oBusData.oInfo,
            Source: 1,
            DeptId: 1,
            MapType: 10,
        };

        ES.getData(JSON.stringify(oParam), '/hbgps/gisCar/addRoute', this.saveHandler, this, {nId: oParam.Id});
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
            this._oParent.fire('PostPosTreeView.reflesh');
            // 保存数据成功，触发事件
            //this._oParent.fire('Edit:saveSuccess');

            //this._oParent.on('TreeView.reflesh',this.reflesh,this);

            this.$_oContainer.hide();
        }
        else {
            ES.aErr(ES.template(bAdd ? '添加数据失败,原因:{Msg}' : '修改数据失败,原因:{Msg}', oData));
            this._oParent.fire('Edit:saveFail');
        }
    },

    // 接口
    initOn: function () {

        this._oParent.on('CloudMap:PopWnd.showPostLine', this.showModal, this);
        this._oParent.on('CloudMap:PopWnd.editShowPostLine', this.editShow, this);
        this._oParent.on('CloudMap:PopWnd.setPosPostLine', this.setPos, this);
    },

    setPos:function(oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();
        if(!oData) {return;}
        var oPos = oData.oPos
        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});
    },


    editShow: function (oData) {
        if (!oData || !oData.oInfo) {
            return;
        }
        var oPos = oData.oPos;

        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        $('#PostLineNo').val(oData.oBusInfo.cId);
        $('#PostLineName').val(oData.oBusInfo.cName);

        this.oBusData = {};
        this.oBusData.Id =1;
        this.oBusData.oInfo = oData.oInfo;
        this.cParentId = oData.oBusInfo.cParentId;

        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = oData.oPos;

        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        $('#PostLineName').val();


        this.oBusData = oData;
        this.oBusData.Id = 0;
        this.$_oContainer.show();

    },

});

// 树的选择初始化
ES.CloudMap.PostLineWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box  PostPosPopWnd"   style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">线路编码：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="PostLineNo" name="form-sitename" placeholder="请输入编码" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">线路名称：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="PostLineName" name="form-sitename" placeholder="请输入名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
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
