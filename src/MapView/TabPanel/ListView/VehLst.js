/**
 * Created by liulin on 2017/2/5.
 *
 * 安装组织架构来加载车辆列表,显示车辆列表，车辆地图显示
 * 没有列表都不相同，自己处理自己的业务数据
 * 如：组织架构列表
 * 如：告警查询列表
 *
 */

ES.MapView.TabPanel.VehLst = ES.Evented.extend({
    // 查询面板控件
    oOption: {
        // 车辆url
        cUrl: '/MapView/QueryVeh',
        cCurPosUrl: '',
        cAttentUrl: '',
        // 面板的最上级容器，不是车辆容器
        cDivContainerSel: '#classContainer',
        // 车辆容器
        cLstContainerSel: '.ex-layout-carlist-content',
        // 查询框容器
        cSearchInputSel: 'input.ec-form-field',
        // 查询btn容器
        cSearchBtnSel: 'button.ec-btn-secondary',

        nPageSize: 15,
    },


    cHtml: '<div class="ex-layout-carlist ex-theme-carlist" style="left: 220px; opacity: 1;"> ' +
    '   <div class="ex-layout-carlist-title ex-theme-carlist-title">' +
    '        <h4 class="ec-align-left">全部车辆</h4> ' +
    '        <a href="javascript:;" class="ex-icon-turn off" ><i class="ec-icon-arrow-circle-left"></i></a> ' +
    '        <a href="javascript:;" class="ex-icon-turn on" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a> ' +
    '   </div> ' +
    '   <div class="ex-layout-carlist-wrap"> ' +
    '       <div class="ex-layout-carlist-search"> ' +
    '           <div class="ec-input-group"> ' +
    '               <input type="text" class="ec-form-field" placeholder="请输入车牌号或设备号"> ' +
    '               <span class="ec-input-group-btn"> ' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs" type="button"><span class="ec-icon-search"></span> </button> ' +
    '               </span> ' +
    '           </div> ' +
    '       </div>' +
    '       <div class="ex-layout-carlist-content"></div> ' +
    '   </div>  ' +
    '   <div class="ex-layout-carlist-page"> ' +
    '       <ul class="ec-pagination ec-pagination-right"> ' +
    '           <li class="ec-disabled"><a href="javascript:;">&laquo;</a></li> ' +
    '           <li class="ec-active"><a href="javascript:;">1</a></li> ' +
    '           <li><a href="javascript:;">2</a></li> ' +
    '           <li><a href="javascript:;">3</a></li> ' +
    '           <li><a href="javascript:;">4</a></li> ' +
    '           <li><a href="javascript:;">5</a></li> ' +
    '           <li><a href="javascript:;">&raquo;</a></li> ' +
    '       </ul> ' +
    '   </div> ' +
    '</div>',

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {

        //this.oTreeOption = oTOption;

        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this._oPage = oParent._oParent;
        this.oLstContainer = null;
        this.oContainer = null;
        this.oSearchInput = null;
        this.oSearvhBtn = null;

        // 部门id数组为空
        this.anDeptId = null;

        // 初始化界面
        this.initOn();

        if (typeof this.oOption.cDivContainerSel === 'object') {

            this.$_oContainer = this.oOption.cDivContainerSel
        }
        else {
            this.$_oContainer = $(this.oOption.cDivContainerSel);
        }

        this.initUI();

    },

    initUI: function () {
        // 当前对象集合
        this.$_oStruck = $(this.cHtml);
        this.$_oContainer.append(this.$_oStruck);
        // 车辆容器
        this.$_oLstContainer = this.$_oStruck.find(this.oOption.cLstContainerSel);
        this.oSearchInput = this.$_oStruck.find(this.oOption.cSearchInputSel);
        this.oSearvhBtn = this.$_oStruck.find(this.oOption.cSearchBtnSel);

        this.$_oOpenBtn = this.$_oStruck.find('a.ex-icon-turn.on');
        this.$_oCloseBtn = this.$_oStruck.find('a.ex-icon-turn.off');
        this.$_oStruck.find('h4').html(this.oOption.cTitle);
        this.initSearchEvent();

        var self =this;
        //this.initData(1,function(oData){
        //    self.vehHandler(oData);
        //
        //    self.initPager(oData.records);
        //});

        // 绑定tab 关闭打开按钮事件
        this.initEvent();
    },

    getPanel: function () {
        return this.$_oStruck
    },

    initData: function (nPage,fnCall) {

        // 添加 遮罩层
        ES.Util.loadAn(this.$_oLstContainer);
        var oTemp = {"VehicleNo": this.oSearchInput.val()};

        if(this.anDeptId) {

            ES.extend(oTemp, {anDeptId: this.anDeptId});
        }

        var oParam = {
            "exparameters":oTemp,
            "_search": false,
            "nd": (new Date()).getTime(),

            "rows": this.oOption.nPageSize,
            "page": nPage,
            "sidx": "",
            "sord": "asc"
        };
        // 分页请求数据
        ES.getData(
            JSON.stringify(oParam),
            this.oOption.cUrl,
            fnCall,
            this);
    },

    // 绑定tab 关闭打开按钮事件
    initEvent: function () {
        var self = this;
        this.$_oOpenBtn.bind('click', function () {
            //$struckList.fadeIn(500);
            //self._oParent.fire("MapView:Struct.show");
            self.$_oStruck.css({"left": "220px", "opacity": "1"});
            //self.$_oStruck.animate({"left": "220px", "opacity": "1"}, 300);
            self.$_oCloseBtn.show();
            $(this).hide();

            self._oParent._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width() - 480});

            //treeList("click");
        });

        //车辆列表父选框隐藏事件
        this.$_oCloseBtn.bind('click', function () {
            //$struckList.fadeOut(500);
            //self._oParent.fire("MapView:Struct.hide");
            self.$_oStruck.css({"left": "0", "opacity": "1"});
            //self.$_oStruck.animate({"left": "0", "opacity": "1"}, 300);
            self.$_oOpenBtn.show();
            $(this).hide();

            self._oParent._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width() - 260});
        });
    },

    // 获得外层容器的宽度
    getWidth: function () {
        if (this.$_oStruck.offset().left <= 80) {
            return 0;
        }
        return this.$_oStruck.width();
    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.oSearchInput.val();
            // 触发查询
            self.oPopTree.oTree.jstree(true).search(cSearchVal, false, true);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.oSearchInput.val();

                //self.oPopTree.oTree.jstree(true).search(cSearchVal, false, true);
                self.initData(1, function (oData) {
                    self.vehHandler(oData);
                    self.initPager(oData.records);
                });

            }, 250);
        });
    },

    show: function () {
        this.$_oStruck.show();
    },

    hide: function () {
        this.$_oStruck.hide();
    },

    // 初始化界面
    initOn: function () {
        // 翻页执行
        this._oParent.on('MapView:VehLst.onPagerSearch', this.pagerSearch, this);

        this._oParent.on('MapView:VehLst.initVehLst', this.initVehLst,this);
    },

    initVehLst: function (oData) {
        this.anDeptId = oData.anDeptId;
        var self = this;
        this.initData(1, function (oData) {
            self.vehHandler(oData);
            self.initPager(oData.records);
        });
    },

    pagerSearch: function (oData) {
        if (!oData || !oData.oSearchParam || !oData.oSearchParam.PageIndex) {
            return;
        }
        var self = this;
        this.initData(oData.oSearchParam.PageIndex, function (oData) {
            self.vehHandler(oData);
        });
    },
});

// 初始化界面
ES.MapView.TabPanel.VehLst.include({

    // 初始化车辆列表数据
    vehHandler: function (oData) {
        // 移除遮罩层
        ES.Util.removeAn(this.$_oLstContainer);

        if(!oData){
            return ;
        }
        // 生存车辆列表
        var $_oUL = this.initVehItems(oData.dataList);
        if(!$_oUL) {
            return;
        }

        this.vehItemEvent($_oUL);
        this.initVehByAnimate($_oUL);

        // 对所有车辆列表位置查询,并绘制车辆到地图图层
        this.initVehLocal();

    },

    // 加载车辆实时位置信息
    initVehLocal: function () {

        var $_aoLi = this.$_oLstContainer.find("ul>li");
        if (!$_aoLi || $_aoLi.length <= 0) {
            return;
        }
        var oAlarmData = [];
        for (var i = 0; i < $_aoLi.length; i++) {
            var oData = $($_aoLi[i]).data('data');
            if (!oData) {
                continue;
            }
            oAlarmData.push(oData.PhoneNum);
        }

        // 获得车辆实时位置信息
        ES.getData(JSON.stringify({VehicleNos: oAlarmData}), ES.oConfig.cCurPosUrl, this.curPosHandler, this);
    },

    // 设置车辆位置到地图
    curPosHandler: function (oTemp) {
        if (!oTemp || !oTemp.Data) {
            return;
        }

        var self = this;
        // 要不请求到的值赋值给li对象
        this.$_oLstContainer.find('li').each(function () {
            var oItem = $(this).data("data");
            if (!oItem) return true;

            for (var i = 0; i < oTemp.Data.length; i++) {
                if (oTemp.Data[i].PhoneNum === oItem.PhoneNum) {
                    // 要合并数据
                    delete oTemp.Data[i].VehicleNo;
                    ES.extend(oItem, oTemp.Data[i]);
                    $(this).find(".carlist-title > p").html(ES.Util.dateFormat(oItem.GpsTime*1000,'yyyy-MM-dd hh:mm:ss'));

                    self._oPage.fire("MapView:LiveMange.addLivePos", {oGpsInfo: oItem});
                }
            }

        });

        // 触发实时控制,推送数据到界面
        this._oPage.fire('HubSvr:setGpsInfo', {oData: oTemp.Data});

        this._oPage.fire('HubSvr:batchSubGps', {aoGpsInfo: oTemp.Data,cUserId:m_cUserId});
    },

    // 初始化所有车辆列表
    initVehItems:function(aoDataList) {
        var $_oUL = $("<ul></ul>");
        if (!aoDataList || aoDataList.length <= 0) {
            this.initVehByAnimate($_oUL);
            return;
        }

        for (var i = 0; i < aoDataList.length; i++) {
            var oLi = $("<li class='slideup'></li>");
            oLi.data("data", aoDataList[i]);
            var nIndex = ((i + 1) % this.oOption.nPageSize == 0) ? this.oOption.nPageSize : ((i + 1) % this.oOption.nPageSize);
            //加载单个car的列表单元
            ES.initTag(oLi, this.getVehItemConfig(aoDataList[i], nIndex));
            aoDataList[i].nIndex = nIndex;

            $_oUL.append(oLi);
        }

        return $_oUL;
    },

    // 给每一项绑定事件,给每一项绑定 定位，点击li 定位位置信息
    vehItemEvent: function ($_oUL) {

        var self = this;

        $_oUL.find("li").each(function () {
            var oGpsInfo = $(this).data("data");

            $(this).find("a").eq(0).bind("click", this, function (e) {
                e.data.click();
                // 加历史轨迹界
                //window.open("/MapView/TrackView?PhoneNum=" + oGpsInfo.PhoneNum + "&VehicleNo=" + oGpsInfo.VehicleNo);
            });
            $(this).find("a").eq(1).bind("click", this, function () {
                // 加历史轨迹界
                window.open("/MapView/TrackView?PhoneNum=" + oGpsInfo.PhoneNum + "&VehicleNo=" + oGpsInfo.VehicleNo);
            });

        });

        // 实现定位人，并展示人的数据
        $_oUL.find("li").bind('click', function () {

            var oGpsInfo = $(this).data("data");
            $(this).siblings().removeClass('ec-active');
            $(this).addClass('ec-active');
            self._oPage.fire('MapView:MapLive.setZoomIn',{oGpsInfo:oGpsInfo});
        });
    },

    // 获得项
    getVehItemConfig: function (oItem,nIndex) {

        oItem.cGpsDate = ES.Util.dateFormat((oItem.GpsTime ? oItem.GpsTime : 946684800) * 1000, 'yyyy-MM-dd hh:mm:ss');

        var oItemConfig = {

            div: [
                {
                    i: { class: 'icon-car-pin green', html: nIndex },
                    div: { class: 'carlist-title', h2: { html: oItem.VehicleNo }, p: { html: oItem.cGpsDate } },
                    //em: { class: 'carlist-fav ' , i: { class: 'ec-icon-star' } }
                },
                {
                    class: 'carlist-bottom',
                    div: {
                        class: 'carlist-btn',
                        a: [{ class: "ec-btn ec-btn-xs ec-round ec-btn-secondary ex-btn-moredetail", href: 'javascript:void(0)', html: '详细' },
                            { class: "ec-btn ec-btn-xs ec-round ec-btn-default", href: 'javascript:void(0)', html: '轨迹' },
                            //{ class: "ec-btn ec-btn-xs ec-round ec-btn-default", href: 'javascript:void(0)', html: '消息' }
                        ]
                    }
                }
            ]
        };

        return oItemConfig;
    },

    // 动画加载车辆列表
    initVehByAnimate: function ($_oUL) {

        var $_aoLi = this.$_oLstContainer.find("ul>li");
        if($_aoLi && $_aoLi.length>0)
        {
            this._oPage.fire("MapView:LiveMange.removeAll");
        }

        // 清除ul时要清除处理定位，实时跟踪
        this.$_oLstContainer.find("ul").remove();


        this.$_oLstContainer.append($_oUL);
        $_oUL.find('li').hide().each(function () {
            var $_oLI = $(this);
            var nIndex = $(this).index();
            setTimeout(function () {
                $_oLI.show().addClass('in')
            }, nIndex * 100);

        });
    },

    // 初始化分页
    initPager: function (nTotalCnt) {
        // 初始化分页控件
        this._oParent.fire("MapView:Pager.reflashPager", { nTotalCnt: nTotalCnt });
    },



});


// 车辆列表 关注处理
ES.MapView.TabPanel.VehLst.include({

    // 初始关注列表
    initAttend: function () {
        var acVehNo = [];
        // 获得所有的车牌号
        this.$_oLstContainer.find('li').each(function () {
            var oData = $(this).data("data");
            if (!oData) {
                return true;
            }
            acVehNo.push(oData.VehicleNo);
        });

        ES.getData({acVehNo: acVehNo}, this.oOption.cAttentUrl, function (oData) {
            // 设置车辆列表颜色
            if (!oData || !oData.ReturnValue || oData.ReturnValue.length <= 0) {
                return;
            }

            for (var i = 0; i < oData.ReturnValue.length; i++) {
                $(".ex-layout-carlist-content>ul>li").each(function () {
                    var oVehInfo = $(this).data("data")
                    if (!oVehInfo || !oVehInfo.hasOwnProperty("VehicleNo")) {
                        return true;
                    }
                    if (oVehInfo.VehicleNo === oData.ReturnValue[i]) {
                        $(this).find("em.carlist-fav").addClass("on");
                        return false;
                    }
                });
            }

        }, this);
    },

    // 注册关注事件
    initAttendEvent: function () {
        var self = this;
        // 注册关注事件
        this.$_oLstContainer.find(".ec-icon-star").parent().bind("click", function () {
            var oItem = $(this).parent().parent().data("data")
            if (!oItem) return;

            if ($(this).hasClass("on")) {
                self.delAttend($(this), oItem);
            }
            else {
                // 添加关注
                self.addAttend($(this), oItem);
            }
        })
    },

    // 取消车辆关注
    delAttend: function ($_oEm, oItem) {
        if (!$_oEm) {
            return;
        }
        var self = this;
        // 车辆已经关注，取消关注
        var oTemp = {
            content: "确认要取消车辆[" + oItem.VehicleNo + "]关注吗？",
            okValue: '确定',
            ok: function () {
                // 取消车辆
                ES.getData({cVehNo: oItem.VehicleNo}, self._oParent.getReqUrl("oDeleteAttendUrl").cUrl, function (oData) {
                    if (!oData || !oData.IsSuccess) {
                        // 取消关注车辆失败
                        return;
                    }
                    $_oEm.removeClass("on");
                }, this);
            },
            cancelValue: '取消',
            cancel: null
        }
        var oWnd = this.initConfirmWnd(oTemp);

        oWnd.showModal();

    },

    //添加关注
    addAttend: function ($_oEm, oItem) {
        if (!$_oEm) return;
        ES.getData({cVehNo: oItem.VehicleNo}, this._oParent.getReqUrl("oAddAttendUrl").cUrl, function (oData) {
            if (!oData || !oData.IsSuccess) {
                // 关注车辆失败
                return;
            }
            $_oEm.addClass("on");

        }, this)
    },

    // 弹出层的设置
    initConfirmWnd: function (oOption) {

        var oTemp = {
            title: "提示",
            content: "是否删除数据",
            okValue: '确定',
            ok: null,
            cancelValue: '取消',
            cancel: null
        }

        ES.Util.extend(oTemp, oOption);

        var oWnd = dialog(oTemp);

        return oWnd;
    },
});