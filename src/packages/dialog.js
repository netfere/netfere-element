import Vue from 'vue';
import mixin from './base'
import {Dialog} from 'element-ui';
import { toast } from './modal'
import { $, getRender, px } from './utils';


const updateState = function (loading) {
    this.fieldProps['loading'] = loading;
    this.$refs['confirm'].mask(loading, this.fieldProps['loadText']);
    this.$refs['cancel'].set(loading);
    if (this.fieldProps.closeOnClickModal) {
        this.fieldProps.closeOnClickModal = !loading;
    }
    if (this.fieldProps.closeOnRressEscape) {
        this.fieldProps.closeOnRressEscape = !loading;
    }
    if (this.fieldProps.showClose) {
        this.fieldProps.showClose = !loading;
    }
}


const registerDrag = function (el) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style = 'cursor:move;'
    let start = 0;
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
    const callback = function (name) {
        let left = dragDom.style.left, top = dragDom.style.top;
        left = parseInt(left.replace(/\px/g, ''));
        top = parseInt(top.replace(/\px/g, ''));
        if (name === 'dblclick') {
            dragDom.style.left = '0';
            dragDom.style.top = '0';
        }
    }
    dialogHeaderEl.onmouseup = e => {
        if (new Date().getTime() - start > 300) {
            start = 0
        }
    }
    dialogHeaderEl.onmousedown = (e) => {
        if (start === 0) {
            start = new Date().getTime()
        } else if (new Date().getTime() - start < 300) {
            callback('dblclick')
            start = 0
        }
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft
        const disY = e.clientY - dialogHeaderEl.offsetTop

        // 获取到的值带px 正则匹配替换
        let styL, styT

        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (sty.left.includes('%')) {
            styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
            styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
        } else {
            styL = +sty.left.replace(/\px/g, '')
            styT = +sty.top.replace(/\px/g, '')
        }
        callback('down')

        document.onmousemove = function (e) {
            // 通过事件委托，计算移动的距离
            const l = e.clientX - disX
            const t = e.clientY - disY
            // 移动当前元素
            dragDom.style.left = `${l + styL}px`
            dragDom.style.top = `${t + styT}px`

            // 将此时的位置传出去
            callback('move')
        }

        document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
            callback('up')
        }
    }
}
const defaultFooter = function () {
    const h = this.$createElement;
    const done = (close, msg, delay = 3) => {
        updateState.call(this, false)
        if (close === true || close === undefined) {
            this.$refs[this.ref].handleClose();
            msg && toast({ message: msg, type: 'success' })
        } else if (msg || $.isString(close)) {
            toast({ message: msg || close, type: 'error', duration: (delay || 3) * 1000, showClose: $.isEmpty(delay) })
        }
    }
    const slots = []
    if (this.cancel !== false) {
        const cancel = $.isFunction(this.cancel) ? { text: '取消', handler: this.cancel } : (this.cancel || {});
        const config = $.apply({
            type: 'default',
            text: cancel.text || '取消',
            handler: () => {
                if (cancel.handler) {
                    !cancel.handler(done, this) && done()
                } else {
                    done()
                }
            }
        }, $.slice((cancel || {}), ['handler'], false));
        slots.push(h('nf-button', { ref: 'cancel', slot: 'footer', props: config }))
    }
    slots.push(h('nf-button', {
        ref: 'confirm',
        slot: 'footer',
        props: {
            type: 'primary',
            text: this.btnText,
            handler: btn => {
                if (this.handler) {
                    updateState.call(this, true)
                    !this.handler(done, btn) && done()
                } else {
                    done()
                }
            }
        }
    }))
    return slots
}
const initSlots = function () {
    if ($.isEmpty(this.templates)) {
        if (this.message) {
            this.templates.push(this.message);
        }
        const vFooter = getRender.call(this, 'footer');
        //添加默认按钮
        if ($.isEmpty(vFooter)) {
            this.templates.push(...defaultFooter.call(this))
        } else {
            this.templates.push(...vFooter)
        }
        this.templates.push(...getRender.call(this, ['default', 'title']));
    }
}

const NfDialog= {
    name: 'NfDialog',
    mixins: [mixin],
    model: {
        prop: 'visible',
        event: 'input'
    },
    props: {
        ...Dialog.props,
        width: {
            type: [String, Number],
            default: '50%'
        },
        customClass: {
            type: String,
            default: 'nf-dialog'
        },
        appendToBody: {
            type: Boolean,
            default: true
        },
        visible: Boolean,
        message: [String, Object, Array],
        loading: Boolean,
        loadText: String,
        drag: {
            type: Boolean,
            default: true
        },
        handler: Function,
        btnText: {
            type: String,
            default: '确定'
        },
        cancel: {
            type: [Boolean, Function, Object],
            default: true
        }
    },
    data() {
        return {
            excludeProps: ['on', 'render', 'message', 'drag', 'handler', 'btnText', 'cancel', 'visible'],
            templates: []
        }
    },
    computed: {
        show: {
            get() {
                return this.visible
            },
            set(value) {
                this.listeners.input && this.listeners.input(value)
            }
        },
    },
    render(h) {
        return h('el-dialog', {
            ref: this.ref,
            props: { ...$.slice(this.fieldProps, ['loading', 'loadText'], false), visible: this.show },
            on: {
                ...$.slice(this.listeners, ['close', 'input'], false),
                close: () => {
                    if (!this.fieldProps.loading) {
                        this.show = false;
                        this.listeners.close && this.listeners.close();
                        if (this.$el && this.$el.parentNode) {
                            document.body.removeChild(this.$el);
                        }
                    }
                }
            }
        }, this.templates)
    },
    methods: {
        initConfig({ fieldProps, listeners }) {
            fieldProps['width'] = px(this.width);
            return { fieldProps, listeners }
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.drag) {
                registerDrag(this.$el)
            }
            initSlots.call(this)
        })
    },
}
const DialogConstructor= Vue.extend(NfDialog)
export default NfDialog;
export {
    DialogConstructor
}
