/**
 * Created by liulin on 2017/3/17.
 */


ES.CloudMap.EditTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>编辑</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;

        this._oParent = oParent;
        this._oPage = oParent._oParent;

        this._oDrawLayer= options.oDrawLayer;
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

            // 点击编辑 显示确定和取消
            self._oParent.addSaveACalToUI();
        });
    },

    //  画点
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

    // 添加事件
    initOn: function () {
        this._oParent.on('CloudMap:EditTool.calEdit',this.calEdit,this);

        this._oParent.on('CloudMap:EditTool.edit',this.edit,this);
        this._oParent.on('CloudMap:EditTool.SaveEdit',this.saveEdit,this);

        var self =this;
        this._oMap.on('draw:edited', function (e) {
            if(!self._oParent.bActive){
                return
            }
            var oMap = this;
            var aoLayer = e.layers;

            aoLayer.eachLayer(function (oLayer) {

                var oLatLng = oLayer.getLatLng();

                var oInfo = {
                    aoLatLng: [{lat: oLatLng.lat, lng: oLatLng.lng}],
                    oOption: {},
                };



                self._oDrawLayer.addLayer(oLayer);



                // 弹出层显示的位置信息
                var oPos = oMap.latLngToLayerPoint(oLatLng);

                // 告诉外面弹出层的位置
                self._oParent.fire('CloudMap:PopWnd.editShow', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oBusInfo:oLayer.oBusInfo
                });
            });
        });
    },

    // 保存编辑
    saveEdit: function () {
        this.oPen.handler.save();
        this.oPen.handler.disable();

    },

    // 取消编辑
    calEdit: function () {
        this.oPen.handler.revertLayers();
        this.oPen.handler.disable();
    },


    // 编辑数据oData:oNode.node.data,
    edit: function (oVal) {

        this._oParent.clearLayers();

        if (!oVal  || !oVal.oNode) {
            return ;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        var oVehLine = L.marker(oVal.oNode.data,{});// this.createLayer(oVal.oNode);

        this._oMap.flyTo(oVal.oNode.data);

        if (!oVehLine) {
            return;
        }

        var oData = {
            oLatLng: oVal.oNode.data,
            cId: oVal.oNode.id,
            cName: oVal.oNode.text,
            cParentId:oVal.oNode.parent,
            cParentText :oVal.oNode.parentText,
        }
        oVehLine.cId = oVal.oNode.id;
        oVehLine.oBusInfo = oData;
        oVehLine.addTo(this._oDrawLayer);

        this._oParent.addEditToUI();
    },


});
