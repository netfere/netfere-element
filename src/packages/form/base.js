import mixin from '../base'
import { $, getRender } from '../utils'

export default {
    mixins: [mixin],
    inject: {
        root: {
            default: ''
        }
    },
    props: {
        width:[Number,String]
    },
    methods: {
        renderField(tag, templates = [], slotProps) {
            const h = this.$createElement;
            if (slotProps) {
                templates.push(...getRender.call(this, slotProps))
            }
            return h(tag, {
                ref: this.ref,
                props: this.fieldProps,
                attrs: this.$attrs,
                style: this.widthStyle,
                on: {
                    input: value => {
                        if (this.on.input) {
                            this.on.input(value, this);
                        } else {
                            this.fieldProps.value = value;
                        }
                    },
                    ...$.slice(this.listeners, ['input','enter'], false)
                },
                nativeOn: {
                    keyup: e => {
                        if (e.keyCode === 13) {
                            this.on.enter && this.on.enter(e, this);
                        }
                    }
                }
            }, templates)
        },
        setValue(value) {
            this.$emit('input', value);
            if(this.on.input){
                this.on.input(value)
            }else{
                this.$set(this.fieldProps, 'value', value);
            }
        },
        set(prop,value){
            const len=arguments.length;
            if(len===2){
                if(prop==='value'){
                    this.setValue(value)
                }else if($.has(this.fieldProps,prop)){
                    this.$emit('prop-change', value);
                    if(this.on.propChange){
                        this.on.propChange(prop,value)
                    }else{
                        this.fieldProps[prop]=value;
                    }
                }
            }else if(len===1){
                value=prop;
                const type=$.is(value);
                switch(type){
                    case 'boolean':
                        this.set('disabled',value);
                        break;
                    case 'object':
                        for (let i in value) {
                            this.set(i, value[i])
                        }
                        break;
                }
            }
        }
    }
}