/**
 * 整体页面布局
 *
 * Created by liulin on 2017/2/22.
 */



ES.CloudMap.LayoutContent = ES.Evented.extend({

    oUIConfig: {

        div: {'class': 'ex-layout-content',
            div: {
                'class': 'ex-layout-map-content',
                'id':'MapView',
                div: [
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'},
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left tree-layout-map'},
                    //{'class':' ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'},
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right'},
                    {'class': 'ex-layout-maptool ex-map-bottom ex-map-left'},
                    {'class': 'ex-layout-maptool ex-theme-maptool ex-map-bottom ex-map-right'}
                ]
            }
        },

    },

    oOption: {
        cContainerSel: '.ex-layout-main',


    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initUI();
        this.initOn();
    },

    initOn: function () {
        this._oParent.on('MapView:LayoutContent.resize',this.resize,this);
    },

    resize: function (oData) {
        if(oData.nWidth){
            this.$_oContainer.css({width:oData.nWidth});
        }
        if(oData.nHeight){
            this.$_oContainer.css({height:oData.nHeight});
        }
    },

    reflesh: function (nWidth,nHeight) {
        this.$_oContainer.css({width:nWidth,height:nHeight});
    },

    initUI: function () {
        this.$_oContainer = ES.getTag(this.oUIConfig);
        $(this.oOption.cContainerSel).append(this.$_oContainer);

        this.$_oContainer.css({width:this.oOption.nWidth,height:this.oOption.nHeight});
    },

});


