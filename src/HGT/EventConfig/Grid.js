/**
 * Created by exsun on 2017-01-12.
 */

ES.HGT.EventConfig.Grid = ES.Class.extend({


    oOption: {
        // 容器
        cContainer: '.ex-layout-content',
        // grid id
        cGridContainer: 'dtGridContainer',
        // 分页菜单id
        cPagerContainer: 'dtGridToolBarContainer',

        bAjaxLoad: false,
        cUrl: null,

        oDefaultParam: {},

        oJqGridOption: {
            url: '/EventType/Query',
            mtype: "POST",
            datatype: "json",
            multiselect: false,
            viewrecords: true,
            recordtext: '查询出 {2} 条记录， ',
            width: 600,
            height: 500,
            subGrid: true,
            subGridRowExpanded: null,
            rowNum: 20,
            rowList: [20, 30, 50],
            serializeGridData: function (data) {
                return JSON.stringify(data);
            },
            postData: { exparameters:  {} },

            jsonReader: {
                root: "dataList",
            },
            subGridOptions: {
                // load the subgrid data only once
                // and the just show/hide
                reloadOnExpand: false,
                // select the row when the expand column is clicked
                selectOnExpand: true
            },

        }
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);

        this._oParent = oParent;

        this.aoCol = [];
        this.setColumns();
        this.initOn();
        this.initUI();

        this.oSearchInput=$('#form-event-type-name');
        this.oSearvhBtn=$('#form-event-type-search');

        this.oJqGridOption = {};

        var self =this;
        ES.extend(
            this.oJqGridOption,
            this.oOption.oJqGridOption,
            {
                width: this.oOption.nWidth,
                height: this.oOption.nHeight,
            },
            {
                subGridRowExpanded: function (parentRowID, parentRowKey) {
                    var childGridID = parentRowID + "_table";
                    var childGridPagerID = parentRowID + "_pager";
                    var oRow = self.gridData.dataList[parseInt(parentRowKey) - 1];
                    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');
                    $("#" + childGridID).jqGrid({
                        url: '/ConfigEvent/Query',
                        mtype: "POST",
                        datatype: "json",
                        subGrid: false,
                        serializeGridData: function (data) {
                            return JSON.stringify(data);
                        },
                        postData: { exparameters:  {EventTypeId:oRow.Id} },
                        jsonReader: {
                            root: "dataList",
                        },
                        page: 1,
                        colModel: [
                            {label: '标签', name: 'TagName',  align: 'center'},
                            {label: '配置名称', name: 'ConfigName', width: 200, align: 'center'},
                            //{label: '违规说明', name: 'ViolationDesc', align: 'center'},
                            {label: '时限', name: 'OrderDate', align: 'center',formatter: function (val, opt, item) {
                                var cHtml =item.TimeStart+ '-'+item.TimeEnd
                                return cHtml;
                            }},
                            {label: '案件说明', name: 'CaseDes', align: 'center'},

                            {label: '最大处置时间', name: 'MaxHandleTime', align: 'center'},

                            {label: '扣分单位', name: 'TimeUnit', align: 'center', formatter: function (val, opt, item) {
                                var _checkhtml = '';
                                //假数据
                                //var _num = Math.round(Math.random() * 1);
                                if (item.TimeUnit === 1) {
                                    _checkhtml = '分'
                                } else if (item.TimeUnit === 2) {
                                    _checkhtml = '小时'
                                }
                                else {
                                    _checkhtml = '天'
                                }
                                return _checkhtml;
                            }},

                            {label: '扣分分数', name: 'Score', align: 'center'},
                            {
                                label: "操作",
                                name: "actions",
                                width: 250,
                                align: 'center',
                                formatter: function (val, opt, item) {
                                    var content = '';
                                    content += '<button class="ec-btn ec-btn-xs ec-btn-default addC"><i class="ec-icon-plus addC"></i>复制</button>';
                                    content += '  ';
                                    content += '<button class="ec-btn ec-btn-xs ec-btn-default editC"><i class="ec-icon-edit editC"></i>编辑</button>';
                                    content += '  ';
                                    content += '<button class="ec-btn ec-btn-xs ec-btn-danger delC"><i class="ec-icon-trash-o delC"></i>删除</button>';
                                    return content;
                                }
                            }
                        ],
                        multiselect: false,
                        width: $("#" + childGridID).width(),
                        viewrecords: true,
                        recordtext: '查询出 {2} 条记录， ',
                        height: '100%',
                        rowNum: 20,
                        rowList: [20, 30, 50],
                        pager: "#" + childGridPagerID,

                        onSelectRow: function (cId,d,e) {
                            var record = $(this).data('oData').dataList[parseInt(cId) - 1];
                            self.initClick(e, record);
                        },

                        loadComplete: function (data) {
                            //缓存数据到控件
                            $(this).data('oData',data);
                        },
                    });
                },


                onSelectRow: function (cId,d,e) {
                    var record =$(this).data('oData').dataList[parseInt(cId) - 1]; //$(this).jqGrid('getRowData',parseInt(cId));
                    self.initClick(e, record);
                },
                colModel: this.aoCol,
                pager: '#' + this.oOption.cPagerContainer,
                loadComplete: function (data) {
                    self.gridData = data;
                    //缓存数据到控件
                    $(this).data('oData',data);
                },
            });

        this.reflesh(this.oOption.nWidth,this.oOption.nHeight);

        this.initGrid();

        this.initEvent();


        $('.ec-radio-inline>input#qualificationAll').attr("checked",true);

    },

    // 外层大grid 和里成
    initClick: function (e, oModel) {
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('edit')) {
            this._oParent.fire('editEventType', {oModel: oModel});
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.fire('delEventType', {oModel: oModel});
        }

        if ($(e.target).hasClass('addEC')) {
            // 添加下级孩子
            this._oParent.fire('addConfig', {oModel: {EventTypeId:oModel.Id,EventTypeName:oModel.EventTypeName}});
        }

        // 编辑
        if ($(e.target).hasClass('editC')) {
            this._oParent.fire('editConfig', {oModel: oModel});
        }
        // 删除
        if ($(e.target).hasClass('delC')) {
            this._oParent.fire('delConfig', {oModel: oModel});
        }
        // 复制添加
        if ($(e.target).hasClass('addC')) {
            //var oTemp = {};
            //ES.extend(oModel, oModel);
            //delete oTemp.Id;
            // 添加下级孩子
            this._oParent.fire('copyConfig', {oModel: oModel});
        }

    },

    initUI: function () {
        var oGrid = $(this.oOption.cContainer).find('#' + this.oOption.cGridContainer);

        if (!oGrid || oGrid.length <= 0) {
            $(this.oOption.cContainer).append('<table id="' + this.oOption.cGridContainer + '" class="dt-grid-container"></table>');
            $(this.oOption.cContainer).append('<div id="' + this.oOption.cPagerContainer + '" class="dt-grid-toolbar-container"></div>');
        }

        this.$_oGrid = $(this.oOption.cContainer).find('#' + this.oOption.cGridContainer);



    },

    // 监听外部事件
    initOn: function () {
        // 查询数据
        this._oParent.on("jqGrid.query", this.query, this);
    },

    // 初始化grid界面
    initGrid: function () {
        //var self = this;
        this.oJqGrid = $('#' + this.oOption.cGridContainer).jqGrid(this.oJqGridOption);

    },

    // 获得相关的列数据,可以重新
    setColumns: function () {

        var aoCol = [
            //{label: '编号', name: 'Id',  editable: true, align: 'center'},
            {label: '名称', name: 'EventTypeName', editable: true, width: 200, align: 'center'},
            {label: '最大处置时间', name: 'MaxDealTime', align: 'center'},
            {
                label: '单位', name: 'Unit', align: 'center', formatter: function (val, opt, item) {
                var _checkhtml = '';
                //假数据
                //var _num = Math.round(Math.random() * 1);
                if (item.Unit === 1) {
                    _checkhtml = '分'
                } else if (item.Unit === 2) {
                    _checkhtml = '小时'
                }
                else {
                    _checkhtml = '天'
                }
                return _checkhtml;
            }
            },

            {label: '最大评分', name: 'MaxScore', align: 'center'},

            {label: '自动结案', name: 'IsAutoClose', editable: true, align: 'center', formatter: function (val, opt, item) {
                var _checkhtml = '';
                //假数据
                //var _num = Math.round(Math.random() * 1);
                if (item.IsAutoClose == 1) {
                    _checkhtml = '<input type="checkbox" checked  disabled="disabled" />'
                } else {
                    _checkhtml = '<input type="checkbox" disabled="disabled" />'
                }
                return _checkhtml;
            }},
            {label: '案件上报', name: 'IsEventReport', editable: true, align: 'center', formatter: function (val, opt, item) {
                var _checkhtml = '';

                if (item.IsEventReport == 1) {
                    _checkhtml = '<input type="checkbox" checked  disabled="disabled" />'
                } else {
                    _checkhtml = '<input type="checkbox"  disabled="disabled" />'
                }
                return _checkhtml;
            }},

            {label: '日常考核', name: 'IsAutoCheck', editable: true, align: 'center', formatter: function (val, opt, item) {
                var _checkhtml = '';

                if (item.IsAutoCheck == 1) {
                    _checkhtml = '<input type="checkbox" checked  disabled="disabled" />'
                } else {
                    _checkhtml = '<input type="checkbox" disabled="disabled" />'
                }
                return _checkhtml;
            }},

            {
                label: "操作",
                name: "actions",
                width: 450,
                align: 'center',
                formatter: function (val, opt, item) {
                    var content = '';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default addEC"><i class="ec-icon-plus addEC"></i>  新增</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default edit" ><i class="ec-icon-edit edit"></i>  编辑</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-danger del"><i class="ec-icon-trash-o del"></i>  删除</button>';
                    return content;
                }
            }
        ];

        this.aoCol = aoCol;

    },



    // 触发后台查询
    query: function (oData) {

        var postData = this.oJqGrid.jqGrid("getGridParam", "postData");
        if(!postData.exparameters){
            postData.exparameters ={};
        }
        ES.extend(postData.exparameters, oData.oParam);
        this.oJqGrid.jqGrid("setGridParam", { page: 1, postData: postData }).trigger("reloadGrid");

    },

    reflesh: function (nWidth,nHeight) {
        $(this.oOption.cContainer).css({width:nWidth, height:nHeight});
        this.$_oGrid.css({width:nWidth, height:nHeight});
    },

});

// 对查询控件的包装
ES.HGT.EventConfig.Grid.include({


    initEvent:function() {
        var self = this;


        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var oParam = {EventTypeName: cSearchVal};

            var cVal = $('.ec-radio-inline>input.ec-ucheck-radio:radio:checked').val();

            if (cVal !== '-1') {

                oParam.IsAutoClose = parseInt(cVal);
            }
            else
            {
                oParam.IsAutoClose=''
            }
            // 触发查询
            self.query({oParam: oParam});

        });

    },



})