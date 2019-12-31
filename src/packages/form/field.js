import Field from './base'; // 基本字段配置

import DateTime from './datetime'; // 日期时间组件
import {Input,InputNumber,Cascader,ColorPicker,Checkbox,CheckboxGroup,RadioGroup,Switch,Slider,Rate,Select,Transfer} from 'element-ui';
import { $, createMethods, getScoped } from '../utils'


const init = (list) => {
    return list.reduce((res, { name, source, slots, props = {}, methods = {}, computed = {} }) => {
        res['Nf' + $.toFirst(name)] = {
            name: source.name.replace('El', 'Nf'),
            mixins: [Field],
            props: {
                ...source.props,
                ...props
            },
            mounted() {
                createMethods.call(this, source.methods);
            },
            render() {
                const tag = source.name.replace('El', 'el');
                return this.renderField($.toLine(tag), [], slots)
            },
            computed,
            methods
        }
        return res
    }, {})
}

const components = init([
    { name: 'input', source: Input, slots: ['prefix', 'suffix', 'prepend', 'append'] },
    {
        name: 'number', source: InputNumber, methods: {
            focus(e) {
                this.$refs[this.ref].focus(e)
            }
        },
    },
    {
        name: 'cascader', source: Cascader,
        methods: {
            initConfig({ fieldProps, listeners }) {
                if (!$.isArray(fieldProps.value)) {
                    fieldProps.value = []
                }
                return { fieldProps, listeners }
            }
        },
    },
    { name: 'color', source: ColorPicker },
    {
        name: 'transfer', source: Transfer,
        methods: {
            initConfig({ fieldProps, listeners }) {
                if (!$.isArray(fieldProps.value)) {
                    fieldProps.value = []
                }
                return { fieldProps, listeners }
            }
        }
    },
    {
        name: 'switch', source: Switch,
        props: {
            active: [String, Object],
            inactive: [String, Object]
        },
        computed: {
            widthStyle() {
                return {}
            }
        },
        methods: {
            initConfig({ fieldProps, listeners }) {
                ['active', 'inactive'].forEach(key => {
                    if (!$.isUndefined(fieldProps[key])) {
                        const value = fieldProps[key];
                        if ($.isString(value)) {
                            fieldProps[key + 'Text'] = value;
                        } else if ($.isObject(value)) {
                            ['text', 'color', 'value'].forEach(p => {
                                if ($.has(value, p)) {
                                    fieldProps[key + $.toFirst(p)] = value[p]
                                }
                            })
                        }
                    }
                })
                return { fieldProps, listeners }
            }
        }
    }, {
        name: 'slider', source: Slider
    }, {
        name: 'rate', source: Rate
    }
]);

components['NfCheckbox'] = {
    name: 'NfCheckbox',
    mixins: [Field],
    props: {
        ...Checkbox.props,
        button: Boolean,
        display: String
    },
    created() {
        createMethods.call(this, Checkbox.methods)
    },
    render(h) {
        const { button, display } = this.fieldProps
        return this.renderField(button ? 'el-checkbox-button' : 'el-checkbox', [display], ['default'])
    },
}

components['NfCheckboxs'] = {
    name: 'NfCheckboxGroup',
    mixins: [Field],
    props: {
        ...CheckboxGroup.props,
        items: Array,
        button: Boolean,
        border: Boolean
    },
    mounted() {
        createMethods.call(this, CheckboxGroup.methods)
    },
    render(h) {
        const renderCheckboxItem = () => {
            const { button = false, border = false, items = [] } = this.fieldProps;
            return items.map(item => {
                return h('nf-checkbox', {
                    attrs: $.apply({ button, border }, item)
                })
            })
        }
        return this.renderField('el-checkbox-group', renderCheckboxItem(), ['default'])
    },
    methods: {
        initConfig({ fieldProps, listeners }) {
            const { button = false, border = false } = fieldProps;
            fieldProps['items'] = (this.items || []).map(item => {
                const data = {}
                if ($.isString(item)) {
                    $.apply(data, { label: item, display: item })
                } else {
                    //el-radio中label是value值，但扩展修改后，统一用label表示名称,value表示值，
                    //处理后，将item.value赋给label，而item.label赋值给display，用于渲染
                    //如果只有item.label时，则value=label
                    $.apply(data, { label: $.has(item, 'value') ? item.value : item.label, display: item.label }, $.slice(item, ['label', 'value'], false))
                }
                //不使用按钮时border有才效,border=true且项目没有border配置时
                if (!button && border && !$.has(data, 'border')) {
                    data['border'] = true;
                }
                return data;
            });
            if (!$.isArray(fieldProps.value)) {
                fieldProps.value = []
            }
            return { fieldProps, listeners }
        }
    },
}

components['NfRadios'] = {
    name: 'NfRadioGroup',
    mixins: [Field],
    props: {
        ...RadioGroup.props,
        items: Array,
        button: Boolean,
        border: Boolean
    },
    mounted() {
        createMethods.call(this, RadioGroup.methods)
    },
    render(h) {
        const renderRadioItem = () => {
            const { button = false, items = [] } = this.fieldProps;
            return items.map(item => {
                return h(button ? 'el-radio-button' : 'el-radio', {
                    attrs: $.slice(item, ['label', 'disabled', 'border', 'size', 'name'])
                }, item.display)
            })
        }
        return this.renderField('el-radio-group', renderRadioItem(), ['default'])
    },
    methods: {
        initConfig({ fieldProps, listeners }) {
            const { button = false, border = false } = fieldProps;
            fieldProps['items'] = (this.items || []).map(item => {
                const data = {}
                if ($.isString(item)) {
                    $.apply(data, { label: item, display: item })
                } else {
                    //el-radio中label是value值，但扩展修改后，统一用label表示名称,value表示值，
                    //处理后，将item.value赋给label，而item.label赋值给display，用于渲染
                    //如果只有item.label时，则value=label
                    $.apply(data, { label: $.has(item, 'value') ? item.value : item.label, display: item.label }, $.slice(item, ['label', 'value'], false))
                }
                //不使用按钮时border有才效,border=true且项目没有border配置时
                if (!button && border && !$.has(data, 'border')) {
                    data['border'] = true;
                }
                return data;
            })
            return { fieldProps, listeners }
        }
    },
}

components['NfSelect'] = {
    name: 'NfSelect',
    mixins: [Field],
    props: {
        ...Select.props,
        children: Object,
        group: Array,
        items: Array
    },
    mounted() {
        createMethods.call(this, Select.methods)
    },
    data() {
        return {
            excludeProps: ['width', 'on', 'render', 'items', 'children', 'group'],
        }
    },
    render(h) {
        const templates = $.has(this.fieldProps, 'group') ? this.renderGroup(h) : this.renderOption(h)
        return this.renderField('el-select', templates, ['prefix', 'empty'])
    },
    methods: {
        initConfig({ fieldProps, listeners }) {
            const { children = {}, group = [], items = [] } = this.$props;
            if ($.notEmpty(children)) {
                fieldProps['group'] = children.map((g, idx) => {
                    return { label: g.label, disabled: g.disabled || false, id: idx };
                });
                fieldProps['items'] = [];
                children.forEach((g, idx) => {
                    (g.items || []).forEach(item => {
                        fieldProps['items'].push({
                            label: item.label || '',
                            value: item.value || null,
                            disabled: item.disabled || false,
                            parent: idx
                        })
                    })
                })
            }
            if ($.notEmpty(items)) {
                fieldProps['items'] = items.map(item => {
                    if ($.isObject(item)) {
                        return item;
                    } else {
                        return { label: item + '', value: item }
                    }
                })
            }
            if ($.notEmpty(group)) {
                if ($.has(fieldProps, 'group')) {
                    fieldProps['group'].push(...group)
                } else {
                    fieldProps['group'] = group;
                }
            }
            if (fieldProps.multiple && !$.isArray(fieldProps.value)) {
                fieldProps.value = [];
            }
            return { fieldProps, listeners };
        },
        renderOption(h, items) {
            const vnode = getScoped.call(this, 'option')['option'];
            return (items || this.fieldProps.items || []).map(item => {
                return h('el-option', {
                    props: $.slice(item, ['label', 'value', 'disabled'])
                }, [vnode ? vnode(item) : null])
            })
        },
        renderGroup(h) {
            return this.fieldProps.group.map(g => {
                return h('el-option-group', {
                    props: {
                        label: g.label,
                        disabled: g.disabled
                    }
                }, this.renderOption(h, this.fieldProps.items.filter(a => a.parent === g.id)))
            })
        }
    }
}

for (let key in DateTime) {
    components[key] = DateTime[key];
}



export default {
    install(Vue) {
        for (let name in components) {
            Vue.component(name, components[name]);
            if (components[name].name && components[name].name !== name) {
                Vue.component(components[name].name, components[name]);
            }
        }
    }
}