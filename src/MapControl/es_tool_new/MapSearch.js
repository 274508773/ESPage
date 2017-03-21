/**
 * poi查询 ， 访问的是高德地图 的 api接口
 *
 * Created by liulin on 2017/1/19.
 */




ES.MapControl.ESMapSearch = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left'],

        className: '',
        title: '图层切换',
        // poi 查询地址
        cUrl: '/MapView/PoiSearch',

        // 具体参数含有可以查看高德MapApi
        oParam: {
            key: '',
            keywords: '',
            types: '050301',
            location: '113.22,30.333',
            city: '',
            citylimit: '',
            datatype: 'poi',
            output: 'JSON',
        },

    },

    // 查询的html代码
    cHtml: '<div class="ex-maptool-box ec-input-group ex-maptool-outSearch-box"> ' +
    '   <input type="text" name="name" placeholder="搜索" class="ec-form-field"/> ' +
    '   <span class="ec-input-group-btn"> ' +
    '       <button class="ec-btn ec-btn-default search" type="button"><span class="ec-icon-search"></span></button>   ' +
    '       <button class="ec-btn ec-btn-default clear" type="button"><span class="ec-icon-close"></span></button>' +
    '   </span>' +
    '   <div class="ex-maptool-outSearch-result">    ' +
    '       <ul>      </ul>' +
    '    </div>' +
    ' </div>',

    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);
        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;
        //图层
        this.oLayer = L.featureGroup();
        this.oInputData = null;
        this.oLayer.addTo(this._oMap);
        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));
        this.setParentEvent();
        this.initUI();

        // 注册事件
        this.initToolEvent();
    },


    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        //L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {

        this.$_oContainer = $(this.cHtml);

        this.$_oPContainer.eq(0).append( this.$_oContainer);

        this.$_oSearchRtn =   this.$_oContainer.find('div.ex-maptool-outSearch-result');

        this.$_oSearchRtn.hide();

        // 查询项
        this.$_oUL = this.$_oContainer.find('div.ex-maptool-outSearch-result>ul');

        // 清空
        this.$_oUL.empty();

        // 查询输入框
        this.$_oInput = this.$_oContainer.find('input');

        // 清空
        this.$_btnClear = this.$_oContainer.find('button.clear');

        // 查询
        this.$_btnSearch = this.$_oContainer.find('button.search');

    },

    //初始化工具栏事件
    initToolEvent: function () {
        var self = this;
        var bTo = false;
        // 给input 注册事件,防止快捷查询
        this.$_oInput.keyup(function (e) {
            var myEvent = e || window.event;
            var keyCode = myEvent.keyCode;
            if (keyCode == 38 || keyCode == 40) {
                return;
            }
            // 判断查询结果是否为上次的查询结果
            if(self.oInputData && self.oInputData.name === self.$_oInput.val()) {
                return;
            }

            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.$_oInput.val();
                var oLatLng = self._oMap.getCenter();
                var oParam = {};
                ES.extend(oParam, self.oOption.oParam, {
                    keywords: cSearchVal,
                    location: oLatLng.lng + ',' + oLatLng.lat
                });
                ES.getData(oParam, self.oOption.cUrl, self.searchPoiHandler, self);
            }, 250);
        });


        $(document).keydown(function (e) {
            // 没有显示不执行
            if (self.$_oSearchRtn.css("display") === "none") {
                return;
            }
            var myEvent = e || window.event;
            var keyCode = myEvent.keyCode;

            if (keyCode === 38) {
                self.movePrev();
            } else if (keyCode === 40) {
                self.moveNext();
            }
            // 扑捉回车按钮 ， 然后定位当前的位置信息
            if(keyCode === 13) {
                self.localPos();
            }
        });

        // 注册按钮时间
        this.$_btnClear.bind('click', function () {
            self.oLayer.clearLayers();
            self.$_oInput.val('');
        });

        // 查询事件
        this.$_btnSearch.bind('click', function () {
            var cSearchVal = self.$_oInput.val();
            var oLatLng = self._oMap.getCenter();
            var oParam = {};
            ES.extend(oParam, self.oOption.oParam, {
                keywords: cSearchVal,
                location: oLatLng.lng + ',' + oLatLng.lat
            });
            ES.getData(oParam, self.oOption.cUrl, self.searchPoiHandler, self);
        });
    },

    // 定位 当前位置,
    localPos:function() {

        this.oLayer.clearLayers();
        var $_oLI = this.$_oUL.find("li.ec-active");
        var oData = $_oLI.data('oData');

        var oMarker = L.marker([oData.lat, oData.lng]);
        oMarker.oData = oData;
        // 创建点
        oMarker.addTo(this.oLayer);

        this._oMap.flyTo([oData.lat, oData.lng], 16);
        // 给文本框赋值
        this.$_oInput.val(oData.name);

        this.oInputData = oData;

        this.$_oUL.empty();
        this.$_oSearchRtn.hide();
    },


    // 光标上移动 38
    movePrev: function () {
        var index = this.$_oUL.find("li.ec-active").prevAll().length;

        if (index == 0) {
            this.$_oInput.focus();
            // 文本框选中
            return false;                                                            //不可循环移动
        }
        else {
            this.$_oUL.find("li").removeClass('ec-active').eq(index - 1).addClass('ec-active');
            var oData = this.$_oUL.find("li").eq(index - 1).data('oData');

            this.$_oInput.val(oData.name);
        }
    },

    // 光标下移动 40
    moveNext: function () {
        var index = this.$_oUL.find("li.ec-active").prevAll().length;

        if(index === 0 && !this.$_oUL.find("li").eq(0).hasClass('ec-active')){
            this.$_oUL.find("li").eq(0).addClass('ec-active');
            var oData = this.$_oUL.find("li").eq(0).data('oData');
            this.$_oInput.val(oData.name);
            return;
        }

        if (index === this.$_oUL.find("li").length - 1) {
            return false;                                                //不可循环移动
        }
        else {
            this.$_oUL.find("li").removeClass('ec-active').eq(index + 1).addClass('ec-active');
            var oData = this.$_oUL.find("li").eq(index + 1).data('oData');
            this.$_oInput.val(oData.name);
        }
    },

    // 查询处理
    searchPoiHandler: function (oData) {
        this.$_oUL.empty();
        this.$_oSearchRtn.hide();

        if (!oData || oData.status === 0 || oData.count <= 0) {
            return;
        }
        // 加载数据
        for (var i = 0; i < oData.tips.length; i++) {
            if (oData.tips[i].lng === 0) {
                continue;
            }
            oData.tips[i].cDist = oData.tips[i].district||'';
            var $_li = $(ES.template('<li class="location"><b>{name}</b><span>{cDist}</span></li>', oData.tips[i]));
            $_li.data('oData', oData.tips[i]);
            this.$_oUL.append($_li);


            $_li.bind('click',this, function (e) {
                e.data.localPos();
            });
            $_li.bind('mouseover', function () {
               $(this).addClass('ec-active');
            });
            $_li.bind('mouseout', function () {
                $(this).removeClass('ec-active');
            });
        }
        this.$_oSearchRtn.show();

    }


});