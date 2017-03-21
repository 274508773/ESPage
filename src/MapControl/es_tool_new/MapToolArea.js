/*
 name:           ESMapToolArea.js
 des:
 date:           2016-06-02
 author:         liulin

 图层切换控件的编写


 */


ES.MapControl.ESMapToolArea = ES.Evented.extend({
    oOption: {

        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left'],

        title: '图层切换',

        // 图片地址url
        cUrl: '',

    },

    oUIConfig: {
        div: {
            'class': 'ex-maptool-box ex-control-dropmenu map-tool-area',
            i: {'class': 'ec-icon-map-marker'},
            html: '&nbsp;&nbsp;' + ES.MapControl.Config.oRegionConfig.cSwitchName + '：',
            span: {html: ES.MapControl.Config.oRegionConfig.cDefaultCityName},
            i11: {'class': 'ec-icon-angle-down'},
            ul: {
                'class': 'ec-avg-sm-2 ec-dropdown-content',
            }
        }
    },



    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);

        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;

        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));
        //L.drawLocal = ES.TrackView.Config.getDrawConfig();
        // 设置父级容器的事件
        this.setParentEvent();
        this.initUI();

        this.initCity();

    },


    // 设置父级容器的事件
    setParentEvent: function () {

    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        ES.initTag(this.$_oPContainer.eq(0), this.oUIConfig);
        //var cVal  = ES.template(this.cHTML,ES.MapControl.Config.oRegionConfig);
        //this._oContainer.eq(0).html(cVal);
        //this._oContainer.find('div.map-tool-area>ul>div>input').addClass('awesomplete');

        this.$_oContainer = this.$_oPContainer.find('.map-tool-area');
    },


    // 初始化界面，加载城市数据
    initCity: function () {
        if (!this.oOption.cUrl) {
            return;
        }
        ES.getData({nDeptId:this.oOption.nDeptId}, this.oOption.cUrl, this.initCityHandler, this);
    },

    // 设置界面
    initCityHandler: function (oData) {

        if (!oData) {
            return;
        }
        this.$_oContainer.find('div.map-tool-area>ul>li').each(function () {
            $(this).remove();
        })

        var cHtml = '<li><a href="javascript:void(0);">{Name}</a></li>';


        for (var i = 0; i < oData.length; i++) {

            var cTemp = ES.Util.template(cHtml, oData[i]);
            var oLi = $(cTemp).data('oItem', oData[i]);
            //this._oContainer.find('div.map-tool-area>ul>div').after(oLi);
            this.$_oContainer.find('ul').append(oLi);
        }

        // 设置第一个元素
        this.$_oContainer.children('span').text(oData[0].Name);
        if(oData[0].Lat &&  oData[0].Lng){
            this._oMap.flyTo([oData[0].Lat, oData[0].Lng], 14);
        }


        this.$_oContainer.find('ul>li>a').bind('click', this, function (e) {
            var cName = $(this).text().trim();
            e.data.$_oContainer.children('span').text(cName);

            // 触发点位
            var oItem = $(this).parent().data('oItem');

            if(oItem.Lat &&  oItem.Lng){
                e.data._oMap.flyTo([oItem.Lat, oItem.Lng], 14);
            }

        });
    },



});

