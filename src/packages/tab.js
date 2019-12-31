import { Tabs } from 'element-ui';
import mixin from './base';
import { $, getRender, formatRender } from './utils';

export default {
    name: 'NfTabs',
    mixins: [mixin],
    provide() {
        return {
            root: this
        };
    },
    props: {
        ...Tabs.props,
        handler: Function,
        type: {
            type: String,
            default: 'border-card'
        },
        panes: {
            type: [Object, Array],
            default() { return [] }
        },
        compact: Boolean
    },
    data() {
        return {
            excludeProps: ['on', 'render', 'panes', 'handler'],
        }
    },
    computed: {
        items() {
            const data = $.isArray(this.panes) ? { items: this.panes } : $.apply({ items: [] }, this.panes);
            const defaults = $.slice(data, ['items'], false);
            return data.items.map((item, i) => {
                return $.apply({ name: '__pane' + (i + 1) }, defaults, item)
            })
        },
        renderConfig() {
            const renders = formatRender(this.render);
            this.items.forEach(item => {
                if (item.render) {
                    renders[item.name] = formatRender(item.render)
                } else if (this.$slots[item.name]) {
                    renders[item.name] = formatRender(item.name)
                }
            })
            return renders;
        }
    },
    render(h) {
        const templates = this.items.map(item => {
            const vnodes=getRender.call(this, ['default'], this.renderConfig[item.name]);
            const label=getRender.call(this, ['label'], this.renderConfig[item.name]);
            if($.notEmpty(label)){
                label.forEach(vnode=>{
                    vnodes.push(h('template',{slot:'label'},[vnode]))
                })
            }else if(item.icon){
                vnodes.push(h('span',{slot:'label',domProps:{innerHTML:`<i class="${item.icon}"></i> ${item.label}`}}))
            }
            
            return h('el-tab-pane', { props: $.slice(item, ['render','icon'], false) },vnodes)
        });
        templates.push(getRender.call(this, 'default'))
        return h('el-tabs', {
            props: this.fieldProps,
            class: { 'nf-tabs-compact': this.compact },
            on: {
                ...this.listeners,
                'tab-click': tab => {
                    this.handler && this.handler(tab)
                    this.listeners['tab-click'] && this.listeners['tab-click'](tab)
                }
            }
        }, templates)
    }
}