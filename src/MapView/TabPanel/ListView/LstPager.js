/**
 * Created by liulin on 2017/2/5.
 *
 * 车辆列表的分页控件
 *
 */



ES.HGT.MapView.TabPanel.LstPager = ES.Evented.extend({

    oOption: {
        // 页数
        nPage: 0,
        // 每页的记录数量
        nPageSize: 10,
        nPageIndex: 1,
        nBtnCnt: 6,
        nTotalCnt: 11,
    },


    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.$_oPanel = oOption.$_oPanel;

        this.$_aoLI =this.$_oPanel.find('.ex-layout-carlist-page > ul > li');

        this.calPage();
        // 初始化界面
        this.initBtn();
        this.initUI();
        this.initEven();
        this.initOn();

        //记录当前的页号
        this.nPageIndex = 2;
    },

    //计算中页数
    calPage: function () {
        if (this.oOption.nTotalCnt <= 0) {
            this.oOption.nPage = 0;
        }
        else {
            if (this.oOption.nTotalCnt % this.oOption.nPageSize == 0) {
                this.oOption.nPage = this.oOption.nTotalCnt / this.oOption.nPageSize;
            }
            else {
                this.oOption.nPage = parseInt(this.oOption.nTotalCnt / this.oOption.nPageSize) + 1;
            }
        }
    },

    // 根据当前的 页总数，页号，来初始化界面的分页按钮
    initUI: function () {
        // 按钮总数
        var nBtnCnt = this.oOption.nBtnCnt;
        // 页数
        var nPage = this.oOption.nPage;

        var aoLi = this.$_oPanel.find('.ex-layout-carlist-page > ul>li');

        //aoLi.removeClass("ec-disabled");

        //如果一条数据都没有 返回
        if (nPage == 0) {
            aoLi.addClass("ec-disabled");
            return;
        }

        // 初始化按钮数据
        aoLi.each(function (i) {
            if (i == 0 || i == 1) {
                $(this).addClass("ec-disabled");
            }
            else if (i == (nBtnCnt - 1) || i == (nBtnCnt - 2)) {
                if (nPage <= (nBtnCnt - 4)) {
                    $(this).addClass("ec-disabled");
                }
            }
            // 当存在分页按钮的情况下
            if (nBtnCnt > 4) {
                if (i == 2) {
                    $(this).addClass("ec-active");
                }
                else {
                    if ((i - 1) > nPage) {
                        $(this).addClass("ec-disabled");
                    }
                }
            }
        })

    },

    initOn: function () {

        this._oParent.on("MapView:Pager.reflashPager", this.reflashPager, this);
    },

    reflashPager: function (oData) {
        this.oOption.nTotalCnt = oData.nTotalCnt;

        this.calPage();
        this.initBtn();
        this.initUI();
        this.initEven();
        this.nPageIndex = 2;
    },

    initEven: function () {

        var self = this;
        //点击最后一个按钮
        var nLstIndex = this.oOption.nBtnCnt - 1;
        //下一页
        var nNextPage = this.oOption.nBtnCnt - 2;
        //分页按钮个数
        var nBtnPageCnt = this.oOption.nBtnCnt - 4;
        // 总条数
        var nTotalCnt = this.oOption.nTotalCnt
        // 页数
        var nPage = this.oOption.nPage;
        //每页的个数
        var nPageSize = this.oOption.nPageSize;

        var aoLi = this.$_oPanel.find('.ex-layout-carlist-page > ul>li')
        //点击第一个按钮时
        aoLi.eq(0).bind('click', function () {

            if ($(this).hasClass("ec-disabled")) return;

            $(this).addClass("ec-disabled");
            aoLi.eq(1).addClass("ec-disabled");

            //设置翻页可用
            if (nPage > nBtnPageCnt) {
                aoLi.eq(nLstIndex).removeClass("ec-disabled");
                aoLi.eq(nNextPage).removeClass("ec-disabled");
            }

            aoLi.removeClass("ec-active");

            //修改页号,并设置是否可用
            for (var i = 2 ; i < nNextPage; i++) {
                aoLi.eq(i).find("a").html(i - 1);
                if (i == 2) {// 触发查询
                    self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: 1 } });
                    aoLi.eq(i).addClass("ec-active");
                }
                aoLi.eq(i).removeClass("ec-disabled");
                if (i > self.oOption.nPage) {
                    aoLi.eq(i).addClass("ec-disabled");
                }
            }

            if (nBtnPageCnt == 0) {
                self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: 1 } });
            }

            // 按钮的分页 次数
            self.nPageIndex = 2;
        })

        aoLi.eq(nLstIndex).bind('click', function () {

            if ($(this).hasClass("ec-disabled")) return;
            $(this).addClass("ec-disabled");
            aoLi.eq(nNextPage).addClass("ec-disabled");

            if (self.oOption.nPage > nBtnPageCnt) {
                aoLi.eq(0).removeClass("ec-disabled");
                aoLi.eq(1).removeClass("ec-disabled");
            }
            if (nBtnPageCnt == 0) {
                self.nPageIndex = nPage
                self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nPage } });
            }
            else {
                self.nPageIndex = Math.ceil(nPage / nBtnPageCnt);
            }

            var nBegin = nBtnPageCnt * (self.nPageIndex - 1);

            //修改页号,并设置是否可用
            for (var i = 2 ; i < nNextPage; i++) {

                nBegin = nBegin + 1
                aoLi.eq(i).find("a").html(nBegin);
                if (i == 2) {
                    self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nBegin } });
                    aoLi.eq(i).addClass("ec-active");
                }
                aoLi.eq(i).removeClass("ec-disabled");
                if (nBegin > nPage) {
                    aoLi.eq(i).addClass("ec-disabled");
                }
            }


            //aoLi.removeClass("ec-active");
            //aoLi.eq(nLstIndex - 1).addClass("ec-active");

            self.nPageIndex = self.nPageIndex + 1;

        })

        // 点击中间的分页按钮，如果分页按钮不可用，不能触发点击，
        aoLi.bind('click', function () {
            // 如果不是点击中间任何一个按钮，返回
            if ($(this).index() == 0
                || $(this).index() == 1
                || $(this).index() == nNextPage
                || $(this).index() == nLstIndex) return;

            if ($(this).hasClass("ec-disabled")) return;

            aoLi.removeClass("ec-active");

            $(this).addClass("ec-active");
            // 触发查询
            var nSearchPage = parseInt($(this).find("a").text());

            self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nSearchPage } });
        })

        // 绑定下一页按钮事件
        aoLi.eq(nNextPage).bind('click', function () {

            if ($(this).hasClass("ec-disabled")) return;
            //有按钮情况
            if (nBtnPageCnt > 0) {
                var nBegin = nBtnPageCnt * (self.nPageIndex - 1);
                //修改页号,并设置是否可用
                for (var i = 2 ; i < nNextPage; i++) {

                    nBegin = nBegin + 1;
                    aoLi.eq(i).find("a").html(nBegin);
                    aoLi.eq(i).removeClass("ec-active");
                    if (i == 2) {
                        self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nBegin } });
                        aoLi.eq(i).addClass("ec-active");
                    }

                    aoLi.eq(i).removeClass("ec-disabled");

                    //设置完成后，修改按钮的状态
                    if ((nBegin * nPageSize - nTotalCnt) > nPageSize) {
                        aoLi.eq(i).addClass("ec-disabled");

                    }
                    if (nBegin * nPageSize > nTotalCnt) {
                        $(this).addClass("ec-disabled");
                        aoLi.eq(nLstIndex).addClass("ec-disabled");
                    }

                    aoLi.eq(0).removeClass("ec-disabled");
                    aoLi.eq(1).removeClass("ec-disabled");
                }
            } else {
                //无分页按钮情况
                if (self.nPageIndex * nPageSize < nTotalCnt) {

                    aoLi.eq(0).removeClass("ec-disabled");
                    aoLi.eq(1).removeClass("ec-disabled");
                }
                else {
                    $(this).addClass("ec-disabled");
                    aoLi.eq(nLstIndex).addClass("ec-disabled");
                }

                self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: self.nPageIndex } });
            }

            //下一页的预备
            self.nPageIndex = self.nPageIndex + 1;
        })

        //绑定上一页按钮事件
        aoLi.eq(1).bind('click', function () {
            //如果按钮不可用，返回，不做任何操作
            if ($(this).hasClass("ec-disabled")) return;

            //有按钮情况
            if (nBtnPageCnt > 0) {
                //计算下一页的开始值 nPageIndex 为下一页的值，故实际当前页为 nPageIndex -1
                // 然而你要返回到上一页，则上一页的值为 nPageIndex -1 -1
                var nBegin = nBtnPageCnt * (self.nPageIndex - 3);
                //修改页号,并设置是否可用
                for (var i = 2 ; i < nNextPage; i++) {
                    nBegin = nBegin + 1;
                    aoLi.eq(i).find("a").html(nBegin);
                    if (i == 2) {
                        self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nBegin } });
                        aoLi.eq(i).addClass("ec-active");
                    }
                    aoLi.eq(i).removeClass("ec-disabled");
                }
                //设置完成后，修改按钮的状态
                if (nBegin == nBtnPageCnt) {
                    $(this).addClass("ec-disabled");
                    aoLi.eq(0).addClass("ec-disabled");
                }

                aoLi.eq(nNextPage).removeClass("ec-disabled");
                aoLi.eq(nLstIndex).removeClass("ec-disabled");

            }
            else {
                //无分页按钮情况
                if (self.nPageIndex == 3) {
                    $(this).addClass("ec-disabled");
                    aoLi.eq(0).addClass("ec-disabled");

                    aoLi.eq(nNextPage).removeClass("ec-disabled");
                    aoLi.eq(nLstIndex).removeClass("ec-disabled");
                }
                self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: self.nPageIndex - 2 } });
            }

            //下一页的预备
            self.nPageIndex = self.nPageIndex - 1;
        })
    },

    initBtn: function () {
        var aoUL = this.$_oPanel.find('.ex-layout-carlist-page > ul');
        aoUL.empty();
        // 按钮个数 分页至少有4个按钮
        for (var i = 0; i < this.oOption.nBtnCnt  ; i++) {
            if (i == 0) {
                //添加第一页，和上一页
                aoUL.append($('<li><a href="javascript:;"><i class="ec-icon-angle-double-left"></i></a></li>'));
                continue;
            }
            if (i == 1) {
                aoUL.append($('<li><a href="javascript:;"><i class="ec-icon-angle-left"></i></a></li>'));
                continue;
            }
            if (i == (this.oOption.nBtnCnt - 1)) {
                aoUL.append($('<li><a href="javascript:;"><i class="ec-icon-angle-double-right"></a></li>'));
                continue;
            }
            if (i == (this.oOption.nBtnCnt - 2)) {
                aoUL.append($('<li><a href="javascript:;"><i class="ec-icon-angle-right"></i></a></li>'));
                continue;
            }

            //添加中间按钮
            aoUL.append($('<li><a href="javascript:;">' + (i - 1) + '</a></li>'));

        }
    },
})