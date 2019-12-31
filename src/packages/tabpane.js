import { TabPane } from 'element-ui';
import mixin from './base';
import { $, getRender,formatRender } from './utils';

export default {
    name:'NfTabPane',
    mixins:[mixin],
    inject: {
        root: {
            default: ''
        }
    },
    props:{
        ...TabPane.props
    },
    render(h){
        return h("el-tab-pane",{
            props:this.fieldProps
        },getRender.call(this,['default','label']))
    }
}