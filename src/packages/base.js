import { $, initConfig, formatRender, px } from './utils'

export default {
    props: {
        render: [String, Object, Array, Function],
        on: {
            type: Object,
            default() { return {} }
        }
    },
    watch: {
        $props: {
            deep: true,
            immediate: true,
            handler() {
                const data = initConfig.call(this, this.excludeProps);
                if (this.initConfig) {
                    $.apply(this.$data, this.initConfig(data))
                } else {
                    $.apply(this.$data, data)
                }
            }
        }
    },
    data() {
        return {
            ref: 'instance',
            fieldProps: {},
            excludeProps: ['on', 'render', 'items'],
            listeners: {}
        }
    },
    computed: {
        widthStyle() {
            const width = px(this.fieldProps.width);
            return width ? { width } : {}
        },
        renderConfig() {
            return formatRender(this.render)
        }
    },
    mounted() {
        this.$nextTick(()=>{
            if(this.on['render']){
                this.on['render'](this)
            }else{
                this.$emit('render',this);
            }
        })
    },
}