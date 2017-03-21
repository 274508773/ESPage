/**
 * Created by liulin on 2016/12/20.
 *
 * 容器的定义和编辑
 */

ES.HGT.MapView.LayoutContent = ES.Evented.extend({

    oUIConfig: {

        div: {'class': 'ex-layout-content'},

    },

    oOption: {
        cContainerSel: '.ex-layout-main',


    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        // 初始化界面
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