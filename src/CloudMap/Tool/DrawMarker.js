/**
 * Created by liulin on 2017/3/17.
 *
 * 只负责编辑点，需要地图控件
 */



ES.CloudMap.DrawMarker = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画点</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;

        this._oParent = oParent;
        this._oPage = oParent._oParent;


        this._oMap = this._oPage.getMap();
        this.oPen = null;




        this.initPen();
        this.initOn();
        
        this.initUI();

        this.oActHandler = null;
    },

    initUI: function () {
        this.$_oLi = $(this.cHtml);
    },

    bandClick: function () {
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();
            self._oParent.setActive(self);
        });
    },

    //  画点
    initPen: function () {
        this.oPen = {
            enabled: {},
            handler: new L.Draw.Marker(this._oMap, {}),
            title: ''
        }
    },

    // 添加事件
    initOn: function () {

        var self =this;

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oParent.addLayer(oLayer);

            var oLatLng = oLayer.getLatLng();

            var oInfo = {
                aoLatLng: [{lat: oLatLng.lat, lng: oLatLng.lng}],
                oOption: {},
                //nType: this.getObjType(oLayer)
            };

            var oPos = this.latLngToLayerPoint(oLatLng);

            self._oParent.fire('CloudMap:PopWnd.show',{oInfo:oInfo,oPos:oPos});
        });




    },



    // 编辑数据oData:oNode.node.data,
    edit: function (oVal) {

        this._oParent.clearLayers();

        if (!oVal  || !oVal.oNode) {
            return ;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oVal.oNode);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oVal.oNode.id;
        oVehLine.oBusInfo = oVal.oNode.data;
        this.fitBound();
        //var acItem = [5, 6];
        //this.showButton(acItem);
    },
});