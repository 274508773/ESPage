/**
 * Created by exsun on 2017-01-09.
 */

ES.CloudMap={};

ES.CloudMap.version = '0.1.1';

// 存储页面公共的模块,保存页面当前编辑的模式
ES.CloudMap.Page = ES.Page.extend({

    //页面id
    initialize: function (id, oOption) {

        ES.Page.prototype.initialize.call(this, id, oOption);

        this.cFlag = 'Grid';
    },

    setFlag: function (cVal) {
        this.cFlag = cVal;
    },

    getFlag: function () {
        return this.cFlag;
    },

    getPosByLatLng: function (oLatLng) {
        if(!this._oMap||!oLatLng) {
            return null;

        }

        var oPos = this._oMap.latLngToLayerPoint(oLatLng);

        return oPos
    }

});



// 补丁
L.extend(L.Edit.PolyVerticesEdit,{

    //options: {
    //    icon: new L.DivIcon({
    //        iconSize: new L.Point(12, 12),
    //        className: 'leaflet-div-icon leaflet-editing-icon'
    //    }),
    //    touchIcon: new L.DivIcon({
    //        iconSize: new L.Point(20, 20),
    //        className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
    //    }),
    //    drawError: {
    //        color: '#b00b00',
    //        timeout: 1000
    //    }
    //},

    _createMarker: function (latlng, index) {
        // Extending L.Marker in TouchEvents.js to include touch.
        var bDrag = true;
        if(latlng.alt){
            bDrag = false;
        }
        var marker = new L.Marker.Touch(latlng, {
            draggable: bDrag,
            icon: this.options.icon,
        });

        marker._origLatLng = latlng;
        marker._index = index;

        if(bDrag)
        {
            marker
                .on('dragstart', this._onMarkerDragStart, this)
                .on('drag', this._onMarkerDrag, this)
                .on('dragend', this._fireEdit, this)
                .on('touchmove', this._onTouchMove, this)
                .on('touchend', this._fireEdit, this)
                .on('MSPointerMove', this._onTouchMove, this)
                .on('MSPointerUp', this._fireEdit, this);
        }


        this._markerGroup.addLayer(marker);

        return marker;
    },
})