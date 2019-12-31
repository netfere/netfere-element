import Vue from 'vue';
import NfButton from './button';
import {Button} from 'element-ui';
import { $ } from './utils'

Vue.component(NfButton.name, NfButton);
export default {
    name: 'NfButtonGroup',
    mixins: [Button],
    props: {
        items: {
            type: Array,
            default() {
                return []
            }
        }
    },
    render(h) {
        const props = {};
        for (let i in this.$props) {
            if (this.$props[i] !== undefined && i !== 'items') {
                props[i] = this.$props[i];
            }
        }
        return h('el-button-group', {}, this.items.map(item => {
            return h('nf-button', {
                props: $.apply({}, props, item)
            })
        }).concat(this.$slots.default));
    }
}