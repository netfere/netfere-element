import {Dropdown} from 'element-ui';
import { $ } from './utils'

export default {
    name: 'NfDropdown',
    mixins: [Dropdown],
    props: {
        text: String,
        items: {
            type: Array,
            default() { return [] }
        },
        click:Function,
        handler:Function,
        change:Function
    },
    render(h) {
        const props = $.slice(this.$props, ['items', 'type', 'size', 'text','splitButton','click','handler','change'], false);
        let { type, size, splitButton } = this.$props;
        if(!splitButton && $.isFunction(this.click)){
            splitButton=true;
        }
        if (splitButton) {
            props['type'] = type || 'primary';
            props['splitButton']=true;
            if (size) {
                props['size'] = size;
            }
        }
        let defaultVNode = null;
        if (splitButton) {
            defaultVNode = this.text;
        } else {
            if (type === 'text') {
                defaultVNode = h('span', {
                    style: 'cursor: pointer'
                }, [this.text, h('i', { class: ['el-icon--right'] })])
            } else {
                defaultVNode = h('el-button', {
                    props: { type }
                },
                    [this.text, h('i', { class: ['el-icon--right'] })]
                )
            }
        }
        return h('el-dropdown', {
            props,
            on: {
                click: () => {
                    this.click && this.click(this)
                },
                command: value => {
                    this.handler && this.handler(value, this)
                },
                'visible-change': visible => {
                    this.change && this.change(visible, this)
                }
            }
        }, [
            defaultVNode,
            h('el-dropdown-menu', {
                slot: 'dropdown'
            }, this.items.map(item => {
                const cfg = $.slice(item, ['disabled', 'divided', 'icon']);
                if ($.has(item, 'command')) {
                    cfg['command'] = item.command
                } else if ($.has(item, 'value')) {
                    cfg['command'] = item.value;
                }
                return h('el-dropdown-item', { props: cfg }, item.label)
            }))
        ])
    },
}