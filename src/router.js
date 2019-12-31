import Router, { Blank, BlankRouter } from './packages/router.js';


/**
 * 配置meta用于控制菜单导航
 * title - 菜单名称，不存在则使用name
 * hidden - 是否隐藏,为true时将不显示在导航菜单中
 * icon - 菜单的图标class
 * index - 用于排序
 * moveup - 为true时，则此项目提前一级
 * roles - 权限数组 如 role=['user','master']
 * exclude - 排除权限 一般父级有一系列权限，某子项从中排除某项权限
 * emit - 将触发emit指定事件，此时在导航菜单中将不会跳转到对应的path，需要另行侦听emit事件
 */


export default new Router({
	progress: true,
	'404': { props: { actions: [{ text: '回首页', path: '/' }, { text: '转到登陆页', path: '/login' }] } },
	'401': { props: { actions: [{ text: '去登陆', path: '/login' }] } },
	routes: [
		{
			path: '/',
			redirect: { path: '/login' },
		},
		{
			path: '/login',
			meta: { hidden: true },
			component: () => import('./views/login')
		},
		{
			path: '/logout',
			meta: { title: '退出系统', index: 999, emit: 'logout' }
		}
	],
	on: {
		ready: instance => {
			const name = instance.getSub();
			if (['admin'].indexOf(name) > -1) {
				const { type, roles = [], expired = 0 } = JSON.parse(sessionStorage.getItem('permission') || "{}");
				if (expired > new Date().getTime()) {
					if (type === name) {
						instance.loadRoutes(adminRoutes, roles);
					} else {
						instance.force('/login')
					}
				} else {
					instance.force('/login')
				}
			}
		}
	}
});
export const adminRoutes = [
	{
		path: '/admin', name: 'index',
		redirect: { path: '/admin/home' },
		meta: { moveup: true, roles: ['master'] },
		component: () => import('./views/index.vue'),
		children: [
			{
				path: 'home', meta: { title: '概述' },
				component: () => import('./views/home.vue'),
			},
			{
				path: 'elementui',
				meta: { title: '扩展ElementUi' },
				component: BlankRouter,
				children: [
					{
						path: 'sturct', meta: { title: '项目目录结构' },
						component: () => import("./views/sturct.vue")
					}, {
						path: 'layout',
						meta: { title: '首页框架' },
						component: () => import('./views/frame.vue'),
					}, {
						path: 'router', meta: { title: '路由封装' },
						component: () => import("./views/router.vue")
					}, {
						path: 'button',
						meta: { title: '按钮Button', loading: true },
						component: () => import('./views/button.vue'),
					},
					{
						path: 'message',
						meta: { title: '弹窗消息' },
						component: () => import('./views/message.vue'),
					},{
						path: 'tab',
						meta: { title: '选项卡面板' },
						component: () => import('./views/tab.vue'),
					},  {
						path: 'form',
						meta: { title: 'Form表单及字段' },
						component: () => import('./views/form/index.vue')
					}, {
						path: 'datetime',
						meta: { title: '日期时间字段' },
						component: () => import('./views/form/datetime.vue')
					}, {
						path: 'table',
						meta: { title: 'Table表格' },
						component: () => import('./views/table/index.vue')
					}, {
						path: 'treetable',
						meta: { title: '树型表格' },
						component: () => import('./views/table/treeTable.vue')
					}, {
						path: 'upload',
						meta: { title: '上传组件' },
						component: () => import('./views/upload.vue')
					}, {
						path: 'websocket',
						meta: { title: 'WebSocket' },
						component: () => import('./views/websocket.vue')
					}
				]
			},
			{
				path: 'utils',
				meta: { title: '工具库' },
				component: BlankRouter,
				children: [
					{
						path: 'tool', meta: { title: '常用函数' },
						component: () => import('./views/tool/index.vue')
					},
					{
						path: 'axios', meta: { title: 'Axios请求' },
						component: () => import('./views/tool/axios.vue')
					}, {
						path: 'date', meta: { title: '日期时间' },
						component: () => import('./views/tool/date.vue')
					},
				]
			}
		]
	}
]
export const testRoutes = [
	{
		path: '/admin',
		redirect: { path: '/admin/home' },
		meta: { moveup: true, roles: ['admin', 'abc', 'user', 'master'] },
		component: () => import('./views/index.vue'),
		children: [
			{
				path: 'home', meta: { title: '首页' },
				component: () => import('./views/home.vue'),
			}, {
				path: 'service',
				meta: { title: '系统管理' },
				component: BlankRouter,
				children: [
					{ path: 'base', meta: { title: '基础数据', roles: ['123'], exclude: ['admin', 'user'] }, component: Blank },
					{ path: 'message', meta: { title: '消息设置' }, component: Blank }
				]
			}
		]
	}
]