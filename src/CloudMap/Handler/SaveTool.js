/**
 * Created by liulin on 2017/3/17.
 */

ES.CloudMap.SaveTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>确定</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;

        this._oParent = oParent;
        this._oPage = oParent._oParent;


        this._oMap = this._oPage.getMap();
        this.oPen = null;


        this.initUI();

        this.oActHandler = null;
    },

    initUI: function () {
        this.$_oLi = $(this.cHtml);
    },

    bandClick: function () {
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
             self._oParent.fire('CloudMap:EditTool.SaveEdit');
        });
    },

});