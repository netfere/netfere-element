import mixin from '../base'
import {FormItem} from 'element-ui';
import { $, getRender, getScoped,px } from '../utils'


export default {
    name: 'NfFormItem',
    mixins: [mixin],
    inject: {
        root: {
            default: ''
        }
    },
    props: {
        ...FormItem.props,
        ...mixin.props,
        itemWidth: [Number, String],
        field: {
            type: Object,
            default() { return {} }
        }
    },
    render(h) {
        const width=px(this.itemWidth);
        const templates=[this.renderField()];
        templates.push(this.$slots.default);
        //templates.push(this.$slots.label);
        templates.push(getRender.call(this,['label','default']))
        return h('el-form-item', {
            ref: this.ref,
            props: this.fieldProps,
            attrs: this.$attrs,
            style:width?{width}:{},
            scopedSlots: getScoped.call(this, ['error'])
        }, templates)
    },
    methods: {
        renderField() {
            const config = { ...(this.field || {}), on: this.on, render: $.slice(this.renderConfig, ['label', 'error'], false) };

            return getRender.call(this, 'default', { 'default': config });
        }
    }
}