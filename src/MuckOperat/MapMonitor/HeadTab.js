/**
 * Created by liulin on 2016/11/24.
 *
 * 控制 样式文件
 * 构建头部
 *
 */

ES.MuckOperat.MapMonitor.HeadTab = ES.Class.extend({

    oOption: {
        cParentDivId: 'CarDetail',
        oUIConfig: {
            div: {
                'class': 'car-detail-box',
                a: {
                    href: '#Map',
                    cid: 'aCloseid',
                    'class': 'detail-close close',
                    'data-toggle': 'tab',
                    i: {'class': 'glyphicon glyphicon-remove'}
                },
                div: [
                    {
                        'class': 'car-detail-info',
                        h2: {
                            cId: 'VehId',
                            span: {
                                'class': 'car-staut online',
                                i: {html: '4'}
                            },
                            div: {
                                html: '',
                                'class': 'pull-left'
                            },
                            //a: { cid: 'aDetailInfo', 'class': 'btn btn-sm btn-success', html: '更多详情', style: 'margin:11px 10px;' }
                        },
                        ul: {
                            'class': 'car-info',
                            li: [{
                                style: 'width:100%',
                                label: {'class': 'control-label', html: '所属公司：'},
                                div: {
                                    cId: 'companyName',
                                    'class': 'tag-name',
                                    span: {html: ''}
                                }
                            }
                                //{
                                //    label: { 'class': 'control-label', html: '车主姓名：' },
                                //    div: {
                                //        cId: 'ownersName',
                                //        'class': 'tag-name',
                                //        span: { html: '' }
                                //    }
                                //},
                                //{
                                //    label: { 'class': 'control-label', html: '司机姓名：' },
                                //    div: {
                                //        cId: 'driveName',
                                //        'class': 'tag-name',
                                //        span: { html: '' }
                                //    }
                                //},
                                //{
                                //    label: { 'class': 'control-label', html: '联系电话：' },
                                //    div: {
                                //        cId: 'Phone',
                                //        'class': 'tag-name',
                                //        span: { html: '' }
                                //        //span: {
                                //        //    a: {
                                //        //        cId: 'Phone',
                                //        //        href: '',
                                //        //        //style: 'color:#fff',
                                //        //        i: { 'class': 'fa fa-phone' },
                                //        //        span: { html: '' }
                                //        //    }
                                //        //}
                                //    }
                                //}
                            ],
                        }
                    },
                    {
                        'class': 'car-detail-nav',
                        ul: {
                            li: [
                                {
                                    'class': 'active',
                                    cid: 'MapTab',
                                    a: {href: '#Map', title: '监控地图', 'data-toggle': 'tab', html: '监控地图'}
                                },
                                {
                                    cid: 'liRealTab',
                                    a: {href: '#CarState', title: '实时状态', 'data-toggle': 'tab', html: '实时状态'}
                                },

                                {
                                    cid: 'liVehTab',
                                    a: {href: '#VehDetail', title: '车辆详情', 'data-toggle': 'tab', html: '车辆详情'}
                                },
                                {
                                    cid: 'liEntTab',
                                    a: {href: '#EntInfo', title: '企业信息', 'data-toggle': 'tab', html: '企业信息'}
                                },
                                {
                                    cid: 'liLineTab',
                                    a: {href: '#LineInfo', title: '审批路线', 'data-toggle': 'tab', html: '审批路线'}
                                },
                                {
                                    cid: 'liSiteTab',
                                    a: {href: '#SiteInfo', title: '运输过程', 'data-toggle': 'tab', html: '运输过程'}
                                },

                                {
                                    id: 'SetId',
                                    a: {href: '#DeviceControl', title: '设备控制', 'data-toggle': 'tab', html: '设备控制'}
                                },

                                {
                                    cid: 'liChangeTab',
                                    a: {href: '#ChangeInfo', title: '变更信息', 'data-toggle': 'tab', html: '变更信息'}
                                },
                                {
                                    cid: 'liInvTab',
                                    a: {href: '#InvInfo', title: '违法记录', 'data-toggle': 'tab', html: '违法记录'}
                                },

                                {
                                    cid: 'liSetTab',
                                    a: {href: '#SetInfo', title: '设备信息', 'data-toggle': 'tab', html: '设备信息'}
                                },
                                {
                                    cid: 'liInstallTab',
                                    a: {href: '#InstallInfo', title: '安装信息', 'data-toggle': 'tab', html: '安装信息'}
                                },

                                {
                                    cid: 'liStatsTab',
                                    a: {href: '#CarCount', title: '统计分析', 'data-toggle': 'tab', html: '统计分析'}
                                },
                            ]
                        }
                    }
                ]
            }
        }
    },

    // 构造函数
    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);

        this.initUI();

        this.initEven();

        this._initOn();

    },

    _initOn: function () {

        this._oParent.on('MV:MapFrameTab.switchShowVeh', this.switchShowVeh, this);

    },

    _getWidth: function () {
        this._oParent.width() - 268;
    },

    initUI: function () {
        var oContainer = $(ES.MuckOperat.Config.cDivTag);
        oContainer.attr('id', this.oOption.cParentDivId);
        oContainer.css({'width': this._getWidth()});

        this._oParent.oDivHeader.append(oContainer);
        ES.Util.initTag(oContainer, this.oOption.oUIConfig);

        this.oContainer = oContainer;
        // 设置表头的大小
        this.oContainer.hide();
    },

    //绑定事件方法
    initEven: function () {
        var self = this;

        //$('a[cid="aDetailInfo"]').bind('click', this, this.vehTab);

        $('a[cid="aCloseid"]').bind('click', this, this.hidTab);

        //给li绑定事件，当点击
        $('.car-detail-nav').find('li').bind('click', this, function () {
            var oTemp = {liName: $(this).attr('cid'), cDevId: self.oOption.cDevId, cVehNo: self.oOption.cVehNo};
            self._oParent.fire('MV:VehTab.refleshPage', oTemp);

        });
    },

    ////点击详细信息事件
    //vehTab: function (e) {
    //    //打开弹出层
    //    var wind = $('#mainShow').kendoWindow({
    //        modal: true,
    //        resizable: false,
    //        //content: '/MapMonitor/FatigueDriving',
    //        //title:
    //        content: '/MapMonitor/VehicleDetail',
    //        width: 1000,
    //        height: 480
    //
    //    }).data('kendoWindow').open().center();
    //    wind.title('更多详情-' + e.data.oOption.cVehNo);
    //    //获取车辆详细信息数据
    //    $.post('/MapMonitor/_VehicleInfo', {strVeh: e.data.oOption.cVehNo}, function (ret) {
    //        //车辆信息的html代码
    //        $('#tab-content-1').html(ret);
    //        //车辆信息保存按钮事件
    //        $('#btnSave').bind('click', this, function () {
    //            var options = {
    //                url: '/MapMonitor/VehicleInfoSave',
    //                type: 'post',
    //                dataType: 'json',
    //                data: $('#frmVehicleInfo').serialize(),
    //                success: function (retData) {
    //                    if (retData.success) {
    //                        //$.MsgBox.success('车辆详细信息修改成功！', function () {
    //                        $('#mainShow').data('kendoWindow').close();
    //                        //});
    //                    }
    //                    else {
    //                        //$.MsgBox.error('提示', retData.msg);
    //                    }
    //                }
    //            };
    //            $.ajax(options);
    //        });
    //        //车辆信息取消按钮事件
    //        $('#btnCancel').bind('click', this, function () {
    //            $('#mainShow').data('kendoWindow').close();
    //        });
    //        //点击设备详细信息tab页事件
    //        $('#tabDevInfo').bind('click', this, function () {
    //            // 获取设备详细信息数据
    //            $.post('/MapMonitor/_DeviceInfo', {strVeh: e.data.oOption.cVehNo}, function (retData) {
    //                $('#tab-content-2').html(retData);
    //            });
    //        });
    //        //点击单位详细信息tab页事件
    //        $('#tabComInfo').bind('click', this, function () {
    //            // 获取设备详细信息数据
    //            //$.post('/MapMonitor/_CompanyInfo', { strVeh: e.data.oOption.cVehNo }, function (retData) {
    //            //    $('#tab-content-3').html(retData);
    //            //});
    //
    //            $.post('/MapMonitor/_CompanyInfo', {entId: $('div[cid="companyName"]').attr('entid')}, function (retData) {
    //                $('#tab-content-3').html(retData);
    //            });
    //        });
    //        //点击车辆驾驶员tab页事件
    //        $('#tabVehDriInfo').bind('click', this, function () {
    //            var deptId = -1;
    //            //单位树形组织结构
    //            if ($.trim($('#structureEnt').html()) === '') {
    //                var tree = $('#structureEnt').deptTree({
    //                    checkbox: false,
    //                    onLoad: function (k_ds) {
    //                        var rootData = deptId === -1 ? k_ds.view()[0] : k_ds.get(deptId);
    //                        if (rootData) {
    //                            var rootNode = tree.k_tree.findByUid(rootData.uid);
    //                            tree.k_tree.select(rootNode);
    //                        }
    //                    },
    //                    onClick: function (item, ele) {
    //                        deptId = item.id;
    //                        kdSource.setSeachParameters('deptId', deptId);
    //                        kdSource.queryExt();
    //                    }
    //                }).data('deptTree');
    //            }
    //
    //            $.post('/Driver/GetDriverList', {strVehicle: e.data.oOption.cVehNo}, function (retData) {
    //                for (var i in retData) {
    //                    if ($('li[vid="' + retData[i].Id + '"]').size() <= 0) {
    //                        var $li = $('<li vid="' + retData[i].Id + '">' + retData[i].Name + '(' + retData[i].PhoneNum + ')' +
    //                            '<i class="fa fa-times-circle"></i></li>');
    //                        //绑定右边驾驶员标签移除事件
    //                        $li.bind('click', function () {
    //                            var vid = $(this).attr('vid');
    //                            $(this).remove();
    //
    //                            $('input[name="selValue"][cid="' + vid + '"]').removeAttr('checked');
    //                            $('#CarNum').html($('#driSpeed li').length);
    //                        });
    //                        $('#driSpeed').append($li);
    //                    }
    //                }
    //            });
    //
    //
    //            //驾驶员列表数据
    //            var kdSource = new kendoSource('/Driver/ListPaging', 20, 'Id');
    //            //表单
    //            var kgrid = new kendoGridExt('divGridSelectVehicle', kdSource.dtSource);
    //            kgrid.setToolBar('search-divGridSelectVehicle');
    //            kgrid.setColumnsForHeaderTemplate('<input type="checkbox"  id="check-all" />', '32px', function (item) {
    //                var cChecked = '';
    //                if ($('li[vid="' + item.Id + '"]').size() > 0) {
    //                    cChecked = 'checked="checked"';
    //                }
    //
    //                return '<input cid="' + item.Id + '" type="checkbox" data-bind="checked: ' + item.Id + '" name="selValue" ' + cChecked + ' />';
    //            });
    //            kgrid.setColumns('Name', '驾驶员姓名');
    //            kgrid.setColumns('Name', '所属单位');
    //            kgrid.setColumns('DrivingNumber', '驾驶证号');
    //            kgrid.setColumns('CardNumber', '身份证号');
    //            kgrid.setColumns('PhoneNum', '手机号');
    //            kgrid.setColumns('StrSex', '性别');
    //            kgrid.setHeight(498);
    //            kgrid.load();
    //            //绑定驾驶员列表中每行的checkbox事件
    //            kgrid.Grid.data('kendoGrid').bind('dataBound', function (ev) {
    //                $('input[name="selValue"]').bind('click', this, function (ve) {
    //                    //获取点击当前行数据
    //                    var dataRow = ve.data.dataSource.get($(this).attr('cid'));
    //                    //判断checkbox是否被选中
    //                    if ($(this).is(':checked')) {
    //                        var $li = $('<li vid="' + dataRow.Id + '">' + dataRow.Name + '(' + dataRow.PhoneNum + ')' + '<i class="fa fa-times-circle"></i></li>');
    //                        //绑定右边驾驶员标签移除事件
    //                        $li.bind('click', function () {
    //                            var vid = $(this).attr('vid');
    //                            $(this).remove();
    //
    //                            $('input[name="selValue"][cid="' + vid + '"]').removeAttr('checked');
    //                            $('#CarNum').html($('#driSpeed li').length);
    //                        });
    //                        $('#driSpeed').append($li);
    //                    } else {
    //                        $('#driSpeed li[vid="' + dataRow.Id + '"]').remove();
    //                    }
    //                    $('#CarNum').html($('#driSpeed li').length);
    //                });
    //            });
    //            //驾驶员列表标题栏中的checkbox事件
    //            $('#check-all').bind('click', this, function () {
    //                //判断checkbox是否被选中
    //                if ($(this).is(':checked')) {
    //                    $('input[name="selValue"]').each(function () {
    //                        if (!$(this).is(':checked')) {
    //                            $(this).click();
    //                        }
    //
    //                    });
    //                }
    //                else {
    //                    $('input[name="selValue"]').each(function () {
    //                        $(this).removeAttr('checked');
    //                        $('#driSpeed li[vid="' + $(this).attr('cid') + '"]').remove();
    //                    });
    //                }
    //                $('#CarNum').html($('#driSpeed li').length);
    //
    //            });
    //            //查询按钮事件
    //            $('#btnSelectVehicleQuery').click(function () {
    //                kdSource.setSeachParameters('_DriverName', $('#_DriverName').val());
    //                kdSource.queryExt();
    //            });
    //            //清空按钮事件
    //            $('#_btnClearDev').click(function () {
    //                var lis = $('#driSpeed li');
    //                //遍历右边已选驾驶员
    //                lis.each(function () {
    //                    var vid = $(this).attr('vid');
    //                    $(this).remove();
    //
    //                    $('input[name="selValue"][cid="' + vid + '"]').removeAttr('checked');
    //
    //                });
    //                $('#CarNum').html($('#driSpeed li').length);
    //                $('#check-all').removeAttr('checked');
    //            });
    //            //保存按钮事件
    //            $('#btnSelectVehicleOk').click(function () {
    //                var lis = $('#driSpeed li');
    //                var acVehId = [];
    //                //遍历右边已选驾驶员
    //                lis.each(function () {
    //                    acVehId.push($(this).attr('vid'));
    //                });
    //                //提交数据
    //                $.post('/Driver/BindVehicleDriver', {
    //                    strVehicle: e.data.oOption.cVehNo,
    //                    inDriver: acVehId
    //                }, function (retData) {
    //                    if (retData.success) {
    //                        $.MsgBox.success('车辆驾驶员保存成功！', function () {
    //                            $('#mainShow').data('kendoWindow').close();
    //                        });
    //                    } else {
    //                        $.MsgBox.error('提示', retData.msg);
    //                    }
    //                });
    //            });
    //
    //        });
    //        //车辆附加信息
    //        $('#tabExtInfo').bind('click', this, function () {
    //            $.post('/MapMonitor/_VehExtInfo', {devNo: e.data.oOption.cDevId}, function (retData) {
    //                $('#tab-content-5').html(retData);
    //            });
    //        });
    //    });
    //
    //},

    //值负责显示页面，展示tab页面
    showTab: function (oOption) {
        $.extend(this.oOption, oOption);

        $('body').css('overflow-y', 'scroll');
        //resizeBody();
        $(this.cParentDivJId).closest('.pager-wrapper').slideDown(800);

        this._setGlobalParam();
    },

    //显示车辆信息，包括主题信息，其他设备状态信息
    switchShowVeh: function (oOption) {

        this.showTab(oOption);

        //设备状态切换
        this.oVehStatus.switchVeh(oOption);

        this._switchVehInfo(oOption);

        $('.car-detail-nav').find('li.active').click();
    },

    //隐藏tab页
    hidTab: function (e) {

        //关闭时恢复到地图界面
        $('li[cid="MapTab"]').find('a').click();

        $('body').css('overflow-y', 'hidden');
        //resizeBody();
        $(e.data.cParentDivJId).closest('.pager-wrapper').slideUp(800);

        e.data._oParent.fire('MV:showBox');

        //取消订阅
        e.data._oParent.fire('MV:HubSvr.unSubVehicleById');

        //清除订阅图标
        e.data._oParent.fire('MV:Real.clearLiveTrack');

        //清除围栏
        e.data._oParent.fire('MV:MapBus.clearAllLayer');

        //恢复图标
        e.data._oParent.fire('MV:MapVehMark.recoverAllVehMarker');

    },

    //获取车辆基本信息
    getVehInfo: function (oVeh) {
        $('h2').find('div').html(oVeh.cVehNo);
        $.post('/MapMonitor/GetDetails', {strDeviceNo: oVeh.cDevId}, function (ret) {
            if (ret) {
                //车牌号码
                $('h2').find('div').html(ret.VehicleNo);
                //公司名称
                $('div[cId="companyName"]').attr('entId', ret.CompanyId).find('span').html(ret.CompanyName);
                $('div[cId="ownersName"]').find('span').html(ret.VehicleMaster);
                $('div[cId="driveName"]').find('span').html(ret.DriveName);
                if (ret.ContactPhone !== null && ret.ContactPhone !== '') {
                    $('div[cId="Phone"]').find('span').html('<a href="tel://' + ret.ContactPhone + '"><i class="fa fa-phone"></i>' + ret.ContactPhone + '</a>');
                }
            }
        });
    },


    //车辆信息切换
    _switchVehInfo: function (oOption) {
        $('h2[cid="VehId"]').find('i').html(oOption.cIndex);
        $('h2[cid="VehId"]').find('span').removeClass('online').addClass(oOption.cClass);
        this.getVehInfo(oOption);
    },

    //全局变量的赋值
    _setGlobalParam: function () {
        //g_cDevNo = this.oOption.cDevId;
        //g_cVehNo = this.oOption.cVehNo;
        //$.ajax({
        //    type: 'POST',
        //    url: '/MapMonitor/TotalInfo',
        //    data: {deviceNo: g_cDevNo},
        //    dataType: 'json',
        //    success: function (e) {
        //        if (e.IsSuccess === true) {
        //            //g_cVehId = e.ReturnValue.VehicleId;
        //            //g_cDevId = e.ReturnValue.DevId;
        //        }
        //    }
        //});
    },

});