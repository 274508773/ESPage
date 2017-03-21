/**
 * Created by liulin on 2017/3/20.
 */


ES.CloudMap.PostLineDrawTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画邮路</p></li>',

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
            self._oParent.oPenalPos.show();
            self._oParent.setActive(self);
        });
    },


});
