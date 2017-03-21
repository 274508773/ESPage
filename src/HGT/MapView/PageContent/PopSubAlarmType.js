/**
 * Created by liulin on 2016/12/21.
 *
 * 订阅告警类型
 */


ES.Common.Pop.SubAlarmType = ES.Common.Pop.extend({


    initButton: function () {
        var self = this;

        var aoButton = [
            {
                value: '确定',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            }
        ];

        this.oOption.button = aoButton;
    },

    save: function () {
        this.setAlarmConfig();
    },

    show: function () {
        this.oDialog.show();
    },

    // 打开窗体触发
    afterOpen: function () {

        var aoAlarmType = [
            {id: 1001, name: '无资质出土'},
            {id: 1002, name: '未上报出土'},
            {id: 1003, name: '资质过期出土'},
            {id: 1004, name: '不按规定时间出土'},
            {id: 1005, name: '未审批车辆出土'},

        ];
        this.initCheckBox(aoAlarmType);
        this.initAlarmSettings();
    },

    initAlarmSettings: function () {

        var oParam = JSON.stringify({
            UserId: m_cUserId,
            Types: []
        });

        ES.getData(JSON.stringify(oParam), ES.HGT.oConfig.cAlarmHubGet, function (oData) {
            if (!oData || oData.RetCode !== 0) {
                ES.aErr('报警类型获取失败：' + oData.RetMsg + '，稍后再试');
                return;
            }

            var types = oData.Data.Types;

            $(":input[name='_alarmTypes']").each(function () {
                var $this = $(this);
                if ($.inArray(parseInt($this.val()), types) > -1) {
                    if (!$this.is(":checked")) {
                        $this.click();
                    }
                }
                else {
                    $this.removeAttr("checked");
                }
            });

        }, this);


    },

    // 初始化
    initCheckBox: function (aoAlarmType) {
        var msg = "";
        for (var i = 0; i < aoAlarmType.length; i++) {
            msg += ES.template('<li> <label for="_type_{id}"><input type="checkbox" id="_type_{id}" name="_alarmTypes" value={id} />{name}</label></li>', aoAlarmType[i]);
        }

        $("#_ulAlarmType").html(msg);

    },

    initPopEvent: function () {


        $("#_type_sel_all").bind("click", function () {
            if ($("#_type_sel_all").is(":checked")) {
                $(":input[name='_alarmTypes']").each(function () {

                    if (!$(this).is(":checked")) {
                        $(this).click();
                    }
                });
            }
            else {
                $(":input[name='_alarmTypes']").each(function () {
                    $(this).removeAttr("checked");
                });
            }
        });

        //$("#btnAlarmSet").bind("click", function () {
        //    self.setAlarmConfig();
        //});
    },

    setAlarmConfig: function () {
        var anAlarmType = [];
        $('input[name="_alarmTypes"]').each(function () {
            if ($(this).is(":checked")) {
                anAlarmType.push(parseInt($(this).val()));
            }
        });

        if (anAlarmType.length === 0) {
            //alertPop("请选择报警类型", 1);
            return;
        }
        var oParam = JSON.stringify({
            UserId: m_cUserId,
            Types:  anAlarmType
        });
        ES.getData(
            oParam,
            ES.HGT.oConfig.cAlarmHubSet,
            this.setAlarmConfigHandler,
            this);
    },

    setAlarmConfigHandler: function (oData) {
        if (oData.RetCode === 0) {
            ES.aSucess('报警类型订阅成功！');
            this.oDialog.close();
        }
        else {
            ES.aErr('报警类型订阅成功失败：服务器异常，稍后再试');

        }
    }
});