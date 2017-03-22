/**
 * Created by liulin on 2017/3/17.
 *
 * 只负责编辑点，需要地图控件
 */



ES.CloudMap.DrawMarkerTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画点</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

        this.initPen();

        this.initOn();
        
        this.initUI();


    },


    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this );

        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();
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

    calDraw:function(){
        if(this.oPen){
            this.oPen.handler.disable();
        }

    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

        var self =this;

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oParent.addLayer(oLayer);

            var oLatLng = oLayer.getLatLng();

            var oInfo = {
                aoLatLng: [{lat: oLatLng.lat, lng: oLatLng.lng}],
                oOption: {},
            };

            var oPos = this.latLngToLayerPoint(oLatLng);

            self._oParent.fire('CloudMap:PopWnd.show',{oInfo:oInfo,oPos:oPos});
        });


    },


});