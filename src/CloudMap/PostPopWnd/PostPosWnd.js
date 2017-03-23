/**
 *
 * 站点 弹出层
 *
 * Created by liulin on 2017/3/17.
 */


ES.CloudMap.PostPosWnd = ES.CloudMap.PopWnd.extend({

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
        this.cFlag = 'PostPos';
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
        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTreeNode(this, {
                    cBandSel: $('#PostPosType')
                },
                {
                    core: {
                        'animation': 0,
                        'check_callback': true,

                        'state': {'opened': true},
                        'data': {
                            'url': '/hbgps/gisCar/getStationTree',
                        }

                    },
                    plugins: ['types', 'search', 'unique']
                });
        }
        this.oSelectTree.on('selectVal',  this.setVal,this);
    },

    setVal: function (oData) {
        $('#PostPosType').val(oData.text);

        this.cParentId = parseInt(oData.id);
    },

    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener( this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    check: function () {

        if (!$('#PostPosName').val()) {
            ES.aWarn('请录入站点名称！');
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
            CloudName: $('#PostPosName').val(),
            CloudNo: $('#PostPosNo').val(),
            CloudType: 1,
            Map: this.oBusData.oInfo,
            Source: 1,
            DeptId: (this.cParentId || '0'),
            MapType: 10,
        };

        ES.getData(JSON.stringify(oParam), '/hbgps/gisCar/addStation', this.saveHandler, this, {nId: oParam.Id});
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

        this._oParent.on('CloudMap:PopWnd.show', this.showModal, this);
        this._oParent.on('CloudMap:PopWnd.editShow', this.editShow, this);
        this._oParent.on('CloudMap:PopWnd.setPos', this.setPos, this);
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

        $('#PostPosNo').val(oData.oBusData.cId);
        $('#PostPosNo').attr('disabled',true);
        $('#PostPosName').val(oData.oBusData.cName);
        $('#PostPosType').val(oData.oBusData.cParentText);
        this.oBusData = {};
        this.oBusData.Id =1;
        this.oBusData.oInfo = oData.oInfo;
        this.cParentId = oData.oBusData.cParentId;

        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = oData.oPos;

        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        $('#PostPosName').val('');
        $('#PostPosType').val('');
        $('#PostPosNo').val('');
        $('#PostPosNo').removeAttr('disabled');
        this.oBusData = oData;
        this.oBusData.Id = 0;
        this.$_oContainer.show();

    },

});

// 树的选择初始化
ES.CloudMap.PostPosWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box  PostPosPopWnd"   style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">站点编码：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="PostPosNo" name="form-sitename" placeholder="请输入编码" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">站点名称：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="PostPosName" name="form-sitename" placeholder="请输入名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+
    '    <li class="ec-form-group">'+
    '    <label for="form-selectDate" class="ec-u-sm-4 ec-form-label">类型：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="PostPosType" name="form-sitename"  placeholder="请输入类型" class="ec-form-field ec-radius ec-input-sm">'+
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

