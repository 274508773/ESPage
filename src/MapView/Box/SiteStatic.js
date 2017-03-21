/**
 * Created by liulin on 2016/12/23.
 *
 *
 * 界面 下面的统计数据
 */


ES.HGT.MapView.SiteStatic = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-map-bottom', 'ex-map-left'],

        className: '',
        title: '工地显示',
        cUrl: '/Site/GetMapMonitorSiteStatic'
        //cMapTileUrl: '/Asset/scripts/ESLib/MapControl/DivMapTile.html',
    },

    oUIConfig: {
        ul: {
            'class': 'ex-site-counter-box ec-avg-sm-4',
            li: [
                {
                    'class': 'flipInX in',
                    style: 'display:block',
                    dl: {
                        'class': 'ex-inside-counter-box',
                        dt: {
                            html: '出土工地', div: {
                                class: 'ex-monitor-mapicon-site green-unearthed ex-inside-counter',
                                div: [{'class': 'site-body'}, {'class': 'site-state '}]
                            }
                        },
                        dd: {
                            p: {
                                'class': 'num site-green',
                                span: {html: '0','cFlag':'site_work'},
                                sub: '个'
                            }
                        }
                    }
                },
                {
                    'class': 'flipInX in',
                    style: 'display:block',
                    dl: {
                        'class': 'ex-inside-counter-box',
                        dt: {
                            html: '临时工地', div: {
                                class: 'ex-monitor-mapicon-site yellow ex-inside-counter',
                                div: [{'class': 'site-body'}, {'class': 'site-state '}]
                            }
                        },
                        dd: {
                            p: {
                                'class': 'num site-yellow',
                                span: {html: '0','cFlag':'site_temp'},
                                sub: '个'
                            }
                        }
                    }
                },
                {
                    'class': 'flipInX in',
                    style: 'display:block',
                    dl: {
                        'class': 'ex-inside-counter-box',
                        dt: {
                            html: '未审批出土工地', div: {
                                class: 'ex-monitor-mapicon-site red ex-inside-counter',
                                div: [{'class': 'site-body'}, {'class': 'site-state '}]
                            }
                        },
                        dd: {
                            p: {
                                'class': 'num site-red',
                                span: {html: '0','cFlag':'site_uncheck'},
                                sub: '个'
                            }
                        }
                    }
                },
                {
                    'class': 'flipInX in',
                    style: 'display:block',
                    dl: {
                        'class': 'ex-inside-counter-box',
                        dt: {
                            html: '非规定时间出土工地', div: {
                                class: 'ex-monitor-mapicon-site red ex-inside-counter',
                                div: [{'class': 'site-body'}, {'class': 'site-state '}]
                            }
                        },
                        dd: {
                            p: {
                                'class': 'num site-red',
                                span: {html: '0','cFlag':'site_illegal'},
                                sub: '个'
                            }
                        }
                    }
                },
            ]
        }
    },

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);

        // 获得地图控件
        this._oParent = oParent;

        this._oContainer = $('.' + this.oOption.acParentDivClass.join('.'));
        this._oContainer.css({width: '80%'});
        this.initUI();


    },


    //加载工具事件，初始化工具栏
    initUI: function () {
        ES.initTag(this._oContainer.eq(0), this.oUIConfig);
        //this.initData();
        ES.getData({nDeptId: ES.HGT.oConfig.nDeptId}, this.oOption.cUrl, this.dataHandler, this);

    },

    //初始化工具栏事件
    dataHandler: function (oData) {
        this._oContainer.find('p.num.site-green>span').html(oData[0] ? oData[0].Cnt : 0);
        this._oContainer.find('p.num.site-green>span').data('anLst',oData[0].lstSiteId);

        this._oContainer.find('p.num.site-yellow>span').html(oData[1] ? oData[1].Cnt : 0);
        this._oContainer.find('p.num.site-yellow>span').data('anLst',oData[1].lstSiteId);

        this._oContainer.find('p.num.site-red:eq(0)>span').html(oData[2] ? oData[2].Cnt : 0);
        this._oContainer.find('p.num.site-red:eq(0)>span').data('anLst',oData[2].lstSiteId);

        this._oContainer.find('p.num.site-red:eq(1)>span').html(oData[3] ? oData[3].Cnt : 0);
        this._oContainer.find('p.num.site-red:eq(1)>span').data('anLst',oData[3].lstSiteId);

        var self = this;

        this._oContainer.find('li').bind('click', function () {
            self._oParent.fire('MapView:SiteStatic.Select',{anLst :$(this).find('p.num span').data('anLst')});
        });

    },

});