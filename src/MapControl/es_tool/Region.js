/**
 * Created by liulin on 2016/11/23.
 *
 */

ES.MapControl.Region = ES.Class.extend({

    options: {
        position: 'topleft',
        className: 'es-map-tool',
        autoZIndex: true,
    },

    oUIInfo: {
        'class': 'mapLocation map-t-box',
        div: {
            'class': 'col-md-6',
            div: [
                {
                    'class': 'ui-dropdown item',
                    style: 'cursor: default;float: left;  margin-top: 1em;',
                    i: {'class': 'icon-pointer', html: '区域'}
                },
                {
                    'class': 'ui-dropdown item  localCenter',
                    style: 'width: 7em;text-overflow: ellipsis;line-height: 3em;float: left;',//overflow: hidden;
                    span: {cid: 'divCenterPos', html: L.MapLib.Control.Config.deptName + '&nbsp;',},
                    i: {'class': 'fa fa-angle-down'},
                    div: {
                        cid: 'divMapCenter',
                        'class': 'map-loaction sub-menu',
                        style: 'display:none',
                    }
                }
            ]
        }
    },

    // 注册事件
    initEvent: function () {
        if ($.trim($('span[cid="divCenterPos"]').text()) === ES.MapControl.Config.wuhan) {
            $('.localCenter').bind('click', this, function () {
                if ($('div[cid="divMapCenter"]').css('display') === 'none') {
                    $('div[cid="divMapCenter"]').css('display', 'inline-block');
                }
                else {
                    $('div[cid="divMapCenter"]').css('display', 'none');
                }
            });
        }
    },

    // 添加控件
    onAdd: function (oContainer) {

        if (!oContainer) {
            return;
        }

        this._oContainer = oContainer;

        // 初始化容器
        ES.Util.initTag(oContainer, this.oUIInfo);

        return this;
    },


});