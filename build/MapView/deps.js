/**
 * 视频监控编译 文件
 *
 * Created by liufangzhou on 2017/3/22.
 */



var deps = {
	Core: {
		src: [
			'MapView/MapView.js',
		],
		desc: '版权说明文件.'
	},


	MapView: {

		src: [
			'Unit/TrackHelper.js',

			'MapView/Menu.js',
			// 小部分 右边小部分
			'MapView/TabPanel/TabPanel.js',
			'MapView/TabPanel/JsTreeEx.js',
			'MapView/TabPanel/SiteTree.js',
			'MapView/TabPanel/VideoTree.js',
			//临时工地
			'MapView/TabPanel/SiteTempTree.js',
			// 设备树控制
			'MapView/TabPanel/VehTree.js',
			// 人员树控制
			'MapView/TabPanel/UserTree.js',
			// 路网树控制
			'MapView/TabPanel/LineTree.js',

			// 车辆列表和分页控件
			'MapView/TabPanel/ListView/LstPager.js',
			'MapView/TabPanel/ListView/VehLst.js',
			'MapView/TabPanel/ListView/UserLst.js',

			// 地图基础控件
			'MapView/PageContent/Layout.js',
			'MapView/PageContent/AlarmCtrl.js',
			'MapView/PageContent/PopSubAlarmType.js',


			'MapView/Box/ReceiveAlarm.js',
			'MapView/Box/VehInOut.js',
			'MapView/Box/SiteStatic.js',
			'MapView/Box/PopSiteInfo.js',

			// 图层管理
			'MapView/PopTabPage/TabPage.js',
			'MapView/VideTabPanel.js',

			// 视频监控
			'MapView/Video/VideoBox.js',

			'MapView/Layer/LineLayer.js',
			'MapView/Layer/SiteLayer.js',
			'MapView/Layer/RegionBoundLayer.js',
			'MapView/Layer/VehRealTrack/LiveMange.js',
			'MapView/Layer/VehRealTrack/MapLive.js',
			'MapView/ReqTrack/ReqTrack.js',

		],

		desc: '地图实时监控, 概览页面',
		deps: ['Core']
	}

};


if (typeof exports !== 'undefined') {
	exports.deps = deps;

}
