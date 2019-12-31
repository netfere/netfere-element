
import Field from './base'
import { $ } from '../utils'

const validator = function (val) {
    // either: String, Array of String, null / undefined
    return (
        val === null ||
        val === undefined ||
        $.isString(val) ||
        (Array.isArray(val) && val.length === 2 && val.every(isString))
    );
};
const defaultProps = {
    size: String,
    format: String,
    valueFormat: String,
    readonly: Boolean,
    placeholder: String,
    startPlaceholder: String,
    endPlaceholder: String,
    prefixIcon: String,
    clearIcon: {
        type: String,
        default: 'el-icon-circle-close'
    },
    name: {
        default: '',
        validator
    },
    disabled: Boolean,
    clearable: {
        type: Boolean,
        default: true
    },
    id: {
        default: '',
        validator
    },
    popperClass: String,
    editable: {
        type: Boolean,
        default: true
    },
    align: {
        type: String,
        default: 'left'
    },
    value: {},
    defaultValue: {},
    defaultTime: {},
    rangeSeparator: {
        default: '-'
    },
    pickerOptions: {},
    unlinkPanels: Boolean,
    validateEvent: {
        type: Boolean,
        default: true
    },
    appendToBody: {
        type: Boolean,
        default: true
    },
    arrowOffset: {
        type: Number,
        default: 35
    },
    boundariesPadding: {
        type: Number,
        default: 5
    },
    offset: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: 'date'
    },
    //仅在timePicker中有效
    isRange: {
        type: Boolean,
        default: false
    },
    //仅在timePicker中有效
    arrowControl: {
        type: Boolean,
        default: false
    },
    //仅在DatePicker中有效
    timeArrowControl: {
        type: Boolean,
        default: false
    }
}

const extendProps = {
    ...defaultProps,
    editable: {
        type: Boolean,
        default: false
    },
    placeholder: [String, Array],
    min: [String, Number, Date],
    max: [String, Number, Date],
    shortcuts: Array
}

const init = (list) => {
    return list.reduce((res, { excludes = ['pickerOptions'], props, compName, name, tag = 'el-date-picker', config = $.noop }) => {
        res['Nf' + name] = {
            name: compName || ('Nf' + name),
            mixins: [Field],
            props: props || extendProps,
            data() {
                return {
                    excludeProps: ['on', 'render', ...excludes]
                }
            },
            render(h) {
                return this.renderField(tag)
            },
            methods: {
                initConfig({ fieldProps, listeners }) {
                    config.call(this, fieldProps);
                    return { fieldProps, listeners }
                },
                focus(){
                    this.$refs[this.ref].focus()
                }
            },
        }
        return res;
    }, {})
}

const getDatePickerOptions = function (fieldProps, isRange) {
    let pickerOptions = {firstDayOfWeek:1};
    const { min, max, shortcuts } = fieldProps;
    if (min || max) {
        pickerOptions['disabledDate'] = time => {
            const timeStamp = time.getTime();
            return (max && timeStamp > $.date(max).getTime())
                || (min && timeStamp < $.date(min).getTime());
        }
    }
    
    if (shortcuts) {
        pickerOptions['shortcuts'] = shortcuts.map(item => {
            const { text, time, day, week, month, year, quarter, range } = item;
            const onClick = isRange
                ? picker => {
                    if ($.isEmpty(range) || !$.isArray(range)) { return; }
                    const [start, end = new Date()] = range;
                    picker.$emit('pick', [start, end]);
                }
                : picker => {
                    let timeStamp;
                    if (time) {
                        timeStamp = time;
                    } else {
                        const now = new Date();
                        if (day) {
                            timeStamp = $.date(now).addDays(day);
                        } else if (week) {
                            timeStamp = $.date(now).addWeeks(week)
                        } else if (month) {
                            timeStamp = $.date(now).addMonths(month)
                        } else if (year) {
                            timeStamp = $.date(now).addYears(year)
                        } else if (quarter) {
                            timeStamp = $.date(now).addQuarters(quarter)
                        }
                    }
                    if (timeStamp) {
                        picker.$emit('pick', timeStamp);
                    }
                }
            return {
                text, onClick
            }
        })
    }
    return pickerOptions

}

const components = init([
    {
        name: 'TimeAny',
        tag: 'el-time-picker',
        config(fieldProps) {
            fieldProps['placeholder'] = fieldProps['placeholder'] || '选择时间';
            fieldProps['pickerOptions'] = $.isObject(this.pickerOptions) ? this.pickerOptions : {
                selectableRange: this.pickerOptions
            }
        }
    }, {
        name: 'TimeRange',
        tag: 'el-time-picker',
        excludes: ['placeholder'],
        config(fieldProps) {
            fieldProps['isRange'] = true;
            if ($.isString(this.placeholder)) {
                fieldProps['rangeSeparator'] = this.placeholder
            } else if ($.isArray(this.placeholder)) {
                const text = this.placeholder.reduce((res, value, i) => {
                    if (i < 3) {
                        let key = ['startPlaceholder', 'endPlaceholder', 'rangeSeparator'][i];
                        res[key] = value
                    }
                    return res;
                }, {});
                $.apply(fieldProps, text);
            }

        }
    }, {
        name: 'TimeSelect',
        tag: 'el-time-select',
        config(fieldProps) {
            fieldProps['type'] = 'time-select';
            fieldProps['placeholder'] = fieldProps['placeholder'] || '选择时间';
            if ($.isObject(this.pickerOptions)) {
                fieldProps['pickerOptions'] = this.pickerOptions;
            } else if ($.isArray(this.pickerOptions)) {
                fieldProps['pickerOptions'] = this.pickerOptions.reduce((res, value, i) => {
                    if (i < 5) {
                        let key = ['start', 'end', 'step', 'minTime', 'maxTime'][i];
                        if ($.isNumber(value)) {
                            res[key] = key === 'step' ? `00:${value}` : `${value}:00`
                        } else {
                            res[key] = value;
                        }
                    }
                    return res
                }, {});
            }
        }
    }, {
        name: 'Time',
        compName: 'NfTimePicker',
        tag: 'el-time-picker',
        excludes: [],
        props: defaultProps
    }, {
        name: 'Date',
        compName: 'NfDatePicker',
        excludes: [],
        props: defaultProps
    }, {
        name: 'Week',
        config(fieldProps) {
            fieldProps['type'] = 'week';
            fieldProps['placeholder'] = fieldProps['placeholder'] || '选择周';
            fieldProps['format'] = fieldProps['format'] || "yyyy 第 WW 周";
            fieldProps['pickerOptions'] = $.apply({}, this.pickerOptions || {}, getDatePickerOptions(fieldProps));
        }
    }, {
        name: 'Year',
        config(fieldProps) {
            fieldProps['type'] = 'year';
            fieldProps['placeholder'] = fieldProps['placeholder'] || '选择年份';
            fieldProps['format'] = fieldProps['format'] || "yyyy年";
            fieldProps['pickerOptions'] = $.apply({}, this.pickerOptions || {}, getDatePickerOptions(fieldProps));
        }
    }, {
        name: 'Month',
        config(fieldProps) {
            fieldProps['type'] = 'month';
            fieldProps['placeholder'] = fieldProps['placeholder'] || '选择月份';
            fieldProps['format'] = fieldProps['format'] || "yyyy年MM月";
            fieldProps['pickerOptions'] = $.apply({}, this.pickerOptions || {}, getDatePickerOptions(fieldProps));
        }
    }, {
        name: 'Dates',
        config(fieldProps) {
            fieldProps['type'] = 'dates';
            fieldProps['placeholder'] = fieldProps['placeholder'] || '选择日期';
        }
    }, {
        name: 'Datetime',
        config(fieldProps) {
            fieldProps['type'] = 'datetime';
            fieldProps['placeholder'] = fieldProps['placeholder'] || '选择日期时间';
            fieldProps['pickerOptions'] = $.apply({}, this.pickerOptions || {}, getDatePickerOptions(fieldProps));
        }
    }, {
        name: 'DatetimeRange',
        excludes: ['placeholder','pickerOptions'],
        config(fieldProps) {
            fieldProps['type'] = 'datetimerange';
            if ($.isString(this.placeholder)) {
                fieldProps['rangeSeparator'] = this.placeholder
            } else if ($.isArray(this.placeholder)) {
                const text = this.placeholder.reduce((res, value, i) => {
                    if (i < 3) {
                        let key = ['startPlaceholder', 'endPlaceholder', 'rangeSeparator'][i];
                        res[key] = value
                    }
                    return res;
                }, {});
                $.apply(fieldProps, text);
            }
            fieldProps['pickerOptions'] = $.apply({}, this.pickerOptions || {}, getDatePickerOptions(fieldProps,true));
        }
    },{
        name:'DateRange',
        excludes: ['placeholder','pickerOptions'],
        config(fieldProps) {
            fieldProps['type'] = 'daterange';
            if ($.isString(this.placeholder)) {
                fieldProps['rangeSeparator'] = this.placeholder
            } else if ($.isArray(this.placeholder)) {
                const text = this.placeholder.reduce((res, value, i) => {
                    if (i < 3) {
                        let key = ['startPlaceholder', 'endPlaceholder', 'rangeSeparator'][i];
                        res[key] = value
                    }
                    return res;
                }, {});
                $.apply(fieldProps, text);
            }
            fieldProps['pickerOptions'] = $.apply({}, this.pickerOptions || {}, getDatePickerOptions(fieldProps,true));
        }
    },{
        name:'MonthRange',
        excludes: ['placeholder','pickerOptions'],
        config(fieldProps) {
            fieldProps['type'] = 'monthrange';
            fieldProps['format'] = fieldProps['format'] || "yyyy年MM月";
            if ($.isString(this.placeholder)) {
                fieldProps['rangeSeparator'] = this.placeholder
            } else if ($.isArray(this.placeholder)) {
                const text = this.placeholder.reduce((res, value, i) => {
                    if (i < 3) {
                        let key = ['startPlaceholder', 'endPlaceholder', 'rangeSeparator'][i];
                        res[key] = value
                    }
                    return res;
                }, {});
                $.apply(fieldProps, text);
            }
            fieldProps['pickerOptions'] = $.apply({}, this.pickerOptions || {}, getDatePickerOptions(fieldProps,true));
        }
    }
])


export default components