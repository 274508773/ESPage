/**
 * Created by liulin on 2017/2/13.
 *
 * 人员定位使用
 *
 */

ES.MapView.TabPanel.UserLst = ES.MapView.TabPanel.VehLst.extend({

    // 查询面板控件
    oOption: {
        // 车辆url
        cUrl: '/User/List',
        // 获取人员实时位置
        cCurPosUrl: '/MapView/GetUserHeart',
        cAttentUrl: '',
        // 面板的最上级容器，不是车辆容器
        cDivContainerSel: '#classContainer',
        // 车辆容器
        cLstContainerSel: '.ex-layout-carlist-content',
        // 查询框容器
        cSearchInputSel: 'input.ec-form-field',
        // 查询btn容器
        cSearchBtnSel: 'button.ec-btn-secondary',

        nPageSize:15,
    },


    cHtml: '<div class="ex-layout-carlist ex-theme-carlist" style="left: 220px; opacity: 1;"> ' +
    '   <div class="ex-layout-carlist-title ex-theme-carlist-title">' +
    '        <h4 class="ec-align-left">执法人员</h4> ' +
    '        <a href="javascript:;" class="ex-icon-turn off" ><i class="ec-icon-arrow-circle-left"></i></a> ' +
    '        <a href="javascript:;" class="ex-icon-turn on" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a> ' +
    '   </div> ' +
    '   <div class="ex-layout-carlist-wrap"> ' +
    '       <div class="ex-layout-carlist-search"> ' +
    '           <div class="ec-input-group"> ' +
    '               <input type="text" class="ec-form-field" placeholder="请输入人员名称"> ' +
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



    // 获得项
    getVehItemConfig: function (oItem,nIndex) {

        oItem.cGpsDate = ES.Util.dateFormat((oItem.GpsTime ? oItem.GpsTime : 946684800) * 1000, "yyyy-MM-dd hh:mm:ss");

        var oItemConfig = {

            div: [
                {
                    i: { class: 'icon-car-pin green', html: nIndex },
                    div: { class: 'carlist-title', h2: { html: oItem.Name }, p: { html: oItem.cGpsDate } },
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

    initVehLocal: function () {

        var $_aoLi = this.$_oLstContainer.find("ul>li");
        if (!$_aoLi || $_aoLi.length <= 0) {
            return;
        }
        var acUser = [];
        for (var i = 0; i < $_aoLi.length; i++) {
            var oData = $($_aoLi[i]).data('data');
            if (!oData) {
                continue;
            }
            acUser.push(oData.OId);
        }

        // 获得车辆实时位置信息
        ES.getData( {acUser: acUser}, this.oOption.cCurPosUrl, this.curPosHandler, this);
    },

    // 给每一项绑定事件,给每一项绑定 定位，点击li 定位位置信息
    vehItemEvent: function ($_oUL) {
        var self = this;

        $_oUL.find("li").each(function () {
            var oData = $(this).data("data");
            $(this).find('a').eq(0).bind("click", this, function (e) {
                e.data.click();

            });
            $(this).find("a").eq(1).bind("click", this, function () {
                // 加历史轨迹界
                window.open("/MapView/UserTrackView?PhoneNum=" + oData.PhoneNum + "&VehicleNo=" + oData.VehicleNo);
            });
            $(this).find("a").eq(2).bind("click", this, function () {
                // 添加监控列表
            });

        });

        // 实现定位人，并展示人的数据
        $_oUL.find("li").bind('click', function () {

            var oData = $(this).data("data");

            $(this).siblings().removeClass('ec-active');
            $(this).addClass('ec-active');

            self._oPage.fire("MapView:UserLayer.zoomInVeh", oData);
        });

    },

    // 定位人员信息，需要自己调用人员轨迹数据
    curPosHandler: function (oTemp) {
        if (!oTemp || !oTemp.Result || !oTemp.Result.Data) {
            return;
        }

        var aoLst = oTemp.Result.Data;

        var self = this;
        var aoUser = [];
        // 要不请求到的值赋值给li对象
        this.$_oLstContainer.find('li').each(function () {
            var oItem = $(this).data("data");
            if (!oItem) {
                return true;
            }

            for (var i = 0; i < aoLst.length; i++) {
                if (aoLst[i].id === oItem.OId) {
                    oItem.lat = aoLst[i].Pos.lat;
                    oItem.lng = aoLst[i].Pos.lng;
                    oItem.VehicleStatus = aoLst[i].VehicleStatus || '';
                    oItem.PoiInfo = aoLst[i].PoiInfo || '';
                    oItem.GpsTime = aoLst[i].GpsTime;
                    oItem.deptName = aoLst[i].dpt || '';
                    oItem.label = aoLst[i].label || '';
                    oItem.cGpsDate = ES.Util.dateFormat((oItem.GpsTime ? oItem.GpsTime : 946684800) * 1000, "yyyy-MM-dd hh:mm:ss");
                    $(this).find(".carlist-title > p").html(oItem.cGpsDate);

                    aoUser.push(oItem);
                }
            }
        });

        // 直接在地图上画
        self._oPage.fire("MapView:UserLayer.drawVehMarkers", {aoGpsInfo: aoUser});
    },

    initVehByAnimate: function ($_oUL) {

        var $_aoLi = this.$_oLstContainer.find("ul>li");
        if($_aoLi && $_aoLi.length>0)
        {
            this._oPage.fire("MapView:UserLayer.clearVehMarkers");
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

    initData: function (nPage,fnCall) {

        // 添加 遮罩层
        ES.Util.loadAn(this.$_oLstContainer);

        var oTemp = {"Name": this.oSearchInput.val()};

        if(this.anDeptId) {

            ES.extend(oTemp, {anDeptId: this.anDeptId});
        }


        var oParam = {
            "exparameters": oTemp,
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
});