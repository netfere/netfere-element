import VueSocketio from 'vue-socket.io';
export default function install(Vue,opts){
    Vue.use(new VueSocketio(opts));
}