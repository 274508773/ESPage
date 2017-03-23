/**
 * 此应用 与邮局的项目中，添加局站 来 绘制线路
 *
 * 单独做成组件
 * Created by liulin on 2017/3/16.
 */


ES.CloudMap.CreatePos = ES.Evented.extend({

    oOption: {
        // 树的ur
        cUrl: '',
        // 外层容器
        cDivContainer: '.tree-layout-map',

        cCheckUrl: '',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
        // 监听事件，对外接口
        cEventName: 'cPermission',
        cFlag: 'PostPos',
    },


    oTreeOption: {
        // 树的url
        //cTreeUrl: '',
        // 树所用的插件
        //acPlugin: ['checkbox', 'types', 'search', 'state', 'unique'],
        // 树的check数据来源
    },

    initialize: function (oParent, oOption) {
        // 当前面板
        this._oParent = oParent;

        this.cFlag = this.oOption.cFlag;
        ES.setOptions(this, oOption);


        this._oDrawLayer = oOption.oDrawLayer;

        this._oPage = oParent._oParent;
        this._oMap = this._oPage.getMap();

        if (typeof this.oOption.cDivContainer === 'object') {

            // 父亲级容器
            this.$_oPContainer = this.oOption.cDivContainer;
        }
        else {
            this.$_oPContainer = $(this.oOption.cDivContainer);
        }

        this.initOn();

        // 初始化界面
        this.initUI();

        // 初始化grid
        this.initGrid();

        // 初始化树控件
        this.initSelectTree();

        this.initPen();

        // 业务数据
        this.oBusData = {id: 0};
    },

    // 添加grid
    initGrid: function () {

        this.oGrid = new ES.Common.DtGrid(this, {
                cGridContainer: 'dtGridpwContainer',
                cPagerContainer: 'dtGridpwToolBarContainer',
                cContainer: this.$_oContainer
            },
            [
                {
                    id: 'text',
                    title: '站点',
                    type: 'string',
                    columnClass: 'text-center'
                },
                {
                    id: 'operation',
                    title: '操作',
                    type: 'string',
                    columnClass: 'text-center grid-blue',
                    resolution: function (value, record, column, grid, dataNo, columnNo) {
                        var content = '';
                        //content += '<a  href="javascript:void(0);" title="添加" ><i class="ec-icon-eye"></i></a>';
                        //content += '&nbsp;&nbsp;';
                        //content += '<a  href="javascript:void(0);" title="下移"><i class="ec-icon-link"></i></a>';
                        //content += '&nbsp;&nbsp;';
                        content += '<a  href="javascript:void(0);" title="删除"><i class="ec-icon-trash"></i></a>';
                        return content;
                    }
                }]);


        this.oGrid.initClick = function (e, record) {
            // 点击删除节点
            if (e.target.className === "ec-icon-trash") {

                if (!this._aoData || this._aoData.length <= 0) {
                    return;
                }

                for (var i = this._aoData.length - 1; i >= 0; i--) {
                    if (this._aoData[i].id == record.id) {
                        this._aoData.splice(i, 1);
                    }
                }

                if (this) {
                    // 重新加载内存中的数据
                    this.dtGrid.reload(true);
                }
            }
        }

    },

    initSelectTree: function () {
        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTreeNode(this, {
                    // 选择节点有要求时，必须给值
                    cSelCls: '',
                    cBandSel: $('#' + this.cFlag + 'TreeSelect')
                },
                {
                    core: {
                        'animation': 0,
                        'check_callback': true,

                        'state': {'opened': true},
                        'data': {
                            'url': '/hbgps/gisCar/getStationTree',
                        }

                    }
                });
        }
        this.oSelectTree.on('selectVal', this.setVal, this);
    },

    setVal: function (oData) {
        $('#' + this.cFlag + 'TreeSelect').val(oData.text);

        this.oNode = oData;
    },

    initOn: function () {

        this._oParent.on('CloudMap:CreatePos.show', this.show, this);
        this._oParent.on('CloudMap:CreatePos.hide', this.hide, this);

        this._oParent.on('CloudMap:EditTool.SaveEdit', this.saveEdit, this);


        //this._oParent.on('CloudMap:' + this.oOption.cFlag + 'TagTree.addRow', this.addRow, this);

        var self =this;
        this._oMap.on('draw:edited', function (e) {

            if(!self._oParent.getActive()){
                return
            }

            var oMap = this;
            var aoLayer = e.layers;

            aoLayer.eachLayer(function (oLayer) {

                var aoLatLng = oLayer.getLatLngs();

                var oInfo = {
                    aoLatLng: aoLatLng,
                    oOption: {},
                };

                self._oDrawLayer.addLayer(oLayer);

                // 弹出层显示的位置信息
                var oPos = oMap.latLngToLayerPoint(aoLatLng[0]);

                // 告诉外面弹出层的位置
                self._oParent.fire('CloudMap:PopWnd.showPostLine', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oBusData:oLayer.oBusData
                });
            });
        });


    },

    // 保存编辑
    saveEdit: function () {
        this.oPen.handler.save();
        this.oPen.handler.disable();
    },

    // 添加数据到本地
    addRow: function (aoData) {
        self.oGrid.addRows(aoData);
    },

    reflesh: function () {
        if (!this.oPopTree) {
            return;
        }
        //this.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
        this.oPopTree.$_oTree.refresh();
    },


    // 显示界面
    initUI: function () {

        var oTemp = $(ES.template(this.cHtml, {cFlag: this.cFlag})).addClass(this.cFlag);
        this.$_oPContainer.append(oTemp);
        this.$_oContainer = oTemp;

        // 确定按钮
        this.oBtnConfirm = this.$_oContainer.find('.ec-btn-success');
        this.oBtnDel = this.$_oContainer.find('.ec-btn-secondary');
        // 添加点按钮
        this.oBtnAddPos = this.$_oContainer.find('.ex-postway-info-btn>a');

        // 给按钮添加时间
        this.initAddPosEvent();

        this.setParentEvent();
    },


    addLine: function (aoPos) {
        var oLine = L.polyline(aoPos, {});
        oLine.edited = true;
        oLine.oBusData = this.oBusData;
        oLine.addTo(this._oDrawLayer);
        this._oMap.fitBounds(this._oDrawLayer.getBounds());
    },

    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    show: function (oData) {
        if (this.$_oContainer) {
            this.$_oContainer.show();
        }
        else {

            this.initUI();
            this.$_oContainer.show();
        }


    },

    hide: function (oData) {
        if (!this.$_oContainer) {
            return;
        }
        this.$_oContainer.hide();
    },

    // 编辑线
    initPen: function () {
        this.oPen =
        {
            enabled: this.oPenStyle,
            handler: new L.EditToolbar.Edit(this._oMap, {
                featureGroup: this._oDrawLayer,
                selectedPathOptions: {
                    dashArray: '10, 10',
                    fill: true,
                    fillColor: '#fe57a1',
                    fillOpacity: 0.1,
                    maintainColor: false
                },
                poly: {allowIntersection: false}
            }),
            title: ''
        }

    },

});

// 界面设置 及界面事件
ES.CloudMap.CreatePos.include({

    // 添加在面板的点信息
    cHtml:'<div class="ex-maptool-box ex-maptool-box-white ex-maptool-postway ec-padding-0" style="display: none;">'+
    '                       <div class="ex-layout-sider ex-theme-tree ec-fl">'+
    '                           <h3 class="ex-theme-sider-title">'+
    '                               <i class="ec-icon-sitemap"></i>&nbsp;邮送路线图'+
    '                               <a class="ex-maptool-postway-close">×</a>'+
    '                           </h3>'+
    '                           <div class="ex-layout-postway-box">'+
    '                               <div class="ex-postway-info">'+
    '                                   <div class="ec-form-group">'+
    '                                       <label for="form-selectDate" class="ec-u-sm-4 ec-form-label">交接点名称：</label>'+
    '                                       <div class="ec-u-sm-8">'+
    '                                         <input type="text" name="form-sitename" id="{cFlag}TreeSelect" placeholder="请输入交接点名称" class="ec-form-field ec-radius ec-input-sm">'+
    '                                      </div>' +
    '                                   </div>'+
    '                                   <div class="ex-postway-info-btn">'+
    '                                       <a href="javascript:void(0);" class="ec-btn ec-btn-sm ec-btn-primary ec-radius"><i class="ec-icon-plus"></i> 添加到队列</a>'+
    '                                   </div>'+
    '                               </div>'+
    '                               <div class="ex-postway-way">'+
    '                                   <div id="dtGridpwContainer" class="dt-grid-container" style="width:100%;height:225px;"></div>'+
    '                                   <div id="dtGridpwToolBarContainer" class="dt-grid-toolbar-container"></div>'+
    '                               </div>'+
    '                               <div class="ec-form-group ec-text-right ec-margin-right-sm ec-margin-top-0">'+
    '                                   <a href="javascript:void(0);" class="ec-btn ec-btn-sm ec-btn-success ec-radius">确定</a>'+
    '                                   <a href="javascript:void(0);" class="ec-btn ec-btn-sm ec-btn-secondary ec-radius">删除</a>'+
    '                               </div>'+
    '                           </div>'+
    '                       </div>'+
    '           </div>',


    // 添加点
    initAddPosEvent: function () {
        var self = this;
        this.oBtnAddPos.bind('click', function () {
            if (!self.oNode) {
                return;
            }
            // 添加数据到grid中
            // 判断是否添加重复数据
            if (ES.Util.isInArray(self.oGrid._aoData, self.oNode, 'text')) {
                ES.aWarn('添加重复点，请重新选择!')
                return;
            }

            self.oGrid.addRows([self.oNode]);
        });

        // 添加事件
        this.oBtnConfirm.bind('click', function () {
            if (self.oGrid._aoData.length <= 1) {
                ES.aWarn('油路点的个数必须大于1');
                return;
            }

            // 画线到界面
            var aoLatLng = self.oGrid._aoData.map(function (oItem) {
                // 使用 海拔来标记点 是否可以编辑
                oItem.data.alt = oItem.id;
                return oItem.data;
            });
            self.oPen.handler.disable();
            self._oParent.clearLayers();

            self.addLine(aoLatLng);

            self.oPen.handler.enable();
            // 显示保存和取消
            self._oParent.addSaveACalToUI();
        });


        this.$_oContainer.find('a.ex-maptool-postway-close').bind('click', function () {
            self.close();
        });


        this.oBtnDel.bind('click', function () {
            // 删除线路数据
            self._oParent.fire('CloudMap:PostLineDelWnd.del',{oModel:self.oBusData});
        });
    },

    close: function () {
        this.oGrid.clearGrid();
        this.oPen.handler.disable();
        this._oParent.clearLayers();
        this._oParent.oDrawTool.removeActive();
        this._oParent.addDrawToUI();
        this.hide();
    },

    calEdit: function () {
        this.oPen.handler.disable();
        this.oGrid.clearGrid();
        this.hide();
    },

    // 设置业务数据
    setBusData:function(oData) {

        this.oBusData = oData;
        this.oPen.handler.disable();
        this._oParent.clearLayers();
        this.addLine(oData.aoLatLng);
        this.oPen.handler.enable();
        // 显示保存和取消
        this._oParent.addSaveACalToUI();
    },

    // 设置gird数据
    setGridData: function (oData) {
        this.oGrid.addRows(oData.aoData,true);
    },



});