import { Button } from 'element-ui';
import mixin from './base'
import { $ } from './utils'

let $oldText = '';

export default {
    name: 'NfButton',
    mixins: [mixin],
    inject: {
        root: {
            default: ''
        }
    },
    props: {
        ...Button.props,
        text: String,
        handler: Function,
        type: {
            type: String,
            default: 'primary'
        }
    },
    data() {
        return {
            excludeProps: ['on', 'render', 'handler']
        }
    },
    render(h) {
        return h('el-button', {
            ref: this.ref,
            props: $.slice(this.fieldProps, 'text', false),// $.slice(this.props, 'text', false),
            on: {
                click: e => {
                    this.$emit('click', this, e);
                    this.handler && this.handler(this, e);
                }
            }
        }, this.fieldProps.text || this.$slots.default)
    },
    methods: {
        set(prop, value) {
            if ($.isString(prop) && value !== undefined && (prop === 'text' || $.has(Button.props, prop))) {
                this.$set(this.fieldProps, prop, value);
            } else if ($.isObject(prop)) {
                Object.keys(prop).forEach(key => {
                    this.set(key, prop[key]);
                })
            } else if ($.isBoolean(prop)) {
                this.set('disabled', prop);
            } else if ($.isString(prop)) {
                this.set('text', prop);
            }
        },
        mask(ing, text) {
            this.set('loading', ing);
            if (ing && text) {
                $oldText = this.fieldProps.text;
                this.set('text', text)
            } else if ($oldText) {
                this.set('text', $oldText);
                $oldText = '';
            }
        }
    },
}