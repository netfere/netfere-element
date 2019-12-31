import { Menu } from 'element-ui';
import { $ } from './utils'

const renderMenuItem = function (h, items) {
    return items.map((item, idx) => {
        if ($.isArray(item.children)) {
            return h('el-submenu', { props: { index: item.path } }, [
                h('template', { slot: 'title' }, [
                    h('i', { class: item.icon }),
                    h('span', item.title || item.name)
                ])
            ].concat(renderMenuItem(h, item.children)))
        } else {
            return h('el-menu-item', { key: idx, props: { index: item.path, handler: item.handler } }, [
                h('i', { class: item.icon }),
                h('span', item.title || item.name)
            ])
        }
    })
}


export default {
    name: 'NfNav',
    props: {
        data: Array,
        roles: Array,
        ...Menu.props,
        uniqueOpened: {
            type: Boolean,
            default: true
        },
        router: {
            type: Boolean,
            default: false
        }
    },
    mounted() { },
    render(h) {
        return h('el-menu', {
            ref: 'elMenu',
            props: $.slice(this.$props, ['data', 'roles'], false),
            on: {
                select: (index) => {
                    if (index.startsWith('_emit_')) {
                        this.$emit('handler', index.replace('_emit_', ''))
                    } else {
                        this.$router.push({ path: index })
                    }
                }
            }
        }, renderMenuItem(h, this.$router.menus || []).concat(this.$slots.default))
    }
}