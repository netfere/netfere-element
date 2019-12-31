import { $ } from "../../packages/utils";
const input = {
    xtype: "input",
    label: "姓名",
    prop: "name",
    rules: { required: true, msg: "不能为空" },
    width: 180,
    render: {
        append: { tag: "span", context: "必填" }
    }
}
const number = {
    xtype: "number",
    label: "年龄",
    prop: "age"
}
const radio = {
    xtype: "radios",
    label: "性别",
    prop: "sex",
    button: true,
    items: [{ label: "男", value: 1 }, { label: "女", value: 0 }]
}
const checkbox = {
    xtype: "checkbox",
    label: "协议",
    prop: "agree",
    display: "同意"
}
const checkboxs = {
    xtype: "checkboxs",
    label: "兴趣爱好",
    prop: "hao",
    flex: 2,
    items: ["游泳", "计算机", "体育", "阅读", "游戏"]
}
const color = {
    xtype: "color",
    label: "颜色",
    prop: "color"
}
const _switch = {
    xtype: "switch",
    label: "订阅",
    value: true,
    active: "包月",
    inactive: "包年",
    prop: "type"
}
const slider = {
    xtype: "slider",
    label: "月数",
    prop: "slider",
    max: 10,
    min: 0,
    value: 3
}
const rate = {
    xtype: "rate",
    label: "评级",
    prop: "rate",
    value: 3
}
const cascader = {
    xtype: "cascader",
    prop: "cascader",
    label: "选择",
    options: [
        {
            value: "zhinan",
            label: "指南",
            children: [
                {
                    value: "shejiyuanze",
                    label: "设计原则",
                    children: [
                        {
                            value: "yizhi",
                            label: "一致"
                        },
                        {
                            value: "fankui",
                            label: "反馈"
                        },
                        {
                            value: "xiaolv",
                            label: "效率"
                        },
                        {
                            value: "kekong",
                            label: "可控"
                        }
                    ]
                },
                {
                    value: "daohang",
                    label: "导航",
                    children: [
                        {
                            value: "cexiangdaohang",
                            label: "侧向导航"
                        },
                        {
                            value: "dingbudaohang",
                            label: "顶部导航"
                        }
                    ]
                }
            ]
        },
        {
            value: "zujian",
            label: "组件",
            children: [
                {
                    value: "basic",
                    label: "Basic",
                    children: [
                        {
                            value: "layout",
                            label: "Layout 布局"
                        },
                        {
                            value: "color",
                            label: "Color 色彩"
                        },
                        {
                            value: "typography",
                            label: "Typography 字体"
                        },
                        {
                            value: "icon",
                            label: "Icon 图标"
                        },
                        {
                            value: "button",
                            label: "Button 按钮"
                        }
                    ]
                },
                {
                    value: "form",
                    label: "Form",
                    children: [
                        {
                            value: "radio",
                            label: "Radio 单选框"
                        },
                        {
                            value: "checkbox",
                            label: "Checkbox 多选框"
                        },
                        {
                            value: "input",
                            label: "Input 输入框"
                        },
                        {
                            value: "input-number",
                            label: "InputNumber 计数器"
                        },
                        {
                            value: "select",
                            label: "Select 选择器"
                        },
                        {
                            value: "cascader",
                            label: "Cascader 级联选择器"
                        },
                        {
                            value: "switch",
                            label: "Switch 开关"
                        },
                        {
                            value: "slider",
                            label: "Slider 滑块"
                        },
                        {
                            value: "time-picker",
                            label: "TimePicker 时间选择器"
                        },
                        {
                            value: "date-picker",
                            label: "DatePicker 日期选择器"
                        },
                        {
                            value: "datetime-picker",
                            label: "DateTimePicker 日期时间选择器"
                        },
                        {
                            value: "upload",
                            label: "Upload 上传"
                        },
                        {
                            value: "rate",
                            label: "Rate 评分"
                        },
                        {
                            value: "form",
                            label: "Form 表单"
                        }
                    ]
                },
                {
                    value: "data",
                    label: "Data",
                    children: [
                        {
                            value: "table",
                            label: "Table 表格"
                        },
                        {
                            value: "tag",
                            label: "Tag 标签"
                        },
                        {
                            value: "progress",
                            label: "Progress 进度条"
                        },
                        {
                            value: "tree",
                            label: "Tree 树形控件"
                        },
                        {
                            value: "pagination",
                            label: "Pagination 分页"
                        },
                        {
                            value: "badge",
                            label: "Badge 标记"
                        }
                    ]
                },
                {
                    value: "notice",
                    label: "Notice",
                    children: [
                        {
                            value: "alert",
                            label: "Alert 警告"
                        },
                        {
                            value: "loading",
                            label: "Loading 加载"
                        },
                        {
                            value: "message",
                            label: "Message 消息提示"
                        },
                        {
                            value: "message-box",
                            label: "MessageBox 弹框"
                        },
                        {
                            value: "notification",
                            label: "Notification 通知"
                        }
                    ]
                },
                {
                    value: "navigation",
                    label: "Navigation",
                    children: [
                        {
                            value: "menu",
                            label: "NavMenu 导航菜单"
                        },
                        {
                            value: "tabs",
                            label: "Tabs 标签页"
                        },
                        {
                            value: "breadcrumb",
                            label: "Breadcrumb 面包屑"
                        },
                        {
                            value: "dropdown",
                            label: "Dropdown 下拉菜单"
                        },
                        {
                            value: "steps",
                            label: "Steps 步骤条"
                        }
                    ]
                },
                {
                    value: "others",
                    label: "Others",
                    children: [
                        {
                            value: "dialog",
                            label: "Dialog 对话框"
                        },
                        {
                            value: "tooltip",
                            label: "Tooltip 文字提示"
                        },
                        {
                            value: "popover",
                            label: "Popover 弹出框"
                        },
                        {
                            value: "card",
                            label: "Card 卡片"
                        },
                        {
                            value: "carousel",
                            label: "Carousel 走马灯"
                        },
                        {
                            value: "collapse",
                            label: "Collapse 折叠面板"
                        }
                    ]
                }
            ]
        },
        {
            value: "ziyuan",
            label: "资源",
            children: [
                {
                    value: "axure",
                    label: "Axure Components"
                },
                {
                    value: "sketch",
                    label: "Sketch Templates"
                },
                {
                    value: "jiaohu",
                    label: "组件交互文档"
                }
            ]
        }
    ]
}
const select = {
    xtype: "select",
    label: "城市",
    prop: "city",
    multiple: true,
    items: [
        { value: 1, label: "福州" },
        { value: 2, label: "南京" },
        { value: 3, label: "上海" },
        { value: 4, label: "北京" },
        { value: 5, label: "苏州" },
        { value: 6, label: "贵阳" },
        { value: 7, label: "香港", disabled: true }
    ],
    render: {
        label: { tag: "span", style: "color:red", context: "城市" },
        prefix: { tag: "i", class: "el-icon-edit" },
        empty: {
            tag: "span",
            style: "color:red",
            context: "没有内容可选"
        },
        option: (h, item) => {
            return h("div", {}, [
                h("span", item.label),
                h("span", { style: { float: "right" } }, item.value + "")
            ]);
        }
    }
}


const datetimeOption = {
    timeany: {
        xtype: 'time-any',
        label: 'nf-time-any 自定义可选时间',
        pickerOptions: [
            '08:00:00-10:00:00',
            '12:00:00-15:00:00'
        ]
    },
    timerange: {
        xtype: 'time-range',
        label: 'nf-time-range 选择时间范围',
        placeholder: [
            '开始', '结束', '至'
        ]
    },
    timeselect: {
        xtype: 'time-select',
        label: 'nf-time-select 指定时间及间隔',
        prop: 'timeselect',
        pickerOptions: [10, 11, 5],
    },
    time: {
        xtype: 'time',
        label: 'nf-time-picker(nf-time) 等同于el-time-picker'
    },
    week: {
        xtype: 'week',
        label: 'nf-week 选择周次',
        shortcuts: [
            { text: '本周', time: $.date().endOfDay() },
            { text: '上周', week: -1 },
            { text: '上上周', week: -2 }
        ]
    },
    year: {
        xtype: 'year',
        label: 'nf-year 选择年份'
    },
    month: {
        xtype: 'month',
        label: 'nf-month 选择月份'
    },
    dates: {
        xtype: 'dates',
        label: 'nf-dates 选择多个日期'
    },
    datetime: {
        xtype: 'datetime',
        label: 'nf-datetime 选择日期和时间',
        defaultTime: '10:00:00',
        shortcuts: [
            { text: '今天', time: new Date() },
            { text: '昨天', day: -1 },
            { text: '上周', week: -1 }
        ]
    },
    datetimerange: {
        xtype: 'datetime-range',
        label: 'nf-datetime-range 选择日期和时间范围',
        defaultTime: ['10:00:00', '10:00:00'],
        max: new Date(),
        placeholder: [
            '开始', '结束', '至'
        ],
        shortcuts: [
            { text: '本月', range: [$.date().startOfMonth(), new Date()] },
            { text: '今年至今', range: [$.date().startOfYear(), new Date()] },
            { text: '最近六个月', range: [$.date().addMonths( -6)] }
        ]
    },
    daterange: {
        xtype: 'date-range',
        label: 'nf-date-range 选择日期范围',
        max: new Date(),
        placeholder: [
            '开始', '结束', '至'
        ],
        shortcuts: [
            { text: '本月', range: [$.date().startOfMonth(), new Date()] },
            { text: '今年至今', range: [$.date().startOfYear(), new Date()] },
            { text: '最近六个月', range: [$.date().addMonths( -6)] }
        ]
    },
    monthrange: {
        xtype: 'month-range',
        label: 'nf-month-range 选择月份范围',
        placeholder: [
            '开始', '结束', '至'
        ],
        shortcuts: [
            { text: '本月', range: [$.date().startOfMonth(), new Date()] },
            { text: '今年至今', range: [$.date().startOfYear(), new Date()] },
            { text: '最近六个月', range: [$.date().addMonths( -6)] }
        ]
    },
    date: {
        xtype: 'date',
        label: 'nf-date-picker(nf-date) 等同于el-date-picker'
    }
}

const fieldOption = { input, number, radio, checkbox, checkboxs, color, _switch, slider, rate, cascader, select }
const baseFields = Object.keys(fieldOption)
    .reduce((res, key) => {
        res.push(fieldOption[key]);
        return res;
    }, []);

const datetimeFields = Object.keys(datetimeOption)
    .reduce((res, key) => {
        res.push(datetimeOption[key]);
        return res;
    }, []);

export {
    datetimeFields, baseFields
}