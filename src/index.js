import Element from 'element-ui'
import netfereJs from '../../netfere-ts'
import modal from './packages/modal.js';

import { vueAxiosInit, query, get, post } from './packages/axios'

import NfFrame from './packages/frame';
import Blank from './packages/blank';
import BlankRouter from './packages/blankRouter';
import Card from './packages/card'
import Form from "./packages/form/index"
import Table from './packages/table/index'
import Tab from './packages/tab'
import NfUpload from './packages/upload'
import NfDialog from './packages/dialog'
import Router from './packages/router';


import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './styles/extend.scss'
import './styles/public.scss'

const components = [
	NfFrame,
	Blank,
	BlankRouter,
	Form,
	Table,
	Card,
	Tab,
	NfUpload,
	NfDialog
];


const registerModule = function (store) {
	store.registerModule(['permission'], {
		namespaced: true,
		state: {
			roles: [],
			menus: []
		},
		actions: {
			setRoles: ({ commit }, val) => {
				commit('putRoles', val)
			},
			setMenus: ({ commit }, val) => {
				commit('putMenus', val)
			}
		},
		mutations: {
			putRoles: (state, val) => {
				state.roles = val;
			},
			putMenus: (state, val) => {
				state.menus = val;
			}
		}
	})

	/* uninstall(_this) {
	  store.unregisterModule(['abc'])
	} */

}

/**
 * 初始化，通过Vue.use()调用，传递opts
 * {
 *  global:null,//将工具库注册为全局变量
 *  axios:{},//配置axios全局
 * }
 * @param {*} Vue 
 * @param {Object} opts 
 */
const install = function (Vue, opts = {}) {
	Vue.use(Element)

	components.forEach(component => {
		Vue.component(component.name, component);
	});

	const $ = { ...netfereJs, ...modal };

	if (opts.store) {
		registerModule(opts.store)
	}
	//封装过的配合ElementUi便捷使用的axios
	if (opts.axios) {
		vueAxiosInit(opts.axios);
		Object.assign($, { query, get, post })
	}


	if (opts.global) {
		window[opts.global] = Vue[opts.global] = Vue.prototype[opts.global] = $;
	}

	Vue['$bus'] = Vue.prototype['$bus'] = new Vue({
		data() {
			return {
				height: 0
			}
		},
		created() {
			this.$on('resize', height => {
				this.height = height;
			})
		},
		methods: {
			init() {
				window.onresize = e => {
					this.$emit('resize', window.innerHeight)
				}
				this.$emit('resize', window.innerHeight)
			}
		},
	});
};



export default {
	version: '1.0.0',
	install
}

export {
	Router,Blank,BlankRouter
}



