/**
 * Created by liulin on 2016/12/19.
 *
 * 菜单控件，负责div tab 的切换
 *
 */


ES.HGT.MapView.Menu = ES.Evented.extend({
    // 界面结果,整个界面都要装在div里
    oMenuConfig: {
        ul: {
            'class': 'ex-layout-menu ex-theme-menu ec-avg-md-1',
            li: [
                {
                    'class': 'ec-active flip',
                    i: {'class': 'ec-icon-sitemap'},
                    span: {html: '工地地图'},
                    'tree-title': '工地地图',
                    'data-band': 'MapView:VehLst.onAllSearch',
                    'data-param': 'site',
                    'Object':'ES.HGT.MapView.TabPanel.SiteTree'
                },
                {
                    'class': 'flip',
                    i: {'class': 'ec-icon-code-fork'},
                    span: {html: '路网'},
                    'tree-title': '路网',
                    'data-band': 'MapView:VehLst.onAllSearch',
                    'data-param': 'lineTree',
                    'Object':'ES.HGT.MapView.TabPanel.LineTree'
                },
                {
                    'class': 'flip',
                    i: {'class': 'ec-icon-building'},
                    span: {html: '工地视频'},
                    'tree-title': '工地视频',
                    'data-band': 'MapView:StruckBox.initSiteTree',
                    'data-param': 'vedio',
                    'Object':'ES.HGT.MapView.TabPanel.VideoTree'
                },
                {
                    'class': 'flip',
                    i: {'class': 'ec-icon-truck'},
                    span: {html: '执法车辆'},
                    'tree-title': '组织架构',
                    'list-title': '执法车辆',
                    'data-band': 'MapView:VehLst.onAllSearch',
                    'data-param': 'vehTree',
                    'Object':'ES.HGT.MapView.TabPanel.VehTree',
                    'ListView':'ES.HGT.MapView.TabPanel.VehLst',
                    'list-url':'/MapView/QueryVeh',
                },

                {
                    'class': 'flip',
                    i: {'class': 'ec-icon-user'},
                    span: {html: '执法人员'},
                    'tree-title': '组织架构',
                    'data-band': 'MapView:VehLst.onAllSearch',
                    'data-param': 'userTree',
                    'Object':'ES.HGT.MapView.TabPanel.UserTree',
                    'ListView':'ES.HGT.MapView.TabPanel.UserLst',
                    'list-title':'执法人员',
                    'list-url':'/User/GetUserList',
                },

            ]
        }
    },

    oOption: {
        // 是否动态创建
        bIsCreate: true,
        cContainerSel: '.ex-layout-main',
        acContainer: ['ex-layout-menu', 'ex-theme-menu', 'ec-avg-md-1'],

    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        ES.extend(this.oMenuConfig,oOption.oMenuConfig);
        this._aoPanel = [];


        // 初始化界面
        this.initUI();

        // 初始化事件
        this.initMenuEvent();

        this.initAn();
    },


    // 加载菜单选项
    initUI: function () {
        var $_oContainer = null;
        if (this.oOption.bIsCreate) {
            $_oContainer = ES.getTag(this.oMenuConfig);
            $(this.oOption.cContainerSel).append($_oContainer);
        }

        $_oContainer.css({width: '40px', float: 'left'});
        $_oContainer.children('li').width(40);
        $_oContainer.find('span').hide();

        this.$_oContainer = $_oContainer;
    },

    // 初始化节点
    initMenuEvent: function () {

        var self = this;
        var $_oContainer = this.$_oContainer;

        // 没有查询面板的查询，侧边栏选项显示车辆列表和父选框事件
        $_oContainer.find('li.level').bind('click', function () {
            //$('.ex-layout-carlist-search').find('.ec-form-field').val('');
            var _i = $(this).index();
            //var _title = $(this).html();
            $('.ex-layout-menu > li').removeClass('ec-active in').eq(_i).addClass('ec-active in');

            // 隐藏显示查询树
            self._oParent.fire('MapView:StruckBox.hideBox');

            // 触发在线查询接口
            self._oParent.fire($(this).attr('data-band'), {
                oSearchParam: {cFlag: $(this).attr('data-param')}
            });

            self.setTitle($(this).attr('lst-title'));
            // 点击时 ，直接传数据到lst列表
        });

        // 有查询面板的查询
        $_oContainer.find('li').not('.level').bind('click', function () {
            //$('.ex-layout-carlist-search').find('.ec-form-field').val('');
            var _i = $(this).index();

            $('.ex-layout-menu > li').removeClass('ec-active in').eq(_i).addClass('ec-active in');

            self._oParent.fire('MapView:StruckBox.showBox', {oParam: {cTitle: $(this).text()}});

            self._oParent.fire('Menu:click', {cFlag: $(this).attr('data-param')});

            var oTemp = {
                // 当前面板的标志
                cFlag: $(this).attr('data-param'),
                cTitle: $(this).attr('tree-title'),
                cObject:$(this).attr('Object'),
                cListView:$(this).attr('ListView'),
                cListTitle:$(this).attr('list-title'),
                cUrl:$(this).attr('list-url'),
            }

            self.createPanel(oTemp);
        });

        $_oContainer.find('li').eq(0).click();
    },

    // 加载动画
    initAn: function () {
        var self = this;
        var $_oContainer = this.$_oContainer;
        //侧边栏选项显示文字事件
        $_oContainer.find('li').bind('mouseover', function () {

            $(this).find('span').show();
            //改变地图宽度发送消息
            self._oParent.fire('MapView:Map.outMap');
        });

        //侧边栏选项隐藏文字事件
        $_oContainer.find('li').bind('mouseout', function () {

            $(this).find('span').hide();
            self._oParent.fire('MapView:Map.inMap');
        });

    },


    // 创建面板
    createPanel: function (oTemp) {
        var bIn = false;
        if( this._aoPanel.length<=0){
            var oPenel = new ES.HGT.MapView.TabPanel(this._oParent, oTemp);
            this._aoPanel.push(oPenel);
            return;
        }

        var bIn = false;
        for (var i = 0; i < this._aoPanel.length; i++) {
            if (this._aoPanel[i].cFlag === oTemp.cFlag) {
                this._aoPanel[i].showBox();
                bIn = true;
                this._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width() -40 - this._aoPanel[i].getWidth()});
            }
            else {
                this._aoPanel[i].hideBox();
            }
        }
        if (!bIn) {
            var oPenel = new ES.HGT.MapView.TabPanel(this._oParent, oTemp);
            this._aoPanel.push(oPenel);
        }
    }

});
