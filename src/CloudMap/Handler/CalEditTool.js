/**
 * Created by liulin on 2017/3/17.
 */

ES.CloudMap.CalEditTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>取消</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;

        this._oParent = oParent;
        this._oPage = oParent._oParent;

        this.initUI();

    },

    initUI: function () {
        this.$_oLi = $(this.cHtml);
    },

    // 绑定事件
    bandClick: function () {
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self._oParent.fire('CloudMap:EditTool.calEdit');
        });
    },

    CalEdit: function () {
       // this.oPen.handler.revertLayers();
        //this.oPen.handler.disable();
    },


});
