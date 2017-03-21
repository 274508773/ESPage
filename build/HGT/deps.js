/**
 * 红谷滩编译 文件
 *
 * Created by liulin on 2016/12/22.
 */


var deps = {

	Core: {
		src: [
			'HGT/HGTConfig.js',
		],
		desc: '版权说明文件.'
	},

	Hub: {
		src: [
			'HGT/HubSvr/hubSvr.js',

		],
		desc: 'hub 告警、车辆出入、轨迹hub 基类.',
		deps: ['Core']
	},


	MapView: {

		src: [
			'Unit/TrackHelper.js',
			'HGT/MapView/MapView.js',
			// hub 定义

			'HGT/MapView/Menu.js',
			// 小部分 右边小部分
			'HGT/MapView/TabPanel/TabPanel.js',
			'HGT/MapView/TabPanel/JsTreeEx.js',
			'HGT/MapView/TabPanel/SiteTree.js',
			'HGT/MapView/TabPanel/VideoTree.js',
			//临时工地
			'HGT/MapView/TabPanel/SiteTempTree.js',
			// 设备树控制
			'HGT/MapView/TabPanel/VehTree.js',
			// 人员树控制
			'HGT/MapView/TabPanel/UserTree.js',
			// 路网树控制
			'HGT/MapView/TabPanel/LineTree.js',

			// 车辆列表和分页控件
			'HGT/MapView/TabPanel/ListView/LstPager.js',
			'HGT/MapView/TabPanel/ListView/VehLst.js',
			'HGT/MapView/TabPanel/ListView/UserLst.js',

			// 地图基础控件
			'HGT/MapView/PageContent/Layout.js',
			'HGT/MapView/PageContent/AlarmCtrl.js',
			'HGT/MapView/PageContent/PopSubAlarmType.js',


			'HGT/MapView/Box/ReceiveAlarm.js',
			'HGT/MapView/Box/VehInOut.js',
			'HGT/MapView/Box/SiteStatic.js',
			'HGT/MapView/Box/PopSiteInfo.js',

			// 图层管理
			'HGT/MapView/PopTabPage/TabPage.js',
			'HGT/MapView/VideTabPanel.js',

			// 视频监控
			'HGT/MapView/Video/VideoBox.js',

			// 数据请求
			//'HGT/MapView/ReqTrack/ReqTrack.js',


		],

		desc: 'HGT 作为基础来包装地图实时监控, 概览页面',
		deps: ['Hub']
	},

	MapLayer: {
		src: [
			// 图层管理
			// 工地图层
			'HGT/MapView/Layer/SiteLayer.js',
			// 边界图层
			'HGT/MapView/Layer/RegionBoundLayer.js',
			// 云图图层
			'HGT/MapView/Layer/CloudLayer.js',

			'HGT/MapView/Layer/VehRealTrack/LiveMange.js',
			'HGT/MapView/Layer/VehRealTrack/MapLive.js',

			'HGT/MapView/Layer/UserRealTrack/LiveMange.js',
			'HGT/MapView/Layer/UserRealTrack/MapLive.js',
			'HGT/MapView/Layer/UserRealTrack/UserLayer.js',
		],
		desc: '地图图层，实时监控的地图操作',
		deps: ['MapView']
	},

	OverView: {
		src: [

			// 概览页面管理
			'HGT/OverView/OverView.js',
			'HGT/OverView/Header.js',
			'HGT/OverView/Region.js',
			'HGT/OverView/TodayStatic.js',
			'HGT/OverView/YesdayStatic.js',


			// 概览页面的图表操作
			'HGT/OverView/chart/BaseChart.js',
			'HGT/OverView/chart/AlarmStaticChart.js',
			'HGT/OverView/chart/DataStaticChart.js',
			'HGT/OverView/chart/CuteStaticChart.js',
			// 当日违规统计
			'HGT/OverView/chart/DayAlarmStaticChart.js',

		],

		desc: 'HGT 作为基础来包装地图实时监控, 概览页面',
		deps: ['Core']

	},

	CloudMap: {
		src: [
			// 云图的做法
			'HGT/CloudMap/CloudMap.js',
			'HGT/CloudMap/Layout.js',
			'HGT/CloudMap/EditTool.js',
			'HGT/CloudMap/TagTree.js',
			'HGT/CloudMap/CloudMapLayout.js',
			'HGT/CloudMap/TreeFrame.js',
			'HGT/CloudMap/PopWnd/PopWnd.js',
			'HGT/CloudMap/PopWnd/PopDel.js',
			'HGT/CloudMap/ShowLayer.js',

		],

		desc: 'HGT 作为基础来包装地图实时监控, 概览页面',
		deps: ['Core']

	},

	EventConfig: {
		src: [
			// 考核配置
			'HGT/EventConfig/EventConfig.js',
			'HGT/EventConfig/Menu.js',
			'HGT/EventConfig/Grid.js',
		],

		desc: 'HGT 作为基础来包装地图实时监控, 概览页面',
		deps: ['Core']

	},

	CloudMapForPO: {
		src: [
			'HGT/CloudMap/PO/EditTool.js',
			'HGT/CloudMap/PO/CreatePos.js',

			'HGT/CloudMap/PO/TagTree.js',
			'HGT/CloudMap/PO/TreeFrame.js',
			'HGT/CloudMap/PO/PostPosLayer.js',

		],
		desc: 'PO 邮局项目',
		deps: ['CloudMap']
	},
};




if (typeof exports !== 'undefined') {
	exports.deps = deps;

}
