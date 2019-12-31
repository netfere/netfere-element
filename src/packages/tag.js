import {Tag} from 'element-ui';
import { $ } from './utils'

export default {
    name: 'NfTag',
    mixins: [Tag],
    props: {
        label: String,
        click: Function,
        close: Function,
        edit: [Function, Object],
        append: Function,
        width: [Number, String],
        items: {
            type: Array,
            default() { return [] }
        },
        disableTransitions: {
            type: Boolean,
            default: true
        },
        effect: {
            type: String,
            default: "plain"
        }
    },
    watch: {
        $props: {
            deep: true,
            immediate: true,
            handler() {
                this.initConfig()
            }
        }
    },
    data() {
        return {
            inputVisible: false,
            inputValue: '',
            props: {}
        }
    },
    render(h) {
        if (typeof this.append === 'function') {
            return this.renderButton(h);
        } else if ($.isEmpty(this.items)) {
            return this.renderTag(h);
        } else {
            const props = $.slice(this.$props, ['items'], false);
            return h('div', {}, [
                this.$slots.prepend,
                this.items.map(item => {
                    return h('nf-tag', {
                        props: $.apply({}, props, $.isString(item) ? { label: item } : item)
                    })
                }),
                this.$slots.default
            ])
        }
    },
    methods: {
        initConfig() {
            this.props = Object.keys(Tag.props).reduce((res, key) => {
                if (!$.is(this.$props[key], ['undefined', 'function']) && key !== 'item' && key !== 'edit') {
                    res[key] = this.$props[key];
                }
                return res;
            }, { label: this.label });
        },
        renderTag(h) {
            const props = $.slice(this.props, ['width', 'label'], false);
            let { close } = this.$props;
            const { width, label } = this.props;
            //有close响应时，强制启用允许关闭
            if (close) {
                props['closable'] = true;
            }
            return h('el-tag', {
                props,
                class: 'nf-tag',
                style: width ? ({ textAlign: 'center', width: $.isNumber(width) ? `${width}px` : width }) : {},
                on: {
                    click: () => {
                        this.click && this.click(this)
                    },
                    close: () => {
                        this.close && this.close(this)
                    }
                }
            }, [
                label || this.$slots.default,
                this.renderEdit(h)
            ])
        },
        renderButton(h) {
            if (this.inputVisible) {
                return h('el-input', {
                    ref: 'saveTagInput',
                    class: ['nf-tag', 'input-new-tag', this.size ? ('nf-tag-input-' + this.size) : ''],
                    props: {
                        value: this.inputValue
                    },
                    attrs: { placeholder: '回车确认' },
                    on: {
                        input: value => {
                            this.inputValue = value
                        },
                        blur: () => {
                            this.submitInput(this.append)
                        }
                    },
                    nativeOn: {
                        keyup: e => {
                            if (e.keyCode === 13) {
                                this.submitInput(this.append)
                            }
                        }
                    }
                })
            } else {
                const props = $.slice(this.props, ['label', 'width'], false);
                props.click = () => {
                    this.showInput()
                }
                return h('nf-tag', {
                    props
                }, [
                    h('i', { class: 'el-icon-plus' }),
                    ' ' + (this.label || '新增')
                ])
            }
        },
        renderEdit(h) {
            if (!this.edit) { return null };
            const { handler = $.noop, icon = 'el-icon-edit' } = $.isFunction(this.edit) ? { handler: this.edit } : ($.isObject(this.edit) ? this.edit : {})

            return h('i', {
                class: ['el-tag__close', 'edit', icon],
                on: {
                    click: (event) => {
                        if (event && event.stopPropagation) { // w3c标准
                            event.stopPropagation();
                        } else { // IE系列 IE 678
                            event.cancelBubble = true;
                        }
                        handler(this)
                    }
                }
            })
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        submitInput(callback) {
            const done = () => {
                this.inputVisible = false;
                this.inputValue = '';
            }
            if ($.isEmpty(this.inputValue)) {
                this.inputVisible = false;
            } else {
                callback && callback(this.inputValue, done)
            }
        },
        set(prop, value) {
            if ($.isString(prop) && value !== undefined && (prop === 'label' || prop === 'width' || $.has(Tag.props, prop))) {
                this.$set(this.props, prop, value);
            } else if ($.isObject(prop)) {
                Object.keys(prop).forEach(key => {
                    this.set(key, prop[key]);
                })
            } else if ($.isBoolean(prop)) {
                this.set('hit', prop);
            } else if ($.isString(prop)) {
                this.set('label', prop);
            } else if ($.isNumber(prop)) {
                this.set('width', prop);
            }
        },
    }
}