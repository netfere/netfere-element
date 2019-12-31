<style scoped>
</style>

<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-button @click="open">{{webSocketConnected?'关闭连接':'打开连接'}}</el-button>
      </el-col>
      <el-col :span="7">
        <el-button :disabled="!webSocketConnected" @click="send()">通过侦听方式交互</el-button>
        <br />
        {{result1}}
      </el-col>
      <el-col :span="7">
        <el-button :disabled="!webSocketConnected" @click="send(true)">通过回调方式交互</el-button>
        <br />
        {{result2}}
      </el-col>
      <el-col :span="7">
        <el-button :disabled="!webSocketConnected" @click="time">{{isTime?'关闭服务端推送时间':'服务端每秒推送一次时间'}}</el-button>
        <br />{{result3}}
      </el-col>
    </el-row>
    <h2>使用方法</h2>
    <pre>
          一、在main.js中做如下操作:
          1.引用 import VueSocketio,{sockets} from 'netfere-element/packages/websocket';
          2.初始化VueSocketio
            Vue.use(VueSocketio, {
                debug: false,
                connection: "http://localhost:8360",
                options: { path: '/socket.io', autoConnect: false } //如果要自动连接可以将autoConnect=true或不设置
            });
          3.在类似以下的代码中加入sockets
            new Vue({
                router,
                store,
                <span
  style="color:red;"
>sockets,</span>
                render: h => h(App)
            }).$mount('#app')
          二、在需要使用WebSocket的其他vue文件中添加sockets:{event:function}结构，在sockets中的项目即侦听服务端emit(event)的响应
          三、如果你在vue中启用了vuex，则会自动在store.state中添加webSocketConnected字段，值为true表示已连接，为false为未连接。
      </pre>
    <h2>与服务端的交互</h2>
    <pre>
          1. this.$socket.emit(event:string,data?:any,ask?:void)
            event:对应服务端侦听的名称
            data:(可选)提交给服务端的数据
            ask:(可选)提交后由服务端回调的方法
          2. 在服务端要接收并处理event所指示的事件，如果服务端需要将结果或数据返回给客户端，有两种方式：
            (1)在vue文件中配置sockets:{event:function}，在服务端通过emit(event,data)调用；
            <span
  style="color:red;"
>注意如果此时其他vue页面也配置了同名event，在服务端emit后都会收到响应</span>
            (2)直接在客户调用this.$socket.emit时，将第3个参数配置为一个方法，然后在服务端回调此方法
          3. this.$send(event:string,data?:any,ask?:void)
            此方法实质是调用this.$socket.emit('emit',{event,data},ask)。
            此封装的目的是为了方便服务端统一在emit为事件名的方法中通过判断wsData.event来进行处理。
            如果配合netfere-thinkjs一起使用，则netfere-thinkjs中已封装对this.$send的处理。详见netfere-thinkjs中的websocket说明
      </pre>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      result1: "",
      result2: "",
      isTime: false,
      result3:'',
      klineData:null
    };
  },
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
  computed: {
    ...mapState({
      webSocketConnected: o => o.webSocketConnected
    }),
    ...mapGetters([])
  },
  sockets: {
    listener(res) {
      this.result1 = JSON.stringify(res);
    },
    time(value){
        this.result3=this.$.date(value).toString();
        this.isTime=true;
    },
    kline(res){
        this.klineData=JSON.stringify(res);
    }
  },
  methods: {
    open() {
      if (this.webSocketConnected) {
        this.$socket.close();
      } else {
        this.$socket.open();
      }
    },
    send(cb) {
      if (cb) {
        this.$.confirm({
          message: "确认提交数据吗？",
          handler: done => {
            this.$send("listener", { id: "12345" }, res => {
              this.result2 = JSON.stringify(res);
              done();
            });
            return true;
          }
        });
      } else {
        this.$send("listener", { id: "12345" });
      }
    },
    time() {
      this.$send("time", !this.isTime);
      this.isTime = !this.isTime;
    }
  }
};
</script>