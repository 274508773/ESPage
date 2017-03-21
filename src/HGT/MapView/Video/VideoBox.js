/**
 * Created by liulin on 2016/12/28.
 */

ES.HGT.MapView.VideoBox = ES.Evented.extend({

    oOption: {
        className: '',
        title: '视频容器',
        cContainerSel: '.ex-layout-content',
        cFlag:'vedio',
        nHeight: 500,
        nWidth:800
    },

    cUIConfig: '<div  class="ex-layout-cardetail ex-theme-cardetail"> ' +
    '<object classid="clsid:04DE0049-8359-486e-9BE7-1144BA270F6A" id="_playviewocx" width="100%" height="100%" name="_playviewocx"></object> ' +
    '</div>',

    // 构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);

        // 获得地图控件
        this._oParent = oParent;

        this.$_oPContainer = oOption.cContainerSel;
        if (typeof oOption.cContainerSel !== 'object') {
            this.$_oPContainer = $(this.oOption.cContainerSel);
        }

        this.initUI();
        this.initOn();
    },

    // 加载监听
    initOn: function () {
        this._oParent.on('Menu:click',this.showHandler,this);
    },

    // 显示效果
    showHandler: function (oData) {
        if (oData.cFlag === this.oOption.cFlag) {
            this.showVideo();

        }
        else {
            this.hideVideo();
        }
    },

    showVideo: function () {
        //this.fire('VideoPanel:Show', {$_oContainer: this.$_oContainer});
        this.$_oContainer.animate({ "height": "100%", "bottom": "0" }, 800);

        this.$_oContainer.show();
        //this.$_oContainer.hide();
    },

    hideVideo: function () {
        //this.$_oContainer.hide();
        this.$_oContainer.animate({ "bottom": "-100%" }, 150);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        this.$_oContainer = $(this.cUIConfig);

        this.$_oContainer.css({width: this.oOption.nWidth, height: this.oOption.nHeight });
        this.$_oPContainer.append(this.$_oContainer);
        //this.showVideo();
        this.hideVideo();
        try{
            $('#_playviewocx').get(0).SetOcxMode(0);
        }
        catch(e) {
            console.log('请使用ie');
        }

        this._oParent.fire('VideoBox:ready',{$_oContainer:this.$_oContainer});

    },

    //初始化工具栏事件
    initToolEvent: function () {
        //var self = this;

    },

    reflesh: function (nWidth,nHeight) {
        this.$_oContainer.css({width:nWidth,height:nHeight});
    }

});