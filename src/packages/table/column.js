import mixin from '../base'
import {TableColumn} from 'element-ui';

import { $, getScoped } from '../utils'
const formatColumnData = function (fieldProps) {
    const me = this;
    let props = {};
    const indexColumn = function () {
        props = $.slice(fieldProps, ['width'], false);
        if (props['align'] === undefined) {
            props['align'] = 'center';
        }
        if (fieldProps['index'] === undefined) {
            const { pageSize, currentPage, total } = me.root.pagerProps;
            props['index'] = idx => {
                let no = idx + 1;
                if ($.isNumber(total) && $.isNumber(pageSize)) {
                    no = pageSize * (currentPage - 1) + no;
                    const len = (total + '').length - (no + '').length;
                    return len > 0 ? ('0'.repeat(len) + no) : no;
                } else {
                    return no;
                }
            }
        }
    };
    const expandColumn = function () {
        props = $.slice(fieldProps, ['width'], false);
        if (props['align'] === undefined) {
            props['align'] = 'center';
        }
    };
    const selectionColumn = function () {
        props = $.slice(fieldProps, ['width'], false);
        if (props['align'] === undefined) {
            props['align'] = 'center';
        }
        const { limit = 0, selectable } = fieldProps;
        if (!selectable && limit > 0) {
            props['selectable'] = row => {
                const selections = me.root.fieldProps.selections;
                //已选择的情况下可以取消
                if (selections.indexOf(row) > -1) {
                    return true;
                } else if (limit > 0 && limit <= selections.length) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    };
    const defaultColumn = function () {
        props = fieldProps;
        if (props.label === undefined && !props['prop'].startsWith('__prop')) {
            props['label'] = props['prop'] || '';
        }
    };

    switch (fieldProps.type) {
        case 'index':
            indexColumn();
            break;
        case 'expand':
            expandColumn();
            break;
        case 'selection':
            selectionColumn();
            break;
        default:
            defaultColumn();
            break;
    }
    if (props.property === undefined) {
        props.property = props.prop;
    }
    if (props.columnKey === undefined) {
        props.columnKey = props.prop;
    }
    return props;
}
export default {
    name: 'NfTableColumn',
    mixins: [mixin],
    inject: {
        root: {
            default: ''
        }
    },
    props: {
        ...TableColumn.props,
        toggle: Boolean,
        limit: {
            type: Number,
            default: 0
        },
        //show-overflow-tooltip
        tip: Boolean,
        //单元格式紧凑
        compact: Boolean
    },
    components: {},
    data() {
        return {
            excludeProps: ['on', 'render', 'columns', 'tip', 'compact'],
        }
    },
    render(h) {
        const scopedSlots = getScoped.call(this, ['header', 'default']);
        return h('el-table-column', {
            ref: this.ref,
            props: $.slice(this.fieldProps, ['toggle', 'limit'], false),
            scopedSlots,
            on:this.listeners
        }, this.$slots.default)
    },
    methods: {
        initConfig({ fieldProps, listeners }) {
            if (fieldProps['showOverflowTooltip'] === false && this.tip === true) {
                fieldProps['showOverflowTooltip'] = true;
            }
            if (this.compact) {
                fieldProps['className'] = 'compact'
            }
            return {
                fieldProps: formatColumnData.call(this, fieldProps),
                listeners
            }
        }
    }
}