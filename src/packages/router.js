import Vue from 'vue';
import VueRouter from 'vue-router';
import Blank from './blank.vue'
import BlankRouter from './blankRouter.vue'
import Page401 from './401.vue';
import Page404 from './404.vue';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' //在App.vue的style中加入#nprogress .bar {background: red !important;}进行自定义颜色
import { $ } from './utils'
import { error } from './modal';
Vue.use(VueRouter);

const allRoutes = [];
const listeners = {};
const redirect = {
    '401': { path: '/401', component: Page401, meta: { hidden: true } },
    '404': { path: '/404', component: Page404, meta: { hidden: true } }
}
const notfindPath = { path: '*', redirect: '/404' };

const _force = { state: false, route: '' };
const beforeEach = function (to, from, next) {
    if (_force.state === true && _force.route) {
        _force.state = false;
        next(_force.route);
        return;
    }
    const { roles, progress } = to.meta || {}
    if (this.progress || progress) {
        NProgress.start();
    }

    //存在权要求，但用户权限与路由权限不匹配，将跳转401(无权限)
    if ($.notEmpty(roles) && !roles.some(r => this.userRoles.indexOf(r) > -1)) {
        if (!listeners['401'] || listeners['401'](to, from, next, this) !== false) {
            next(redirect['401'].path)
        }
    } else if (to.path === '/404') {
        if (!listeners['404'] || listeners['404'](to, from, next, this) !== false) {
            next()
        }
    } else if (!listeners['before'] || listeners['before'](to, from, next)) {
        next();
    }
}

const afterEach = function (to, from, next) {
    NProgress.done();
    listeners['after'] && listeners['after'](to, from, next, this)
}


const formatMenu = function (options, parentPath, userRoles) {
    return options
        //将根目录下的children提前一级
        .reduce((res, item) => {
            if ((item.path === '/' || (item.meta && item.meta.moveup)) && item.children) {
                res.push(...item.children.map(a => {
                    return { ...a, path: (item.path === '/' ? '/' : (item.path + '/')) + a.path }
                }))
            } else {
                res.push(item)
            }
            return res;
        }, [])
        //子项目中是否有需要提前一级的
        .reduce((res, item) => {
            if (item.children) {
                item.children.filter(a => a.meta && a.meta.moveup).forEach(a => {
                    res.push({ ...a, path: item.path + '/' + a.path })
                })
                //过滤掉已提前一级的项目
                res.push({ ...item, children: item.children.filter(a => !a.meta || !a.meta.moveup) })
            } else {
                res.push(item)
            }
            return res;
        }, [])
        //项目逐项处理，遇到children时递归调用formatRouter
        .reduce((res, item, i) => {
            let { title, hidden, icon, index, roles = [], emit } = item.meta || {};
            const path = parentPath ? (parentPath + '/' + item.path) : item.path;

            res.push({
                path: emit ? `_emit_${emit}` : path,
                //hidden=true 或 配置了跳转且没有子项时也隐藏 或children=[]的
                hidden: hidden
                    || (item.redirect && $.isEmpty(item.children))
                    || ($.isArray(item.children) && item.children.length === 0)
                    || !($.isEmpty(roles) || userRoles.some(r => roles.indexOf(r) > -1))
                    || false,
                title: title || item.name || '请配置meta.title',
                icon: icon || 'el-icon-menu',
                index: index || (i + 1), //用于排序同级菜单
                children: $.isArray(item.children) ? formatMenu(item.children, path, userRoles) : null
            });

            return res
        }, [])
        .filter(a => !a.hidden)
        .sort((a, b) => a.index - b.index)
        .map(a => {
            const rec = $.slice(a, ['index', 'hidden', 'children'], false);
            if ($.notEmpty(a.children)) {
                rec['children'] = a.children;
            }
            return rec;
        });
}

const mergeRoles = function (data, baseRoles = []) {
    return data.reduce((res, item) => {
        const { roles = [], exclude = [] } = item.meta || {}
        const rolelist = baseRoles.concat(roles)
            .reduce((arr, r) => {
                if (exclude.indexOf(r) === -1) {
                    arr.push(r)
                }
                return arr
            }, []);
        const record = $.slice(item, ['children'], false);
        if (record.meta) {
            record.meta['roles'] = rolelist;
            record.meta = $.slice(record.meta, ['exclude'], false)
        } else {
            record['meta'] = { roles: rolelist }
        }
        if (item.children) {
            record.children = mergeRoles(item.children, rolelist);
        }
        res.push(record);
        return res;
    }, [])
}
const formatOption = function (opts) {
    if (opts['401']) {
        $.apply(redirect['401'], opts['401'])
    }
    if (opts['404']) {
        $.apply(redirect['404'], opts['404']);
        notfindPath.redirect = redirect['404'].path;
    }
    for (let key in redirect) {
        if (redirect[key]['meta']) {
            redirect[key]['meta']['hidden'] = true;
        } else {
            redirect[key]['meta'] = { hidden: true };
        }
    }
    $.apply(listeners, opts.on || {});
    opts['routes'] = (opts.routes || []).concat([redirect['401'], redirect['404']]);
    return opts;
}
export default class extends VueRouter {
    progress = true;
    userRoles = [];
    menus = [];
    constructor(opts = {}) {
        opts = formatOption(opts);

        allRoutes.push(...opts.routes);

        //以下为VueRouter参数,排除routes
        const RouterOptions = $.slice(opts, ['mode', 'fallback', 'base', 'linkActiveClass', 'linkExactActiveClass', 'parseQuery', 'stringifyQuery', 'scrollBehavior'])
        RouterOptions['routes'] = allRoutes;
        super(RouterOptions);

        this.progress = opts.progress === false ? false : true;
        this.onError = opts.onError || function (err) { error(err.message) };
        this.onReady(() => {
            listeners['ready'] && listeners['ready'](this);
            if (!this.options.routes.find(a => a.path === '*')) {
                this.addRoutes([notfindPath]);
            }
        })
        this.beforeEach((to, from, next) => beforeEach.call(this, to, from, next));
        this.afterEach((to, from, next) => afterEach.call(this, to, from, next));

        this.menus = formatMenu(allRoutes, '', []);

    }
    loadRoutes(routes, userRoles) {
        //处理权限合并到子项
        routes = mergeRoles(routes).concat(allRoutes).concat(notfindPath);
        //合并所有路由
        this.options.routes = routes;
        this.matcher = new VueRouter({
            routes: []
        }).matcher;

        //将路由转换为菜单，此时menus数据会与路由数据不一致，所以在beforeEach中要处理无权限问题
        //menus数据将在nav.js中使用
        this.menus = formatMenu(routes, '', userRoles);
        this.userRoles = userRoles;
        //添加路由
        this.addRoutes(routes);
    }
    getSub() {
        if (location.hash) {
            const reg = /^#\/(\w+)\//i;
            const arr = reg.exec(location.hash);
            if (arr && arr.length > 1) {
                return arr[1]
            } else {
                return ''
            }
        } else {
            return ''
        }
    }
    force(route) {
        _force.route = route;
        _force.state = true;
    }
}

export { Blank, BlankRouter }