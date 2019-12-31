import Vue from 'vue';
import { Message, MessageBox, Loading, Notification } from 'element-ui';
import {DialogConstructor} from './dialog';
import { $ } from './utils'

let loadingInstance, rndBackgroupColorTimer;

//格式化MessageBox应用参数
const messageBoxFormat = function (options) {
    //参数为对象，且不是VNode时，视为直接传入配置数据
    if ($.isObject(options) && !$.isVNode(options)) {
        const alias = $.remove(options, ['title', 'message', 'btnText', 'modal', 'esc', 'ishtml', 'handler', 'loadText', 'cancel', 'close']);
        //cancel提供取消按钮信息，仅为String时设置cancelButtonText，仅为Function时设置点击取消时的响应;
        //或者为{text:String,handler:Function}的Object
        if (alias.cancel) {
            if ($.isString(alias.cancel) || $.isFunction(alias.cancel)) {
                alias.cancel = {
                    text: $.isString(alias.cancel) ? alias.cancel : '取消',
                    handler: $.isFunction(alias.cancel) ? alias.cancel : $.noop
                }
            } else if ($.isObject(alias.cancel)) {
                alias.cancel = $.applyIf({ text: '取消', handler: $.noop }, alias.cancel)
            }
        } else {
            alias.cancel = { text: '取消' }
        }
        return { alias: $.apply({ title: '提示' }, alias), options };
    } else {
        //判断参数数量及参数类型后，生成配置项后再次调用
        let config = {}
        if (arguments.length === 1) {
            config = { message: arguments[0] }
        } else if (arguments.length === 2) {
            config['message'] = arguments[0];
            switch ($.is(arguments[1])) {
                case 'function':
                    $.apply(config, { handler: arguments[1] })
                    break;
                case 'string':
                    $.apply(config, { title: arguments[1] })
                    break;
            }
        } else if (arguments.length === 3) {
            //三个参数组合 [message,title,handler] [message,title,options]
            config['message'] = arguments[0];
            config['title'] = arguments[1];
            switch ($.is(arguments[2])) {
                case 'function':
                    $.apply(config, { handler: arguments[2] })
                    break;
                case 'string':
                    $.apply(config, { type: arguments[2] })
                    break;
                default:
                    break;
            }
        } else {
            config = { title: '参数错误', message: '代码中提供的参数要求不正确', type: 'error' }
        }
        return messageBoxFormat(config)
    }
}

const messageBoxBeforeClose = function (action, instance, done, options, alias) {
    const { isPrompt } = alias;
    if (action === 'confirm') {
        /**
         * 该方法将由handler回调
         * @param {Boolean} close 是否关闭MessageBox
         * @param {String} msg 错误或提示信息，仅当close=false有效
         * @param {Number} delay 错误提示显示秒数
         */
        const cb = (close, msg, delay = 3) => {
            //恢复状态、按钮文本
            instance.confirmButtonLoading = false;
            instance.confirmButtonText = options.confirmButtonText;

            if (close === true || close === undefined) {
                done();
                msg && toast({ message: msg, type: 'success' })
            } else if (msg || $.isString(close)) {
                toast({ message: msg || close, type: 'error', duration: (delay || 3) * 1000, showClose: $.isEmpty(delay) })
            }
        }
        let prams = (isPrompt ? [instance.inputValue, cb, instance] : [cb, instance]);
        //传入的handler方法，如果返回true，则将MessageBox保持，并由handler中异步调用cb来控制MessageBox
        if (alias.handler(...prams)) {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = alias.loadText || '执行中...';
        } else {
            done();
        }
    } else if (!instance.confirmButtonLoading) {
        //在非引导状态下时处理action=cancel|close
        //配置中distinguishCancelAndClose=true 详见此值说明
        let prams = (isPrompt ? [done, instance, instance.inputValue] : [done, instance]);
        //点击取消并且有取消响应时
        if (action === 'cancel' && $.isFunction(alias.cancel.handler)) {
            //取消响应返回非true时同时调用done
            !alias.cancel.handler(...prams) && done()
        } else if (action === 'close' && $.isFunction(alias.close)) {
            //取消响应返回非true时同时调用done
            !alias.close(...prams) && done()
        } else {
            done();
        }
    }
}

const alert = function () {
    const { alias, options } = messageBoxFormat(...arguments);
    $.applyNot(options, {
        type: 'info',
        distinguishCancelAndClose: true,
        confirmButtonText: alias.btnText || '确定',
        closeOnClickModal: alias.modal === false ? false : true,
        closeOnPressEscape: alias.esc === false ? false : true,
        dangerouslyUseHTMLString: alias.ishtml || false,
        //提供handler时则启用beforeClose
        beforeClose: !alias.handler ? null : (action, instance, done) => {
            messageBoxBeforeClose(action, instance, done, options, alias)
        }
    })

    MessageBox.alert(alias.message, alias.title, options).then($.noop).catch($.noop)
}

const confirm = function () {
    const { alias, options } = messageBoxFormat(...arguments);
    $.applyNot(alias, { cancel: { text: '取消' } });
    //响应规则 优先使用options.beforeClose，否则处理options.handler，再次响应option.callback
    $.applyNot(options, {
        type: 'info',
        distinguishCancelAndClose: true,
        cancelButtonText: alias.cancel.text,
        confirmButtonText: alias.btnText || '确定',
        closeOnClickModal: alias.modal === false ? false : true,
        closeOnPressEscape: alias.esc === false ? false : true,
        dangerouslyUseHTMLString: alias.ishtml || false,
        //提供handler时则启用beforeClose
        beforeClose: !alias.handler ? null : (action, instance, done) => {
            messageBoxBeforeClose(action, instance, done, options, alias)
        }
    })

    MessageBox.confirm(alias.message, alias.title, options).then($.noop).catch($.noop)
}

const prompt = function () {
    const { alias, options } = messageBoxFormat(...arguments);
    //标识是prompt在messageBoxBeforeClose方法中要判断使用
    $.applyNot(alias, { isPrompt: true, cancel: { text: '取消' } });
    /**
     * 分离与输入框相关的字段别名
     * inputPlaceholder 输入框的占位符 [placeholder,empty]
     * inputType 输入框的类型 [type]
     * inputValue 输入框的初始文本 [value]
     * inputPattern 输入框的校验表达式 [pattern,regexp]
     * inputValidator [check] 输入框的校验函数。可以返回布尔值或字符串，若返回一个字符串, 则返回结果会被赋值给 inputErrorMessage
     * inputErrorMessage 校验未通过时的提示文本 [error]
     * 扩展字段
     * vtype:可以直接使用$.vtype中定义的已有验证，如email或mobile
     * name:对应value所使用的变量名，一般在query方法中要设置
     */
    const input = $.remove(options, ['check', 'name', 'vtype', 'allowEmpty', 'placeholder', 'type', 'value', 'pattern', 'validator', 'error', 'empty', 'regexp']);

    const inputValidator = value => {
        if (!input.allowEmpty && $.isEmpty(value)) {
            return '不能为空'
        }
        if ($.isString(input.vtype)) {
            if (!$.has($.vtype, input.vtype)) {
                return 'vtype中未定义' + input.vtype
            } else {
                return $.vtype[input.vtype](value) ? true : $.vtype[input.vtype + 'Msg'];
            }
        }
        if ($.isFunction(input.check)) {
            let res = input.check(value);
            return res === true ? true : res;
        }
        return true;
    }
    $.applyNot(options, {
        distinguishCancelAndClose: true,
        cancelButtonText: alias.cancel.text,
        confirmButtonText: alias.btnText || '确定',
        closeOnClickModal: alias.modal === false ? false : true,
        closeOnPressEscape: alias.esc === false ? false : true,
        inputPlaceholder: input.placeholder || input.empty || null,
        inputType: input.type || 'text',
        inputValue: input.value || null,
        inputPattern: input.pattern || input.regexp || null,
        inputValidator,
        inputErrorMessage: input.error || '输入的数据不合法!',
        //提供handler时则启用beforeClose
        beforeClose: !alias.handler ? null : (action, instance, done) => {
            messageBoxBeforeClose(action, instance, done, options, alias)
        }
    })

    MessageBox.prompt(alias.message, alias.title, options).then($.noop).catch($.noop)
}
const mask = function () {
    const defaultText = '请稍候...', length = arguments.length;
    if (length === 0) {
        mask({})
    } else if (length === 1) {
        switch ($.is(arguments[0])) {
            case 'object':
                const options = arguments[0];
                const alias = $.remove(options, ['msg', 'icon', 'delay', 'open', 'background', 'click']);

                $.applyNot(options, {
                    target: '#app',
                    text: alias.msg || defaultText,
                    spinner: alias.icon || 'el-icon-loading',
                    background: alias.background === true ? 'rgba(0, 0, 0, 0.7)' : (alias.background || 'rgba(0, 0, 0, 0.7)')
                })

                loadingInstance = Loading.service(options);
                alias.open && alias.open(loadingInstance);
                //提供一个单击事件回调，根据情况可以在前端配置click，用于解决异常时通过点击背景关闭等功能
                if (alias.click) {
                    loadingInstance.$el.onclick = function () {
                        if (alias.click === true) {
                            unmask();
                        } else {
                            alias.click(loadingInstance)
                        }
                    }
                }
                //背景颜色随机产生
                if (alias.background === true) {
                    rndBackgroupColorTimer = setInterval(() => {
                        loadingInstance.background = `rgba(${$.rnd(0, 255)}, ${$.rnd(0, 255)}, ${$.rnd(0, 255)}, 0.7)`
                    }, 2000);
                }
                if ($.isNumber(alias.delay) && alias.delay > 0) {
                    setTimeout(unmask, alias.delay * 1000);
                }
                break;
            case 'string':
                mask({ msg: arguments[0] })
                break;
            case 'boolean':
                arguments[0] === true ? mask({}) : unmask();
                break;
            case 'number':
                mask({ delay: arguments[0] });
                break;
            case 'function':
                mask({ click: arguments[0] })
                break;
            default:
                mask({})
                break;
        }
    } else if (length === 2) {
        const cfg = { msg: arguments[0] };
        const value = arguments[1], type = $.is(value);
        if (type === 'number') {
            cfg['delay'] = value;
        } else if (type === 'function') {
            cfg['click'] = value
        } else if (type === 'boolean' && value === true) {
            cfg['background'] = value;
        } else if (type === 'string') {
            cfg['msg'] = value;
        }
        mask(cfg)
    }
}
const unmask = function () {
    if (loadingInstance) {
        rndBackgroupColorTimer && clearInterval(rndBackgroupColorTimer)
        loadingInstance.close()
        loadingInstance = null
    }
}
/**
 * 对应ElementUi中的Message功能，请传入配置数据
 */
const toast = function () {
    if (arguments.length === 0) {
        console.warn('调用方法时参数不能为空')
        return;
    }
    /**
     * ElementUi原生参数信息
     * 
     * message 消息文字[string / VNode]
     * type 主题 [string] 可选值 success/warning/info/error 默认info
     * iconClass 自定义图标的类名，会覆盖 type [string]
     * dangerouslyUseHTMLString [boolean] 是否将 message 属性作为 HTML 片段处理 默认false
     * customClass [string] 自定义类名
     * duration [number] 显示时间, 毫秒。设为 0 则不会自动关闭 默认3000
     * showClose [boolean] 是否显示关闭按钮 默认false
     * center [boolean] 文字是否居中 默认false
     * onClose [function] 关闭时的回调函数, 参数为被关闭的 message 实例
     * offset [number] Message 距离窗口顶部的偏移量 默认20
     */
    const options = arguments[0];
    if ($.isObject(options) && !$.isVNode(options)) {
        const alias = $.remove(options, ['icon', 'ishtml', 'delay', 'close']);
        if (!$.has(alias, 'delay')) {
            alias['delay'] = 3;
        }
        $.applyNot(options, {
            iconClass: alias.icon || null,
            dangerouslyUseHTMLString: alias.ishtml || false,
            duration: alias.delay === 0 ? 0 : (alias.delay * 1000 || 3000),
            onClose: alias.close || $.noop
        })
        //延时关闭时，强制显示关闭按钮
        if (options.duration === 0) {
            options.showClose = true
        }
        return Message(options)
    } else {
        let config = { type: arguments[0] }, len = arguments.length;
        //仅传入一个参数，将作为message内容
        if (len === 2) {
            config['message'] = arguments[1];
            return toast(config);
        }
        //上面代码返回只传一个值和两个值的情况
        //下面代码开始3个参数，多于3个的会忽略

        config['message'] = arguments[1];//第2个值必须是message的内容 string/VNode
        let type = $.is(arguments[2]), value = arguments[2];
        //是数值时，设置延时关闭，值<100设置delay，否则设置duration，因为delay的单位是秒
        if (type === 'number') {
            if (value < 100) {
                config['delay'] = value;
            } else {
                config['duration'] = value;
            }
        } else if (type === 'boolean') {
            config['showClose'] = value;
        } else if (type === 'function') {
            config['onClose'] = value;
        }
        return toast(config);
    }
}

const success = function () {
    return toast('success', ...arguments)
}

const error = function () {
    return toast('error', ...arguments)
}

const info = function () {
    return toast('info', ...arguments)
}

const warn = function () {
    return toast('warning', ...arguments)
}
const warning = function () {
    return toast('warning', ...arguments)
}

const notice = function () {
    if (arguments.length === 0) {
        console.warn('调用方法时参数不能为空')
        return;
    }

    /**
     * ElementUi原生参数信息
     * 
     * title 标题[string]
     * message 消息文字[string / VNode]
     * type 主题 [string] 可选值 success/warning/info/error 默认info
     * iconClass 自定义图标的类名，会覆盖 type [string]
     * dangerouslyUseHTMLString [boolean] 是否将 message 属性作为 HTML 片段处理 默认false
     * customClass [string] 自定义类名
     * duration [number] 显示时间, 毫秒。设为 0 则不会自动关闭 默认3000
     * showClose [boolean] 是否显示关闭按钮 默认false
     * center [boolean] 文字是否居中 默认false
     * onClose [function] 关闭时的回调函数, 参数为被关闭的 message 实例
     * offset [number] Message 距离窗口顶部的偏移量 默认20
     * position [string] 自定义弹出位置 默认:top-right 可选 top-right/top-left/bottom-right/bottom-left
     * onClick [function] 点击 Notification 时的回调函数
     */
    const options = arguments[0];
    if ($.isObject(options) && !$.isVNode(options)) {
        const alias = $.remove(options, ['icon', 'ishtml', 'delay', 'close', 'click']);
        if (!$.has(alias, 'delay')) {
            alias['delay'] = 3;
        }
        $.applyNot(options, {
            iconClass: alias.icon || null,
            dangerouslyUseHTMLString: alias.ishtml || false,
            duration: alias.delay === 0 ? 0 : (alias.delay * 1000 || 3000),
            onClose: alias.close || $.noop,
            onClick: alias.click || $.noop
        })
        //延时关闭时，强制显示关闭按钮
        if (options.duration === 0) {
            options.showClose = true
        }
        return Notification(options)
    } else {
        let config = { type: arguments[0] }, len = arguments.length;
        //仅传入一个参数，将作为message内容
        if (len === 2) {
            if ($.isObject(arguments[1]) && !$.isVNode(arguments[1])) {
                $.apply(config, arguments[1])
            } else {
                config['message'] = arguments[1];
            }
            return notice(config);
        }
        //上面代码返回只传两个值的情况
        //下面代码开始3个参数
        else if (len === 3 || len === 4) {
            config['message'] = arguments[1];//第2个值必须是message的内容 string/VNode
            if (len === 4) {
                config['title'] = arguments[2]
            }
            let value = len === 3 ? arguments[2] : arguments[3];
            let type = $.is(value);
            //是数值时，设置延时关闭，值<100设置delay，否则设置duration，因为delay的单位是秒
            if (type === 'number') {
                if (value < 100) {
                    config['delay'] = value;
                } else {
                    config['duration'] = value;
                }
            } else if (type === 'boolean') {
                config['showClose'] = value;
            } else if (type === 'function') {
                config['onClose'] = value;
            } else if (type === 'string') {
                config['title'] = value;
            }
        }
        return notice(config);
    }
}
notice.success = function () {
    notice('success', ...arguments)
}
notice.warn = function () {
    notice('warning', ...arguments)
}
notice.warning = function () {
    notice('warning', ...arguments)
}
notice.info = function () {
    notice('info', ...arguments)
}
notice.error = function () {
    notice('error', ...arguments)
}
notice.closeAll = function () {
    Notification.closeAll();
}
toast.closeAll = function () {
    Message.closeAll();
}
$.apply(toast, {
    success, error, info, warning, warn
})


const dialog = function (options) {
    const propsData = $.slice(options, ['on'], false);
    const { on = {}} = options;
    propsData['on'] = {
        ...on,
        input: value => {
            instance.visible = value
        }
    }
    
    const instance = new DialogConstructor({
        el: document.createElement('div'),
        propsData
    });
    
    document.body.appendChild(instance.$el);
    Vue.nextTick(() => {
        instance.visible = true;
    });
}

export default {
    alert, confirm, prompt, mask, unmask, toast, success, error, info, warn, warning, dialog, notice
}
export {
    alert, confirm, prompt, mask, unmask, toast, success, error, info, warn, warning, dialog, notice
}
