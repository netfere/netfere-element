import Vue from 'vue';
import mixin from '../base'
import {Table} from 'element-ui';
import NfTableColumn from './column'
import NfCard from '../card.vue';
import {Pagination} from 'element-ui'
import { $, getRender, createMethods } from '../utils';
import { confirm, warning, dialog } from '../modal';

Vue.component('NfExpandNone', {
    render(h) {
        return '';
    },
    mounted() {
        this.$nextTick(() => {
            const tr = this.$el.parentNode.parentNode
            tr.style.display = 'none';
            const cell = tr.parentNode.parentNode.querySelector('.expanded').querySelector('td.el-table__expand-column');
            cell.innerHTML = ''
        })
    },
})

const renderColumn = function (h, columns = []) {
    return columns.map(config => {
        return h('nf-table-column', {
            //ref: config.prop,
            props: $.slice(config, ['columns', 'editor', 'summary', 'filter'], false)
        }, renderColumn.call(this, h, config.columns))
    })
}
const formatColumnItems = function (columns) {
    let defaults = {};
    let items = [];
    if ($.isObject(columns)) {
        items = ($.isArray(columns.items) ? columns.items : []) || [];
        defaults = $.slice(columns, ['items'], false);
    } else if ($.isArray(columns)) {
        items = columns;
    }

    return items.map((item, idx) => {
        const config = $.apply({ prop: '__prop' + idx, columnKey: '__prop' + idx },
            $.slice(defaults, ['width'], false), $.slice(item, ['columns'], false));
        //在type=expand列中没有定义render时，默认使用slot名为expand
        if (config.type === 'expand' && !$.has(config, 'render')) {
            config['render'] = 'expand'
        }
        if (defaults.width && !config.width && !config.minWidth) {
            config.width = defaults.width;
        }
        if (config.editor && config.editor.cellEdit) {
            cellEditRender.call(this, config);
        }
        if ($.has(item, 'columns')) {
            config['columns'] = formatColumnItems.call(this, { items: item.columns, ...defaults })
        }
        return config;
    })
}
//对允许单元格编辑进行render['default']的处理
const cellEditRender = function (config) {
    const render = {};
    const cellEdit = $.isObject(config.editor.cellEdit) ? config.editor.cellEdit : {};
    let defaultRender = (h, { row }) => {
        const propValue = $.find(row, config.prop);
        const display = config.formatter ? config.formatter(row, propValue) : propValue;
        return h('span', {}, display);
    };
    if ($.isObject(config.render)) {
        if (config.render.default) {
            defaultRender = config.render.default;
        }
        $.apply(render, $.slice(config.render, ['default'], false))
    } else if (config.render) {
        defaultRender = config.render;
    }
    const fieldCfg = (row, prop) => {
        return $.apply(
            { prop: config.prop, width: '100%' },
            $.slice(config.editor, ['disabled', 'hidden', 'cellEdit', 'width'], false),
            {
                ...$.slice(cellEdit, 'on', false),//排除可能配置的on事件响应
                on: {
                    render: instance => {
                        if (cellEdit.on && cellEdit.on.render) {
                            cellEdit.on.render(instance)
                        } else {
                            if (instance.focus) {
                                instance.focus();
                            } else if (instance.$refs['instance'] && instance.$refs['instance'].focus) {
                                instance.$refs['instance'].focus()
                            }
                        }
                    },
                    blur: e => {
                        if (cellEdit.on && cellEdit.on.blur) {
                            this.clickEditorData = null;
                            cellEdit.on.blur(e);
                        } else {
                            const { value } = this.clickEditorData || {};
                            if (e.target && e.target.value === value + '') {
                                this.clickEditorData = null;
                            }
                        }
                    },
                    change: (value, instance) => {
                        const commit = (success) => {
                            if (success !== false) {
                                const arr = prop.split('.');
                                if (arr.length > 1) {
                                    let rec, p;
                                    for (let i = 0; i < arr.length - 1; i++) {
                                        p = arr[i];
                                        if ($.has(row, p)) {
                                            rec = row[p]
                                            p = arr[i + 1];
                                        }
                                    }
                                    if (rec) {
                                        rec[p] = value;
                                    }
                                } else {
                                    row[prop] = value;
                                }
                            }
                            this.clickEditorData = null;
                        }
                        instance.set && instance.set({
                            disabled: true,
                            prefixIcon: "el-icon-loading"
                        });
                        if (cellEdit.on && cellEdit.on.change) {
                            cellEdit.on.change(value, instance, commit);
                        } else {
                            commit();
                        }
                    }
                }
            }
        )
    };
    render['default'] = (h, data) => {
        const { rowkey, rowValue, colKey, value } = this.clickEditorData || {};
        if (colKey === data.column.columnKey && rowValue === $.find(data.row, rowkey)) {
            return $.apply({ value }, fieldCfg(data.row, data.column.property))
        } else {
            return defaultRender(h, data)
        }
    };
    config['compact'] = true;
    config.render = render;
}

const renderPagination = function () {
    if ($.isEmpty(this.pagerProps)) { return null }
    const { local, align, change } = this.pagerProps;
    const update = (key, value) => {
        if (local) {
            this.$set(this.pagerProps, key, value);
        }
        if (key === 'pageSize') {
            change && change(this.pagerProps.currentPage, value, key);
        } else {
            change && change(value, this.pagerProps.pageSize, key);
        }
    }
    return this.$createElement('el-pagination', {
        slot: 'footer',
        style: { textAlign: align },
        props: $.slice(this.pagerProps, ['local', 'align', 'change'], false),
        on: {
            'size-change': sizes => {
                update('pageSize', sizes)
            },
            'prev-click': current => {
                update('currentPage', current)
            },
            'next-click': current => {
                update('currentPage', current)
            },
            'current-change': current => {
                update('currentPage', current)
            }
        }
    })
}

const formatPagerProps = function () {
    let pager = {};
    if ($.isObject(this.pager)) {
        $.apply(pager,
            $.map(this.pager, { size: 'pageSize', count: 'pagerCount', current: 'currentPage', sizes: 'pageSizes' }),
            $.slice(this.pager, ['size', 'count', 'sizes', 'current'], false)
        );
        const PaginationKeys = Object.keys(Pagination.props);
        pager = Object.keys(pager).reduce((res, key) => {
            if (pager[key] !== undefined && PaginationKeys.indexOf(key) > -1) {
                res[key] = pager[key];
            }
            return res;
        }, {});
        $.apply(pager, $.slice(this.pager, ['local', 'align', 'change']))
        $.applyNot(pager, { currentPage: 1, pageSize: 10 });
        if (pager.local) {
            pager['total'] = this.data.length;
        }
    } else if ($.isBoolean(this.pager) && this.pager === true) {
        $.apply(pager, { local: true, total: this.data.length, currentPage: 1, pageSize: 10 })
    }
    return pager;
}

/**
 * 如果有展开type=expand并且toggle=true时，即处理交换展开
 * 如果有选择项并限制选择数量时的处理
 */
const modiListeners = function (fieldProps, listeners) {
    if (this.columnItems.find(a => a.type === 'expand' && a.toggle)) {
        const { toggle } = this.columnItems.find(a => a.type === 'expand' && a.toggle);
        const rowKey = fieldProps.rowKey;
        //在存在rowKey并且expandRowKeys未设置的情况下，初始expandRowKeys为[] 注意expandRowKeys的使用必须设定rowKey
        if (fieldProps['expandRowKeys'] === undefined && rowKey) {
            fieldProps['expandRowKeys'] = []
        }
        //临时保存可能传入的expand-change事件
        const expandChange = listeners['expand-change'] || $.noop;
        listeners['expand-change'] = (row, data) => {
            //控制交换展开与收起
            if (data.length === 0) {
                this.fieldProps['expandRowKeys'] = [];
            } else if (rowKey) {
                if ($.isString(rowKey)) {
                    this.fieldProps['expandRowKeys'] = [row[rowKey]]
                } else if ($.isFunction(rowKey)) {
                    this.fieldProps['expandRowKeys'] = [rowKey(row)]
                }
            }
            //调用设置的展开或收起事件
            expandChange(row, toggle ? [row] : data)
        }
    }
    if (this.columnItems.find(a => a.type === 'selection' && $.isNumber(a.limit))) {
        const column = this.columnItems.find(a => a.type === 'selection' && $.isNumber(a.limit));
        //临时存放设置的选择变更事件
        const selectionChange = listeners['selection-change'] || $.noop;
        //重置选择变更事件来响应限制选择数量
        listeners['selection-change'] = rows => {
            if (column.limit === 0) {
                this.fieldProps['selections'] = rows;
                selectionChange(rows)
            } else {
                this.fieldProps['selections'] = [];
                rows.forEach((row, i) => {
                    if (i >= column.limit) {
                        this.toggleRowSelection(row, false)
                    } else {
                        this.fieldProps['selections'].push(row)
                        selectionChange(this.fieldProps['selections'])
                    }
                })
            }
        }
        //临时存放全选事件
        const selectAll = listeners['select-all'] || $.noop;
        listeners['select-all'] = () => {
            selectAll(this.fieldProps['selections'])
        }
    }
    /**
     * 在type=expand配置处设置filter(row,column)返回true时，则禁用展开
     * 在element-ui/lib/element-ui.common.js第10486行添加
     * store.table.$emit('expand-render',row,_ref6.column)
     */
    listeners['expand-render'] = (row, column) => {
        column = this.columnItems.find(a => a.columnKey === column.columnKey);
        if (column && column.filter && column.filter(row, column)) {
            setTimeout(() => {
                const index = this.tableData.indexOf(row);
                const nodes = this.$el.querySelectorAll('tr.el-table__row');
                if (index > -1 && nodes.length > index) {
                    nodes[index].querySelector('td.el-table__expand-column').innerHTML = '';
                }
            }, 100);
        }
    }
    //为实现点cell可以响应编辑，重写cell-click事件
    const onCellClick = listeners['cell-click'] || $.noop;
    listeners['cell-click'] = (row, column, cell, event) => {
        //存在editor且cellEdit=tru且对应列
        const item = findColumn(this.columnItems, a => a.editor && a.editor.cellEdit && a.columnKey === column.columnKey);
        if (item) {
            const rowkey = $.isFunction(this.rowKey) ? this.rowKey(row) : this.rowKey;
            const value = $.find(row, column.property);
            this.clickEditorData = { rowkey, rowValue: $.find(row, rowkey), value, colKey: column.columnKey };
        } else {
            this.clickEditorData = null;
        }
        //调用配置的响应事件
        onCellClick(row, column, cell, event)
    }
}
/**
 * 当配置selections时，处理选中，selections为一个数组，数组内的项目允许rowKey指定的值或data数据中的项目
 * 在mounted中会调用
 */
const setDefaultSectionData = function () {
    this.$nextTick(() => {
        const { rowKey, selections } = this.fieldProps;
        if (rowKey && $.notEmpty(selections) && $.isArray(selections) && this.columnItems.some(a => a.type === 'selection')) {
            selections.forEach(value => {
                const record = this.data.find(item => {
                    if ($.isObject(value)) {
                        return $.compare(value, item)
                    } else {
                        return value === ($.isFunction(rowKey) ? rowKey(item) : $.find(item, rowKey))
                    }
                })
                if (record) {
                    this.toggleRowSelection(record, true);
                }
            });
        }
    })
}

const formatSummary = function (fieldProps) {
    const getValue = (column, data, summary) => {
        if ($.isEmpty(summary) || $.isEmpty(column.property)) { return '' }
        const type = $.is(summary);
        if (type === 'function') {
            return summary(data, column);
        } else if (type === 'string') {
            if (summary === 'sum') {
                return data.reduce((value, curr) => {
                    const v = $.find(curr, column.property);
                    if ($.isNumber(v)) {
                        value += v;
                    }
                    return value;
                }, 0)
            } else if (summary === 'count') {
                return data.length
            } else if (summary === 'average') {
                if (data.length === 0) {
                    return 0;
                } else {
                    return (getValue(column, data, 'sum') / data.length).toFixed(2)
                }
            } else {
                const reg = /\{\{(\w+)\}\}/g;
                if (reg.test(summary)) {
                    return summary.replace(reg, ($0, $1) => {
                        return getValue(column, data, $1)
                    })
                } else {
                    return summary;
                }
            }
        }
        return ''
    }
    const getSummarys = (columns) => {
        const arr = [];
        columns.forEach(item => {
            if ($.notEmpty(item.columns)) {
                arr.push(...getSummarys(item.columns))
            } else if ($.notEmpty(item.summary)) {
                arr.push({ prop: item.prop || item.property, summary: item.summary })
            }
        })
        return arr;
    }
    const summarys = getSummarys(this.columnItems);
    if ($.isEmpty(fieldProps['summaryMethod']) && $.notEmpty(summarys)) {
        fieldProps['showSummary'] = true;
        fieldProps['summaryMethod'] = ({ columns, data }) => {
            const sums = [];
            columns.forEach((column, i) => {
                const item = summarys.find(a => a.prop === column.property);
                sums[i] = $.isEmpty(item) ? '' : getValue(column, data, item.summary)
            })
            return sums
        }
    }
}
const findColumn = function (columns, query) {
    let record;
    columns.forEach((item, i) => {
        if (!record) {
            if (query(item, i)) {
                record = item
            } else if ($.isArray(item.columns)) {
                record = findColumn(item.columns, query);
            }
        } else {
            return true;
        }
    })
    return record;
}
//根据条件过滤columnItems数据
const filterColumn = function (columns, query) {
    return columns.reduce((res, cur, i) => {
        if (query(cur, i)) {
            res.push(cur);
        }
        if ($.isArray(cur.columns)) {
            filterColumn(cur.columns, query).forEach(item => {
                res.push(item);
            })
        }
        return res;
    }, []);
}
const editorMethod = function (params) {
    let {
        record, //编辑时的原始数据，如果是增加时一般不设置，或者设置某些字段的初始值
        title, //将显示为窗口标题，在删除情况时此值为提示内容message
        fields = [],//添加、编辑时扩展的新字段内容，数组内的数据参考nfform.items项目
        action, //edit:编辑，add:新增，remove:删除
        mode = 'confirm',//confirm使用$.confirm显示,dialog使用eldialog显示
        handler, //接受点击确定可提交按钮时的响应，接收三个参数:model-表单值,done-关闭窗口的方法,form-当前表单实例
        labelWidth = '80px' //form中标签宽度
    } = params;
    //将其他配置收集到other，将作为$.confirm或$.dialog的其他配置项目
    const other = $.slice(params, ['record', 'title', 'fields', 'action', 'header', 'mode'], false)

    if (typeof handler !== 'function') {
        warning('缺少handler配置，请查看console信息')
        console.warn('请配置handler回调方法');
        console.warn('当action=edit或append时,handler接收三个参数:model-表单值,done-关闭窗口的方法,form-当前表单实例');
        console.warn('当action=remove时,handler接收一个参数done-关闭窗口的方法')
        console.warn('当handler返回true时，窗口将显示为工作状态，直接到调用done')
        return;
    }

    if (record && title) {
        title = title.replace(/\{\{(.*)\}\}/g, ($0, $1) => {
            return record[$1] || ''
        })
    }

    if (action === 'remove') {
        confirm($.applyIf({ message: title, handler, type: 'warning', title: '删除提示' }, other))
        return;
    } else if (action !== 'edit' && action !== 'append') {
        warning(`action必须是edit或append，当前action=${action || '(无)'}`);
        return;
    }
    if (mode !== 'confirm' && mode !== 'dialog') {
        warning(`mode的值必须为confirm或dialog用于指定窗口显示方式`);
        return
    }

    //console.log(this.columnItems.filter(a => a.editor).map(a => a.editor).concat(fields))
    //生成form
    const fieldItems = filterColumn(this.columnItems, a => a.editor) //过滤含editor的项目
        .map(a => { return { label: a.label, prop: a.prop, ...a.editor } }) //返回字段信息
        .concat(fields) // 联合附加的项目
        //对目标项目进行处理并返回
        .map((item, index) => {
            let disabled = false, hidden = false;
            switch ($.is(item.disabled)) {
                case 'string':
                    disabled = item.disabled === action;
                    break;
                case 'array':
                    disabled = item.disabled.indexOf(action) > -1;
                    break;
                case 'boolean':
                    disabled = item.disabled;
                    break;
                case 'object':
                    disabled = item.disabled[action] || false;
                default:
                    break;
            }
            switch ($.is(item.hidden)) {
                case 'string':
                    hidden = item.hidden === action;
                    break;
                case 'array':
                    hidden = item.hidden.indexOf(action) > -1;
                    break;
                case 'boolean':
                    hidden = item.hidden;
                    break;
                case 'object':
                    hidden = item.hidden[action] || false;
                default:
                    break;
            }
            return {
                index,
                xtype: item.xtype,
                label: item.label,
                prop: item.prop,
                value: $.has(item, 'value') ? item.value : (record ? $.find(record, item.prop) : null),
                disabled, hidden,
                ...$.slice(item, ['label', 'prop', 'value', 'disabled', 'xtype', 'hidden'], false)
            }
        })
        .sort((a, b) => a.index - b.index) //按index进行排序
        //排除hidden=true的项目，去除index和hidden字段
        .reduce((arr, item) => {
            if (!item.hidden) {
                arr.push($.slice(item, ['hidden', 'index', 'cellEdit'], false))
            }
            return arr;
        }, []);
    const instance = this.$createElement('nf-form', {
        key: $.id(),
        props: {
            labelWidth,
            fields: fieldItems
        }
    });
    //confirm和dialog统一在handler中调用
    const valid = (done) => {
        instance.child.submit().then(({ model, form }) => {
            !handler(model, done, form) && done();
        }).catch(err => {
            done(false, err.message ? err.message : '数据验证没有通过')
        })
    }

    if (mode === 'confirm') {
        confirm(
            $.apply(other, {
                type: '',
                title: title || (action === 'edit' ? '编辑信息' : '新增记录'),
                message: instance,
                handler: done => {
                    valid(done)
                    return true;
                }
            })
        )
    } else if (mode === 'dialog') {
        dialog(
            $.apply(other, {
                title: title || (action === 'edit' ? '编辑信息' : '新增记录'),
                message: instance,
                handler: done => {
                    valid(done)
                    return true;
                }
            })
        )
    }
}

export default {
    name: 'NfTable',
    mixins: [mixin],
    components: { NfCard, NfTableColumn },
    provide() {
        return {
            root: this
        };
    },
    props: {
        ...Table.props,
        stripe: {
            type: Boolean,
            default: true
        },
        title: String,
        shadow: String,
        bodyStyle: Object,
        columns: {
            type: [Array, Object],
            default() {
                return []
            }
        },
        //分页 为true时启用本地分页，为object时如果有local=true为本地分页，否则需要设置total值
        pager: [Boolean, Object],
        //配置初始化选中项目,允许data中的项目或指定rowKey对应值
        selections: {
            type: Array,
            default() {
                return []
            }
        },
        //在所有type=default的列中不存在自动宽度的列时，是否允许自动添加最后一列，以充实table
        addLastColumn: {
            type: Boolean,
            default: true
        },
        offetHeight: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            excludeProps: ['on', 'render', 'columns', 'pager', 'data', 'addLastColumn', 'maxHeight'],
            pagerProps: {},
            topValue: 0,
            clickEditorData: null
        }
    },
    computed: {
        card() {
            const card = {
                header: this.title,
                shadow: this.shadow,
                bodyStyle: this.bodyStyle,
                render: [renderPagination.call(this)]
                    .concat(getRender.call(this, ['action', 'prepend', 'footer']))
                    .concat(getRender.call(this, ['action', 'prepend', 'footer'], this.renderConfig || {}))
                    .reduce((arr, curr) => {
                        if (curr) {
                            arr.push(curr)
                        }
                        return arr;
                    }, [])
            }
            if (Object.keys(card).every(key => $.isEmpty(card[key]))) {
                return null;
            } else {
                if (!card.shadow) {
                    card.shadow = 'never'
                }
                if (!card.bodyStyle) {
                    card.bodyStyle = { padding: 0 }
                }
                return card;
            }
        },
        columnItems() {
            const items = formatColumnItems.call(this, this.columns);
            if (this.addLastColumn && !items.some(a => $.has(a, 'minWidth'))) {
                const needAdd = items.filter(item => !$.has(item, 'minWidth') && ['index', 'expand', 'selection'].indexOf(item.type) === -1)
                    .every(item => $.has(item, 'width'));
                if (needAdd) {
                    items.push({ prop: '__prop' + items.length })
                }
            }
            return items;
        },
        tableData() {
            const { local } = this.pagerProps;
            if (local) {
                const { pageSize, currentPage } = this.pagerProps;
                const start = (currentPage - 1) * pageSize,
                    end = pageSize * currentPage;
                return $.slice(this.data, [start, end])
            } else {
                return this.data
            }
        },
        tableMaxHeight() {
            let maxHeight = undefined;
            //如果有设置maxHeight则直接使用
            if (this.maxHeight) {
                maxHeight = this.maxHeight;
            } else if (this.offetHeight > 0 && this.$bus.height > 0) {
                //在设置offetHeight且this.$bus.height>0时有效
                maxHeight = this.$bus.height - this.offetHeight - this.topValue;
                //topValue是通过$el.getBoundingClientRect()获得当前table所有位置中top值
            }
            return maxHeight;
        }
    },
    render(h) {
        const withCard = !!this.card;
        const table = h('el-table', {
            ref: this.ref,
            props: { ...this.fieldProps, data: this.tableData, maxHeight: this.tableMaxHeight },
            on: this.listeners,
            class: { 'nf-table': true, 'nf-table-incard': withCard }
        }, renderColumn.call(this, h, this.columnItems).concat(getRender.call(this, ['append', 'empty', 'default'])));

        return withCard ? h('nf-card', {
            props: $.slice(this.card, 'render', false)
        }, [table].concat(this.card.render)) : table;

    },
    methods: {
        initConfig({ fieldProps, listeners }) {
            //在启用行样式的情况下禁用斑马效果
            if (fieldProps['rowClassName'] && fieldProps['stripe']) {
                fieldProps['stripe'] = false;
            }
            formatSummary.call(this, fieldProps);
            //根据情况，可能处理交换展开、限制选择
            modiListeners.call(this, fieldProps, listeners);
            if (typeof this.load === 'function') {
                fieldProps['lazy'] = true;
            }

            return { fieldProps, listeners, pagerProps: formatPagerProps.call(this) }
        },
        //在树型表格中根据当前行数据获取对应的children数据
        getChildren(row) {
            const instance = this.$refs[this.ref];
            const { children, hasChildren } = instance.treeProps;
            if (row[hasChildren]) {
                const key = typeof instance.rowKey === 'function' ? instance.rowKey(row) : row[instance.rowKey];
                return key ? (instance.store.states.lazyTreeNodeMap[key] || []) : []
            } else {
                return row[children] || [];
            }
        },
        remove(params) {
            if (arguments.length === 1) {
                editorMethod.call(this, $.apply({}, params, { action: 'remove' }))
            } else if (arguments.length > 1) {
                //(title,handler)
                editorMethod.call(this, { action: 'remove', title: arguments[0], handler: arguments[1] })
            }
        },
        append(params) {
            editorMethod.call(this, $.apply({}, params, { action: 'append' }))
        },
        edit(params) {
            editorMethod.call(this, $.apply({}, params, { action: params.record ? 'edit' : 'append' }))
        }
    },
    mounted() {
        createMethods.call(this, Table.methods);
        setDefaultSectionData.call(this);
        this.$nextTick(() => {
            const rect = this.$refs[this.ref].$el.getBoundingClientRect();
            this.topValue = rect.top;
        })
    },
}