import { $, AxiosClass } from './utils';

import Box from './modal';
let instance, startStamp = 0, currStamp = 0, delayMasker = null;
/**
 * axios请后Promise.then和Promise.catch中调用处理
 * @param {Boolean} success true表示从Promise.then中调用 false表示从catch中调用
 * @param {*} res 请求后返回的数据
 * @param {Function} done 如果success=true时为ok方法，success=false时为err方法
 * @param {*} mask 配置中传入的mask值，可能为[string|boolean|function|object]。
 * @param {Function} complete 完成后响应，该响应将在ok或err之后调用
 */
const _complete = function ({ success, res, done, mask, complete }) {
    currStamp = new Date().getTime();
    if (delayMasker) {
        clearInterval(delayMasker)
    }
    //先处理mask 此处只是关闭mask
    //mask为function时，接受一个参数Boolean，由前端调用处使用
    if ($.isFunction(mask)) {
        mask(false)
    } else if ($.notEmpty(mask)) {
        Box.unmask()
    }
    if (success) {
        done ? done(res) : console.warn('query请求完成，但没有提供ok方法进行处理结果')
    } else {
        //此时done为err方法，没有提供时，默认提示res.msg信息
        done ? done(res) : (res.msg ? Box.error(res.msg) : $.noop())
    }
    complete && complete(res)
}
/**
 * 开启遮罩效果
 * @param {*} mask 配置中传入的mask值，可能为[string|boolean|function|object]
 */
const _mask = function (mask) {
    //开始请求毫秒时间
    startStamp = new Date().getTime();
    //延时50毫秒开始遮罩
    delayMasker = setInterval(() => {
        if (currStamp - startStamp > 100) {
            clearInterval(delayMasker)
            if ($.isFunction(mask)) {
                mask(true);//由前端配置的方法处理
            } else if (!$.is(mask, ['null', 'undefined'])) {
                Box.mask(mask)
            }
        } else {
            currStamp = new Date().getTime();
        }
    }, 50);

}
/**
 * 当query配置中有confirm配置时，直接调用，先确认再请求
 * @param {*} options 
 * @param {*} param1 
 */
const _confirm = function (options, { confirm, ok, err, complete }) {
    let cfg = {}
    if ($.isString(confirm) || $.isVNode(confirm)) {
        cfg['message'] = confirm
    } else if ($.isObject(confirm)) {
        $.apply(cfg, confirm)
    } else {
        $.alert('confirm配置参数异常', '参数错误', 'error');
        return;
    }
    cfg['handler'] = function (done, instance) {
        //以下用到的err,ok,complete均是前端配置在query的中项目
        query({
            ...options,
            err: !err ? null : res => {
                err && err(res)
            },
            ok: res => {
                ok && ok(res)
            },
            complete: res => {
                if (!complete || !complete(res, done, instance)) {
                    done()
                }
            }
        });
        return true;
    }
    Box.confirm(cfg)
}

const _prompt = function (options, { prompt, ok, err, complete }) {
    //在prompt中要配置name用于value的变量名
    const { name } = $.remove(prompt, 'name');
    if ($.isEmpty(name)) {
        Box.alert('prompt的配置中需要提供name值，用于指示填空内容的变量名称', '参数错误', 'error');
        return
    }
    let cfg = {}
    if ($.isString(prompt) || $.isVNode(prompt)) {
        cfg['message'] = prompt
    } else if ($.isObject(prompt)) {
        $.apply(cfg, prompt)
    } else {
        Box.alert('confirm配置参数异常', '参数错误', 'error');
        return;
    }
    cfg['handler'] = function (value, done, instance) {
        if (options.data) {
            options.data[name] = value;
        } else if (options.params) {
            options.params[name] = value;
        } else {
            options.url = options.url + (options.url.indexOf('?') > -1 ? '&' : '?') + `${name}=${value}`
        }
        //以下用到的err,ok,complete均是前端配置在query的中项目
        query({
            ...options,
            err: !err ? null : res => {
                err && err(res, instance.inputValue)
            },
            ok: res => {
                ok && ok(res, instance.inputValue)
            },
            complete: res => {
                if (!complete || !complete(res, done, instance)) {
                    done()
                }
            }
        });
        return true;
    }
    Box.prompt(cfg)
}

const query = function (options) {
    if ($.isEmpty(options.url)) {
        Box.warn('没有配置url选项，该值不能为空');
        return Promise.reject({});
    }

    const alias = $.remove(options, ['mask', 'confirm', 'prompt', 'ok', 'err', 'complete', 'isPromise']);
    //如果存在确认方式，则先调用confirm后，再提交。并提前返回
    if (alias.confirm) {
        _confirm(options, alias);
        return;
    } else if (alias.prompt) {
        _prompt(options, alias);
        return;
    }
    //mask可能是string、true、object、function
    _mask(alias.mask);

    //当get和post请求时，isPromise=true，此时直接返回Promise，由调用处自行处理
    if (alias.isPromise) {
        return instance(options)
    } else {
        const data = { mask: alias.mask, complete: alias.complete }
        instance(options)
            .then(res => _complete({ success: true, done: alias.ok, res, ...data }))
            .catch(res => _complete({ success: false, done: alias.err, res, ...data }))
    }
}
//返回Promise
const get = function (url, params) {
    return query({ type: 'get', url, params, isPromise: true })
}
//返回Promise
const post = function (url, data, params) {
    return query({ type: 'post', url, params, data, isPromise: true })
}

const vueAxiosInit = function (opts = {}) {
    const { defaults = {}, request = {}, response = {} } = opts;
    instance = new AxiosClass({ ...defaults, interceptor: { request, response } });
}
export default { vueAxiosInit, query, get, post }

export { vueAxiosInit, query, get, post }


