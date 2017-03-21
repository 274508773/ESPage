/**
 * Created by liulin on 2016/12/27.
 */
ES.HGT.OverView = {};

ES.HGT.OverView.version = '0.1.1';


ES.HGT.OverView.oConfig = {

    oUILiConfig: {
        li: {
            'class': 'flipInX in', style: 'display: block;',
            a: {
                href: '{cUrl}',
                dl: {
                    'class': 'ex-layout-counter-box',
                    dt: {b: {html: '{cTitle}'}, html: '{cUnit}'},
                    dd: [
                        {
                            em: {class: 'ex-icon-counter {cIcon}'},
                            p: {'class': 'num', html: '{nCnt}'}
                        },
                        {
                            class: 'ex-counter-bottom',
                            div: {'class': 'ex-color {cAlarmCls}', style: 'width="{nPercent}%"'}
                        }
                    ],
                }
            }
        }
    }
};

ES.HGT.OverView.Page = ES.Page.extend({


    initLayout: function () {
        $('div.ex-layout-main').attr({style:'overflow-y: auto; overflow-x: hidden;'});
    },
    


});




