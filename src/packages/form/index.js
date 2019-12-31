import Vue from 'vue'
import {Form} from 'element-ui';
import { confirm } from '../modal';
import Nfbutton from '../button'
import NfButtonGroup from '../buttonGroup'
import NfFormItem from './item';
import { $, getRender, initConfig, formatRender, getRenderItem } from '../utils'
import FieldComponent from './field';

Vue.use(FieldComponent);

Vue.component(Nfbutton.name, Nfbutton);
Vue.component(NfButtonGroup.name, NfButtonGroup);
Vue.component('NfButtons', NfButtonGroup);
Vue.component(NfFormItem.name, NfFormItem);


const formProps = {
    ...Form.props,
    labelWidth: {
        type: String,
        default: '80px'
    },
    title: String,
    shadow: String,
    bodyStyle: Object,
    model: {
        type: Object,
        default() { return {} }
    },
    buttons: [Array, Object],
    fields: {
        type: [Array, Object],
        default() {
            return []
        }
    },
    render: [String, Object, Function, Array],
    on: {
        type: Object,
        default() { return {} }
    },
    span: {
        type: Number,
        default: 0
    }
}
const excludeProps = ['on', 'render', 'fields', 'buttons', 'span'];

const renderItems = function (h) {
    const itemPropKeys = Object.keys(NfFormItem.props);
    let isElRow = false;
    const vnodes = this.formItems.map(item => {
        const { span, prop, self } = item;
        let vnode = null;
        if (self) {
            const temps = [];
            if ($.has(item, 'xtype') || $.has(item, 'tag')) {
                getRenderItem.call(this, 'default', item, this.$slots, temps);
            } else if ($.has(item, 'render')) {
                temps.push(...getRender.call(this, 'default', formatRender(item.render)));
            }
            if (span > 0) {
                isElRow = true;
                return h('el-col', { props: { span } }, temps)
            } else {
                return temps;
            }
        } else {
            const props = {};
            for (let key in $.map($.slice(item, ['span', 'self', 'field'], false), itemPropKeys)) {
                if (item[key] !== undefined) {
                    props[key] = item[key]
                }
            }
            props['field'] = $.apply({}, item.field || {}, $.slice(item, [...itemPropKeys, 'field', 'span', 'self'], false));
            props['field']['value'] = $.has(this.model, prop) ? this.model[prop] : null;
            props['on'] = $.apply(item.on || {}, {
                input: value => {
                    this.$set(this.model, prop, value)
                },
                propChange: (prop, value) => {
                    item[prop] = value;
                }
            });
            vnode = h('nf-form-item', {
                ref: prop,
                props
            });
            if (span > 0) {
                isElRow = true;
                return h('el-col', { props: { span } }, [vnode])
            } else {
                return vnode;
            }
        }
    })
    if (isElRow > 0) {
        return [
            h('el-row', { props: { gutter: 10 } }, vnodes)
        ]
    } else {
        return vnodes;
    }
}

const renderButtons = function () {
    if ($.isEmpty(this.buttons)) { return null }
    const h = this.$createElement;
    const dataType = $.is(this.buttons);
    const buttons = dataType === 'array' ? { type: 'primary', items: this.buttons } : this.buttons;
    const { align = 'left', items = [], style = {} } = buttons;
    const config = $.slice(buttons, ['align', 'items', 'style', 'class'], false);
    config.items = items.map(item => {
        const rec = $.slice(item, ['handler', 'submit', 'reset'], false);
        rec['handler'] = (btn, e) => {
            if (typeof item['submit'] === 'function') {
                this.submit(item['submit'], btn, e)
            } else if (item['reset']) {
                if (item['reset'] === true) {
                    this.reset();
                } else if ($.isString(item['reset'])) {
                    this.reset(item['reset'])
                }
            } else {
                item['handler'] && item['handler'](this, btn, e);
            }
        }
        return rec;
    })

    return h('div', {
        slot: 'footer',
        style: { textAlign: align, ...style },
        class: buttons.class || {}
    }, [
        h('nf-button-group', {
            props: config
        })
    ])
}

export default {
    name: 'NfForm',
    model: {
        prop: 'model',
        event: 'change'
    },
    provide() {
        return {
            root: this
        };
    },
    props: formProps,
    watch: Object.keys(formProps).filter(key => [...excludeProps, 'model'].indexOf(key) === -1).reduce((res, key) => {
        res[key] = function (value) {
            this.fieldProps[key] = value;
        }
        return res;
    }, {}),
    data() {
        return {
            ref: 'instance',
            fieldProps: {},
            excludeProps,
            listeners: {}
        }
    },
    computed: {
        card() {
            const card = {
                header: this.title,
                render: [renderButtons.call(this)]
                    .concat(getRender.call(this, ['action', 'prepend', 'footer']))
                    .concat(getRender.call(this, ['action', 'prepend', 'footer'], this.renderConfig || {}))
                    .reduce((arr, curr) => {
                        if (curr) {
                            arr.push(curr)
                        }
                        return arr;
                    }, [])
            }
            if (Object.keys(card).every(key => $.isEmpty(card[key]))) {
                return null;
            } else {
                if (!card.shadow) {
                    card.shadow = 'never'
                }
                if (!card.bodyStyle) {
                    card.bodyStyle = { padding: '10px' }
                }
                return card;
            }
        },
        formItems() {
            //分栏显示时，this.span必须>1
            const span = (this.span > 1) ? (24 / this.span) : 0;
            let defaults = {};

            let items = [];
            if ($.isObject(this.fields)) {
                items = ($.isArray(this.fields.items) ? this.fields.items : []) || [];
                defaults = $.slice(this.fields, ['items'], false);
            } else if ($.isArray(this.fields)) {
                items = this.fields;
            }
            return items.map((item, i) => {
                const flex = item.flex || 1;
                const cfg = $.apply({ prop: `__prop${i + 1}` }, defaults, $.slice(item, 'flex', false));
                cfg['span'] = flex * span;
                return cfg;
            })
        }
    },
    render(h) {
        const templates = renderItems.call(this, h);
        templates.push(this.$slots.default);

        const card = this.card ? h('nf-card', {
            props: $.slice(this.card, 'render', false)
        }, templates.concat(this.card.render)) : null;

        return h('el-form', {
            ref: this.ref,
            props: $.slice(this.fieldProps, ['title', 'shadow', 'bodyStyle'], false)
        }, card ? [card] : templates)
    },
    methods: {
        reset(msg) {
            confirm({
                title: '重置前确认',
                message: msg || '确认要重置表单吗？',
                handler: () => {
                    this.resetFields();
                }
            })
        },
        submit(cb, ...params) {
            if (cb) {
                this.validate((valid) => {
                    if (valid) {
                        cb(this.model, this, ...params)
                    }
                })
            } else {
                return new Promise((resolve, reject) => {
                    this.validate((valid, error) => {
                        if (valid) {
                            resolve({ model: this.model, form: this })
                        } else {
                            reject(error)
                        }
                    });
                })
            }
        },
        getField(prop) {
            if ($.isString(prop)) {
                return this.$refs[prop] && this.$refs[prop].$refs['instance']
                    ? this.$refs[prop].$refs['instance'].$children.find(a => a.ref === 'instance')
                    : null;
            } else if ($.isArray(prop)) {
                return prop.reduce((res, name) => {
                    res[name] = this.getField(name);
                    return res;
                }, {})
            }
        },
        setValue(prop, value) {
            if ($.isString(prop)) {
                const cmp = this.getField(prop);
                if (cmp) {
                    cmp.setValue(value);
                }
            } else if ($.isObject(prop)) {
                for (let name in prop) {
                    this.setValue(name, prop[name]);
                }
            }
        },
    },
    created() {
        $.apply(this.$data, initConfig.call(this, this.excludeProps));
        const model = $.map(this.formItems, ['prop', 'value']).reduce((res, item) => {
            if (item.value !== undefined) {
                res[item.prop] = item.value;
            }
            return res;
        }, {});
        for (let key in model) {
            this.$set(this.model, key, model[key])
        }
    },
    mounted() {
        Object.keys(Form.methods).forEach(key => {
            this[key] = this.$refs[this.ref][key]
        })
    },
}