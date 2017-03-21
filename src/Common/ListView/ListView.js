/**
 * Created by liulin on 2016/12/14.
 *
 * list view 的基本操作
 *
 *
 */


// 加载list
ES.Common.ListView = ES.Class.extend({

    oOption: {
        // list 容器
        cSelecter: '.ex-layout-content>.ex-layout-panel>.ec-u-lg-2>.ec-panel-collapse>.ec-padding-top-0>ul',
        // 树url
        cUrl: '/ResourceType/GetResourceGroup',
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.$_oContainer = this.getContainer();

        // 初始化界面
        this.initUI();

        this.initOn();

    },

    initOn: function () {
        this._oParent.on('ListView.reflesh', this.reflesh, this);
    },

    getContainer: function () {
        var $_oContainer = $(this.oOption.cSelecter);
        if (typeof this.oOption.cSelecter === 'object') {
            $_oContainer = this.oOption.cSelecter;
        }
        return $_oContainer;
    },

    // 加载界面
    initUI: function () {
        //清空所有的li 对象
        this.$_oContainer.empty();
        ES.getData({}, this.oOption.cUrl, this.initUIHandler, this);
    },
    reflesh: function () {
        this.initUI();
    },

    // 加载界面
    initUIHandler: function (oData) {
        if (!oData) {
            return;
        }

        var cHtml = '<li class="ec-cf">' +
            '<a class="ec-u-xs-12" href="javascript:void(0)">{ResourceName}<span class="badge">{Cnt}</span> </a> ' +
            '<b></b></li>';

        for (var i = 0; i < oData.length; i++) {
            var cTem = ES.template(cHtml, oData[i]);
            var oLI = $(cTem);

            oLI.data('oData', oData[i]);
            this.$_oContainer.append(oLI);
        }

        this.initEven();
    },

    initEven: function () {
        var self = this;
        var oContainer = this.getContainer();
        oContainer.find('li').bind('click', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            if (self._oParent) {
                self._oParent.fire(self._oParent.getEventName('cliOnclick'), {oData: $(this).data('oData')});
            }
        });

        oContainer.find('li:eq(0)').click();
    }
});