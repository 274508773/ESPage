/**
 * Created by liulin on 2017/3/16.
 */


// 编辑工具
ES.HGT.CloudMap.POEditTool = ES.HGT.CloudMap.EditTool.extend({

    // 外部赋值 ，但是编辑、删除、确定、取消 这些是固定不变的对象
    cHTML: '<div class="ex-maptool-box ex-maptool-box-white">' +
    '<ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-menu">' +

    '<li><button class="ec-btn ec-btn-secondary ec-circle" data-index="0" data-flag="PostPos"  title="站点" data-tab-index="4"><i class="ec-icon-map-marker"></i></button><p>站点</p></li>' +
    '<li><button class="ec-btn ec-btn-secondary ec-circle" data-index="1" data-flag="PostLine"  title="邮路" data-tab-index="2"><i class="ec-icon-ils"></i></button><p>邮路</p></li>' +


    '</ul>' +
    '</div>' +
    '<div class="ex-maptool-box  ex-maptool-tab-draw">' +
    '    <ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-tool">' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" title="画点"><i class="ec-icon-dot-circle-o"></i></button><p>画点</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="1" title="画线"><i class="ec-icon-xing"></i></button><p>画线</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="2" title="画矩形"><i class="ec-icon-stop"></i></button><p>画矩形</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="3" title="画多边形"><i class="ec-icon-star"></i></button><p>画多边形</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="4" title="画圆形"><i class="ec-icon-circle"></i></button><p>画圆形</p></li>' +

    '       <li><button class="ec-btn ec-btn-secondary ec-radius" data-object="5" title="编辑"><i class="ec-icon-circle"></i></button><p>编辑</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius level" data-object="6" title="删除"><i class="ec-icon-star"></i></button><p>删除</p></li>' +

    '       <li><button class="ec-btn ec-btn-secondary ec-radius level" data-object="7" title="确定"><i class="ec-icon-circle"></i></button><p>确定</p></li>' +
    '       <li><button class="ec-btn ec-btn-secondary ec-radius level" data-object="8" title="取消"><i class="ec-icon-star"></i></button><p>取消</p></li>' +
    '   </ul>' +
    '</div>',

    initToolEvent: function () {
        var self = this;
        var cFlag = this._oMapBase._oParent.getFlag();

        $('.ex-cloud-map-tool button').not('.level').bind('click', function () {

            $('.ex-cloud-map-tool button').removeClass('ec-active');
            $(this).addClass('ec-active');

        });

        $('.ex-cloud-map-tool button[title="编辑"]').bind('click', function () {
            var acItem = [7, 8];
            self.showButton(acItem);
            $('.ex-cloud-map-tool button').removeClass('ec-active');
            $(this).addClass('ec-active');

            self.aoDrawPen[parseInt($(this).attr('data-object'))].handler.enable();
            self._oMapBase._oParent.fire('CloudMap:' + cFlag + 'TagTree.hide', {});
            self._oMapBase._oParent.fire('CloudMap:CreatePos.hide');
        });


        $('.ex-cloud-map-tool button[title="画线"]').bind('click', function () {

            self._oMapBase._oParent.fire('CloudMap:CreatePos.show');
            self.clearLayer();

        });

    },


    // 画点处理
    edit: function (oVal) {

        this.clearLayer();

        if (!oVal) {
            return;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oVal);
        if (!oVehLine) {
            return;
        }

        this.fitBound();
        var acItem = [5, 6];
        this.showButton(acItem);
    },


    createLayer: function (oData) {
       if(!oData){
           return;
       }

        var aoLatLng = oData.aoData.map(function (oVal) {
                return oVal.data;
            }
        );

        var oVehLine = L.polyline(aoLatLng, {
            stroke: true,
            color: '#666666',//'#0FFF05',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: false,
            fillColor: '#0FFF05',
            fillOpacity: 0.1,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false
        }).addTo(this._oDrawLayer);


        return oVehLine;
    },


    // 添加事件监听
    initOn: function () {
        var self = this;

        this._oMap.on('moveend', function (e) {

            self._oMapBase._oParent.fire('CloudMap:' + self.cFlag + 'PopWnd.setPos', {});
        });

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oDrawLayer.addLayer(oLayer);
            var oInfo = self._getGisObj(oLayer);

            // 创建是的位置，因为当前位置不再容器中，所以要自己计算当前位置
            var oPos = this.latLngToLayerPoint(self.getPos(oLayer));

            self._oMapBase._oParent.fire('CloudMap:' + self.cFlag + 'PopWnd.show',
                {cFlag: self.cFlag, oInfo: oInfo, oPos: oPos, oLatLng: self.getPos(oLayer)});
        });

        this._oMap.on('draw:edited', function (e) {

            var aoLayer = e.layers;
            aoLayer.eachLayer(function (oLayer) {
                var oInfo = self._getGisObj(oLayer);
                self._oDrawLayer.addLayer(oLayer);
                //oInfo.cId = oLayer.cId;
                oInfo.oInfo = oLayer.oInfo;
                oInfo.oBusInfo = oLayer.oBusInfo;

                // 弹出层显示的位置信息
                var oPos = self._oMap.latLngToLayerPoint(self.getPos(oLayer));
                // 告诉外面弹出层的位置
                self._oMapBase._oParent.fire('CloudMap:' + self.cFlag + 'PopWnd.editShow', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oLatLng: self.getPos(oLayer)
                });
            });
        });

        this._oMapBase._oParent.on('CloudMap:EditTool.clearLayer',this.clearLayer,this);

        this._oMapBase._oParent.on('CloudMap:EditTool.edit',this.edit,this);
    },
});