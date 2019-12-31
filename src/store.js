import Vue from 'vue'
import Vuex from 'vuex'
import { $ } from '../src/packages/utils';
//import { apply } from './packages/storeUtil'
Vue.use(Vuex)

const getValueByPath = function (object, prop) {
	prop = prop || '';
	const paths = prop.split('.');
	let current = object;
	let result;
	let lastProp;
	const getVal = (obj, path) => {
		if (/\d+/.test(path) && Array.isArray(obj)) {
			lastProp = Number(path)
			return obj.length > lastProp ? obj[lastProp] : obj[path];
		} else {
			lastProp = path;
			return obj[path]
		}
	}
	for (let i = 0, j = paths.length; i < j; i++) {
		const path = paths[i];
		if (!current) break;
		if (i === j - 1) {
			result = getVal(current, path);
		} else {
			current = getVal(current, path);
		}
	}
	return { owner: current, value: result, prop: lastProp };
}

const set = (state, item) => {
	const { key, value, mode = 'update', push = true, find } = item;
	const { owner, prop } = getValueByPath(state, key);
	if (Array.isArray(owner)) {
		if (find && !owner.find(find)) { return }
		//当owner是数组是prop则为number
		if (owner.length > prop) {
			if (mode === 'replace' || !$.isObject(value) || !$.isObject(owner[prop])) {
				Vue.set(owner, prop, value)
			} else {
				for (let i in value) {
					Vue.set(owner[prop], i, value[i])
				}
			}
		} else if (!owner.some(a => $.compare(a, value))) {
			push ? owner.push(value) : owner.unshift(value)
		}
	} else if (typeof owner === 'object') {
		if (mode === 'update' && $.isObject(value) && $.isObject(owner[prop])) {
			for (let i in value) {
				Vue.set(owner[prop], i, value[i])
			}
		} else if (Array.isArray(owner[prop])) {
			if (find && !owner[prop].find(find)) { return }
			if (mode === 'update') {
				if (!owner[prop].some(a => $.compare(a, value))) {
					push ? owner[prop].push(value) : owner[prop].unshift(value)
				}
			} else {
				Vue.set(owner, prop, value)
			}
		} else {
			Vue.set(owner, prop, value)
		}
	}
}

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	state: {
		'user': { '100': '张三', roles: [{ a: '1' }, { a: 2 }], info: { addr: 'addr' } },
		list: [{ a: 1, b: 2, c: 3 }, { a: 5, b: 6, c: 7 }, [1, 2, 3]]
	},
	mutations: {
		apply(state, payload) {
			(!Array.isArray(payload) ? [payload] : payload).forEach(item => {
				set(state, item)
			})

		}
	},
	getters: {
		get(state) {
			return prop => {
				return getValueByPath(state, prop).value
			}
		}
	},
	actions: {}
})
