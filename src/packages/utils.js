import $ from '../../../netfere-ts';
import { AxiosClass } from '../../../netfere-ts/lib/axios';

const initConfig = function (exclude) {
    const me = this;
    const props = Object.keys(this.$props)
        .filter(key => (exclude || []).indexOf(key) === -1)
        .reduce((res, key) => {
            res[key] = this.$props[key];
            return res;
        }, {});
    const listeners = {};
    Object.keys(this.on || {}).forEach(key => {
        const prop = $.toLine(key);
        listeners[prop] = function () {
            me.on[key](...arguments, me);
            me.$listeners[prop] && me.$listeners[prop](...arguments);
        }
    })

    Object.keys(this.$listeners).forEach(key => {
        if (!$.has(listeners, key)) {
            listeners[key] = this.$listeners[key];
        }
    })
    if ($.has(props, 'size') && !props['size'] && this.root && this.root['size']) {
        props['size'] = this.root['size']
    }
    return { fieldProps: props, listeners }
}
const createMethods = function (methods) {
    const instance = this.$refs[this.ref];
    if (instance && methods) {
        Object.keys(methods).forEach(key => {
            this[key] = instance[key]
        })
    }
}
const getRenderItem = function (key, item, $slots, templates) {
    const h = this.$createElement;
    switch ($.is(item)) {
        case 'string':
            ($slots[item] || []).forEach(vnode => {
                vnode.context = this;
                vnode.data.slot = key;
                templates.push(vnode);
            })
            break;
        case 'vnode':
            item.context = this;
            item.data ? item.data.slot = key : item.data = { slot: key };
            templates.push(item);
            break;
        case 'function':
            const vnode = item(h);
            vnode.context = this;
            vnode.data ? vnode.data.slot = key : vnode.data = { slot: key };
            templates.push(vnode);
            break;
        case 'array':
            item.forEach(child => {
                getRenderItem.call(this, key, child, $slots, templates);
            })
            break;
        case 'object':
            const { xtype, tag } = item;
            let node = null;
            if (xtype) {
                node = h('nf-' + xtype, { attrs: $.slice(item, ['xtype', 'tag'], false) })
            } else if (tag) {
                node = h(tag, $.slice(item, ['tag', 'context'], false), item.context)
            }
            if (node) {
                node.context = this._self;
                node.data ? node.data.slot = key : node.data = { slot: key };
                templates.push(node)
            }
            break;
        default:
            break;
    }
}
const getRender = function (slots, renders) {
    slots = $.isString(slots) ? [slots] : slots;
    const root = this.root || this;
    const templates = [];
    for (const name of slots) {
        //当前组件并非指定项目时，读取$slots
        if (!this.root && this.$slots[name] && !renders) {
            this.$slots[name].forEach(vnode => {
                vnode.context = this._self;
                templates.push(vnode);
            })
        }
        const item = (renders || this.renderConfig || {})[name];
        item && getRenderItem.call(this, name, item, root.$slots, templates)
    }
    return templates
}
const getScoped = function (slots, renders) {
    const root = this.root || this;
    const templates = {};
    if (!$.isArray(slots)) {
        slots = [slots]
    };
    for (const name of slots.filter(a => $.isString(a))) {
        //当前组件并非指定项目时，读取$slots
        if (!this.root && this.$scopedSlots[name] && !renders) {
            templates[name] = this.$scopedSlots[name];
        }
        const item = (renders || this.renderConfig || {})[name];
        if (item) {
            switch ($.is(item)) {
                case 'string':
                    if (root.$scopedSlots[item]) {
                        templates[name] = root.$scopedSlots[item]
                    }
                    break;
                case 'function':
                    const h = this.$createElement;
                    const vm = this;
                    templates[name] = function () {
                        const result = item(h, ...arguments);
                        if ($.isVNode(result)) {
                            return result
                        } else {
                            const value = {};
                            value[name] = result;
                            return getRender.call(vm, name, value);
                        }
                    };
                    break;
                default:
                    break;
            }
        }
    }
    return templates;
}

const formatRender = function (value) {
    const render = {};
    if ($.is(value, ['string', 'function', 'array']) || $.isVNode(value)) {
        render['default'] = value
    } else if ($.isObject(value)) {
        if ($.has(value, 'xtype') || $.has(value, 'tag')) {
            render['default'] = value
        } else {
            $.apply(render, value)
        }
    }
    return render
}

const px = function (value) {
    if ($.isString(value)) {
        return value;
    } else if ($.isNumber(value)) {
        return value + 'px'
    } else {
        return ''
    }
}

export {
    $, AxiosClass,
    getRender, initConfig, createMethods, getScoped, formatRender, px, getRenderItem
}