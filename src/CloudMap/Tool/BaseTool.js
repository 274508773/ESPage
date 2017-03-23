/**
 * Created by liulin on 2017/3/17.
 *
 *
 */


ES.CloudMap.BaseTool = ES.Evented.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>删除</p></li>',

    // 构造函数
    initialize: function (oParent, options) {

        ES.setOptions(this, options);
        //this.oPenStyle = this.oOption.oPenStyle;

        this._oParent = oParent;
        this._oPage = oParent._oParent;

        this._oMap = this._oPage.getMap();

        this.initUI();

        this.initOn();
    },

    initUI: function () {
        this.$_oLi = $(this.cHtml);
        this.bandClick();
    },

    removeActive: function () {
        this.$_oLi.find('button').removeClass('ec-active');
    },

    addActive: function () {
        this.$_oLi.find('button').addClass('ec-active');
    },

    initOn: function () {
        this._oParent.on('CloudMap:BaseTool.removeActive',this.removeActive,this);
        this._oParent.on('CloudMap:BaseTool.setActive',this.addActive,this);
    },

    // 绑定事件
    bandClick: function () {
        var self = this;
        this.$_oLi.find('button').bind('click', function () {
            self._oParent.fire('CloudMap:BaseTool.removeActive');
            self.addActive();

        });

    },
});