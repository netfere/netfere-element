import VueSocketio from 'vue-socket.io';
/**
 * 可用选项：
path : 服务器端捕获的路径名称
reconnection： 是否自动重新连接
reconnectionAttempts: 重试连接次数，默认infinity
reconnectionDelay: 进行下一次重连的间隔。受randomizationFactor的影响 +/-上下限，randomizationFactor默认0.5 ，reconnectionDelay默认1000
reconnectionDelayMax： 重新连接等待的最长时间
timeout: 在触发connect_error 或 connect_timeout之前的超时时间
autoConnect: 是否自动连接。设置为false时，需要调用manager.open来
query: 连接命名空间对象时发送的参数。在服务端调用socket.handshake.query来获取
parser: 解析器。默认为socket.io附带的parse实例。socket.io-parser
 */

export default function install(Vue, opts) {
    Vue.use(new VueSocketio(opts));
    Vue.$send = Vue.prototype.$send = (event, data, callback) => {
        if (Vue.prototype.$socket) {
            if (typeof data === 'function') {
                [data, callback] = [null, data];
            }
            Vue.prototype.$socket.emit('emit', { event, data }, callback);
        }
    }
}
const updateState = (self, state) => {
    if (self.$store) {
        if (!Object.prototype.hasOwnProperty.call(self.$store.state, 'webSocketConnected')) {
            self.$set(self.$store.state, 'webSocketConnected', state);
        } else {
            self.$store.state.webSocketConnected = state;
        }
    }
}
export const sockets = {
    connect() {
        updateState(this, true);
    },
    disconnect() {
        updateState(this, false);
    },
    connect_error(err) { },
    connect_timeout() { },
    ping() { },
    pong(val) { },
    connecting() { },
    error() { },
    reconnect() { },
    reconnect_attempt() { },
    reconnect_error() { },
    reconnect_failed() { },
    reconnecting() { },
    dohread() { }
}