/**
 * Created by exsun on 2017-01-12.
 */

ES.HGT.EventConfig.Menu = ES.Class.extend({

    oOption: {
        // list 容器
        cSelecter: '.ex-eventconfig-menu',


        // 树url
        cUrl: '/ConfigEvent/GetMenu',
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.$_oContainer = this.getContainer();

        // 初始化界面
        this.initUI();

        this.oSearvhBtn=$('.ex-theme-tree button.ex-tree-search-btn');
        this.oSearchInput=$('.ex-theme-tree input.ex-tree-search-ipt');
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
    initUI: function (oData) {
        var oParam = {EventTypeName:''}
        if(oData)
        {
           ES.extend(oParam, oData.oParam);
        }

        //清空所有的li 对象
        this.$_oContainer.empty();
        ES.getData(oParam, this.oOption.cUrl, this.initUIHandler, this);
    },
    reflesh: function () {
        this.initUI();
    },

    // 加载界面
    initUIHandler: function (oData) {
        if (!oData) {
            return;
        }
        this.$_oContainer.empty();

        var cHtml = '<a href="#" class="ec-btn ec-btn-sm ec-btn-default ec-text-left ex-theme-sider-title">' +
            '<i class="ec-icon-file ec-text-default"></i>&nbsp;&nbsp;{EventTypeName} ' +
            '<span class="ec-badge ec-badge-danger ec-round ec-fr">{Cnt}</span></a>';
        for (var i = 0; i < oData.length; i++) {
            var cTem = ES.template(cHtml, oData[i]);
            var oLI = $(cTem);

            oLI.data('oData', oData[i]);
            this.$_oContainer.append(oLI);
        }

        this.initEvent();
    },

    initEvent: function () {
        var self = this;


        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            // 触发查询
            self.initUI({oParam:{EventTypeName:cSearchVal}});

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.oSearchInput.val();
                self.initUI({oParam:{EventTypeName:cSearchVal}});
            }, 250);
        });


        var oContainer = this.getContainer();
        oContainer.find('a').bind('click', function () {
            //$(this).siblings().removeClass('active');
            //$(this).addClass('active');
            if (self._oParent) {
                //self._oParent.fire('EventConfig:Menu.click', {oData: $(this).data('oData')});
                self._oParent.fire("jqGrid.query", {oParam:{ParentId:$(this).data('oData').Id}});
            }
        });

        oContainer.find('a:eq(0)').click();
    }
});