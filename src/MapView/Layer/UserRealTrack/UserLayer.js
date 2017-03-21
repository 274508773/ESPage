/**
 * Created by liulin on 2017/2/14.
 *
 * 地图人员静态位置
 *
 */

ES.HGT.MapView.UserLayer = L.MapLib.MapMaster.MapOpr.extend({

    oPopOption: { maxWidth: 400 },
    /*
     为构造函数
     @oParent 为父级页面对象
     @oOption 为参数，设置当前的参数
     */
    initialize: function (oParent, oOption) {

        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption);

        // 添加图层
        this._loadLayerGroup();

        // 注册监听事件
        this._initOn();

    },

    // 注册监听事件
    _initOn: function () {

        this._oParent.on("MapView:UserLayer.drawVehMarkers", this.drawMarkers, this);
        this._oParent.on("MapView:UserLayer.drawVehMarker", this.drawMarker, this);
        this._oParent.on("MapView:UserLayer.clearVehMarkers", this.clearMarkers, this);
        this._oParent.on("MapView:UserLayer.zoomInVeh", this.zoomInVeh, this);

    },



    // 设置图标比例尺
    zoomInVeh: function (oData) {
        if (!this._oMarkerGroup || !oData || !oData.OId) return;
        var oLayer = this.findLayer(this._oMarkerGroup, oData.OId);
        if (!oLayer || !oLayer.getLatLng) {
            return;
        }
        //设置最上层
        oLayer._bringToFront();
        oLayer.openPopup();
        this.flyTo({oGpsInfo:{Lat:oData.lat,Lon:oData.lng}}, {zoom:16});
    },

    //添加实时跟踪状态数据
    _loadLayerGroup: function () {

        //新建vehmark图层
        this._oMarkerGroup = L.featureGroup();
        this._oMap.addLayer(this._oMarkerGroup);

    },

    //画Awesome点，这个点显示当前页面数据oAwesomeGroup
    drawMarker: function (oPosInfo) {
        var oLatLng = L.latLng(oPosInfo.lat, oPosInfo.lng);

        var oLayer = L.marker(oLatLng, { icon: this.getIcon(oPosInfo) });
        oLayer.cId = oPosInfo.OId;
        var cHTML = this._getMarkerHtml(oPosInfo);

        oLayer.bindPopup(cHTML, this.oPopOption);
        var oPopup = oLayer.getPopup();
        oPopup.oGpsInfo = oPosInfo;
        this.initPopEven(oPopup);

        oLayer.addTo(this._oMarkerGroup);

    },

    // 注册弹出层事件,弹出层绑定对象,每次不是最新oGpsInfo数据，不能用匿名的函数，需要注销
    initPopEven: function (oPopup) {

        var self = this;

        if (!oPopup) return;
        oPopup.self = this;
        oPopup.on("contentupdate", function (){
            // 车辆详情按钮
            var oBtnDetail = $(".leaflet-popup").find("i.ec-icon-truck").parent();

            // 车辆轨迹按钮
            var oBtnTrack = $(".leaflet-popup").find("i.ec-icon-exchange").parent();

            var oMeassageClick = $(".leaflet-popup").find("i.ec-icon-commenting").parent();

            var oGpsInfo = this.oGpsInfo;

            // 绑定事件
            oBtnDetail.bind("click", function () {
                ES.aWarn('系统正在开发过程！');
                // 显示详细数据

            })

            oBtnTrack.bind("click", function () {
                window.open("/MapView/UserTrackView?PhoneNum=" + oGpsInfo.Account + "&VehicleNo=" + oGpsInfo.Name);
            })

            oMeassageClick.bind("click", function () {
                //devcmd.sendMsg(oGpsInfo.VehicleNo, oGpsInfo.PhoneNum);
                ES.aWarn('系统正在开发过程！');
            })


        }, oPopup);
    },

    getIcon: function (oPosInfo) {

        var oIcon = new L.DivIcon({
            html: '<div class="ex-theme-map-icon-pin green"><i>' + oPosInfo.nIndex + '</i></div>',
            className: '',
            popupAnchor: [0, -30],
            iconAnchor: [15, 30]

        });

        return oIcon;
    },


    //画地图点数据
    drawMarkers: function (oData) {
        if (!oData || !this._oMarkerGroup) {
            return;
        }
        this.clearMarkers();
        //缓存点数据
        this._oMarkerGroup.aoGpsInfo = oData.aoGpsInfo;

        for (var i = 0; i < oData.aoGpsInfo.length; i++) {

            this.drawMarker(oData.aoGpsInfo[i]);
        }

    },

    clearMarkers: function () {
        if (!this._oMarkerGroup){
            return;
        }

        this._oMarkerGroup.clearLayers();
        this._oMarkerGroup.aoGpsInfo = null;
    },

    // 获得人员当前状态
    getOnlineStatus: function (oGpsInfo) {
        var oItem = {
            cClsMobile: 'off',
            cClsGps: 'off'
            }
        if(oGpsInfo.VehicleStatus ==='在线')
        {
            oItem.cClsMobile= 'on';
            oItem.cClsGps= 'on'
        }
        else{
            oItem.cClsMobile= 'off';
            oItem.cClsGps= 'off'
        }
        return oItem;
    },


    getDateMsg: function (nTick) {

        var nCurTick = new Date().getTime();
        var nInt = nCurTick - nTick;
        if (nInt > 24 * 60 * 60 * 1000) {
            var nDay = (nCurTick - nTick) / (24 * 60 * 60 * 1000);

            return "[" + parseInt(nDay) + "天前]";
        }
        else if (nInt > 1 * 60 * 60 * 1000 && nInt <= 24 * 60 * 60 * 1000) {

            var nH = nInt / (1 * 60 * 60 * 1000);
            return "[" + parseInt(nH) + "小时前]";
        }
        else {
            var nH = parseInt(nInt / (60 * 1000));
            if (nH <= 0) {
                return "";
            }
            return "[" + parseInt(nH) + "分钟前]";

        }
    },
    // 注册人员图层的弹出层
    _getMarkerHtml: function (oGpsInfo) {

        var cMsg = this.getDateMsg(oGpsInfo.GpsTime * 1000);
        var oTemp = {};
        if (oGpsInfo.Property && oGpsInfo.Property.LastWorkPlace)
        {
            oTemp.cLastWorkPlace = oGpsInfo.Property.LastWorkPlace.replace("湖北省;武汉市;", "");
        }
        ES.extend(oTemp, oGpsInfo, oGpsInfo.Property, {
            cMsg: cMsg,

            cGpsDate: ES.Util.dateFormat(oGpsInfo.GpsTime * 1000, "yyyy-MM-dd hh:mm:ss"),
            cVehicleStatus: oGpsInfo.VehicleStatus || "通讯中断"
        },this.getOnlineStatus(oGpsInfo));


        // 设置外层div 控制弹出层的宽度
        var cHtmlD =
            '<div style="width:400px">'+
            '   <div class="ex-map-tip-head">'+
            '       <h3> {Name} <span class="ex-map-tip-timer ec-fr">{cGpsDate} {cMsg}  </span></h3>'+
            '       <div class="ex-map-tip-humen-status">'+
            '           <p> 当前状态： <span> {cVehicleStatus}</span></p>'+
            '           <ul class="ec-avg-sm-2 ex-map-tip-mobile ec-fr"><li><i class="ex-icon-16 ex-icon-mobile {cClsMobile}"></i></li><li><i class="ex-icon-16 ex-icon-bd {cClsGps}"></i></li></ul>'+
            '       </div>'+
            '   </div>'+
            '   <div class="ex-map-tip-humen-info">'+
            '       <div class="ex-tip-humen-img">'+
            '           <img src="/Asset/img/icon_image.png" />'+
        '           </div>'+
            '       <div class="ex-tip-humen-detial">'+
            '           <ul>'+
            '               <li><label>所属部门：</label><span> {deptName} </span></li>'+
            '               <li><label>所属标签：</label><span> {label} </span></li>'+
            '               <li><label>当前位置：</label><span> {PoiInfo} </span></li>'+
            '           </ul>'+
            '       </div>'+
            '   </div>'+
            '   <ul class="ec-avg-sm-9 ex-map-tip-ctl">'+

            '       <li> <i class="ec-icon-exchange"></i> <label>轨迹</label> </li>'+

            '   </ul>'+
            ' </div>';


        var cHtml = ES.Util.template(cHtmlD, oTemp);
        return cHtml;
    },

})