import Upload from 'element-ui/lib/upload';
import ajax from 'element-ui/packages/upload/src/ajax';
import mixin from './base'
import { $, getRender } from './utils'

export default {
    name: 'NfUpload',
    mixins: [mixin],
    props: {
        ...Upload.props,
        width: [String, Number]
    },
    created() {

    },
    render(h) {
        const templates = getRender.call(this, ['default', 'trigger', 'tip']);
        return h('el-upload', {
            ref: this.ref,
            props: this.fieldProps,
            attrs: this.$attrs,
            style: this.widthStyle
        }, templates)
    },
    methods: {
        initConfig({ fieldProps, listeners }) {
            
            return { fieldProps, listeners }
        },
        clearFiles() {
            this.$refs[this.ref].clearFiles()
        },
        abort(file) {
            this.$refs[this.ref].abort(file)
        },
        submit() {
            this.$refs[this.ref].submit()
        }
    },
}