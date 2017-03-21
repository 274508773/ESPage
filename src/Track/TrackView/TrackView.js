/**
 * 车辆历史轨迹
 *
 *
 * Created by liulin on 2017/2/22.
 *
 *
 * 依赖关系：
 * 1. 依赖 echart 库
 * 2. 依赖 dialog 库
 * 3. 依赖 MapLib 库
 * 4. 依赖 ESLib 库
 * 5. 依赖 MovingMarker 库
 */

ES.TrackView = {};

ES.TrackView.Version = '0.1.0';

ES.TrackView.Config= {

    oEditRoadConfig: {
        stroke: true,
        color: '#FF3300',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 1,
        fill: false,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //线路样式
    oRoadConfig: {
        stroke: true,
        color: '#5eb95e',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 7,
        opacity: 0.8,
        fill: false,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //工地样式
    oSiteConfig: {
        stroke: true,
        color: '#0FFF05',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //笑纳点样式
    oUnloadConfig: {
        stroke: true,
        color: '#FF3300',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //笑纳点样式
    oBandConfig: {
        stroke: true,
        color: '#FF3300',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //实时跟踪外层圆的样式
    oLiveCircleConfig: {
        stroke: true,
        color: '#FF3300',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 1,
        opacity: 1,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    oLiveCircleMarkerConfig: {
        fill: true,
        fillColor: '#fff',
        radius: 3,
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    },

    oTrackPosConfig:{
        fill: true,
        fillColor: '#fff',
        radius: 5,
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    },

    // 轨迹线样式
    oLiveLineConfig: {
        opacity: 1,
        color: 'blue',
        weight: 3,

    },
};