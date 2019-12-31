<style lang="scss" scoped>
.detail {
  padding: 5px 20px;
}
.code {
  background-color: dimgray;
  color: #fff;
  overflow: auto;
  span {
    color: yellow;
    font-weight: bold;
  }
}
</style>

<template>
  <div>
    <h2>.axios</h2>
    <div class="detail">
      工具库中默认引入axios.js作为数据请求。该方法的使用
      <a href="http://www.axios-js.com/zh-cn/docs/" target="_blank">详见axios.js帮助</a>
    </div>
    <h3>在NetfereElement的框架下，对axios.js进行了二次封装。结合了ElementUi中的Loading、MessageBox等与服务器通信过程中常用到的二次确认或加载状态；同时结合服务器数据响应做了比原生更便捷的写法，减少代码量。</h3>核心工具库中只有Axios方法，在NetfereElement中对Axios进行了封次，新增query、get、post三个方法，因此这三个方法只能在引用了NetfereElement扩展的情况下才能使用。
    <el-row :gutter="15">
      <el-col :span="12">
        <nf-card style="margin-bottom:10px" v-for="(item,i) in demos.filter((a,idx)=>idx%2===0)" :key="i" :header="item.title" :bodyStyle="bodyStyle">
          <el-button type="primary" slot="action" @click="item.handler">演示</el-button>
          <pre class="code" v-html="item.code"></pre>
          <div v-if="item.other" v-html="item.other"></div>
        </nf-card>
      </el-col>
      <el-col :span="12">
        <nf-card style="margin-bottom:10px" v-for="(item,i) in demos.filter((a,idx)=>idx%2===1)" :key="i" :header="item.title" :bodyStyle="bodyStyle">
          <el-button type="primary" slot="action" @click="item.handler">演示</el-button>
          <pre class="code" v-html="item.code"></pre>
          <div v-if="item.other" v-html="item.other"></div>
        </nf-card>
      </el-col>
    </el-row>
    <div class="detail">
      <h4>如何开启axios.js的二次封装？</h4>
      在引入NetfereElement的位置，使用Vue.use(NetfereElement,{})的位置中，在配置中加入{axios:{}}，即会新增三个封装过的方法：query,get,post；
      <br />
      <h5>axios={}配置说明</h5>
      <pre class="code">
{
  //配置全局默认配置，如超时时间等，有效内容请参考axios.js的配置选项。
  //另外扩展了两个选项：
  //returnFalseAuto:[boolean=true] 在使用内置拦截器的情况下将服务器返回数据中包含{success:false}的数据直接转入reject处理
  //format:function(data) 对服务器响应数据进行自定义的格式化处理。该字段生效要求是response启用内置拦截器
  <span>defaults</span>: {},
  //请求拦截器
  //1.不配置此项，则拦截器不生效。可以通过axios.interceptors.request.use进行原生设置
  //2.此值为数组时，可以提供一个或两个方法，分别对应拦截器中的config、error拦截
  //3.此值为object时，将启用扩展内置拦截器。此时可以配置{req:拦截config,err:拦截error},则先调用内置后，再调用配置
  //4.此值为function时，将转换为第3点处理，此时这个方法为第3点中的req
  <span>request</span> {
    req(config) {
      config['headers']['x-access-token'] = '';//可以配置token
      if (!config.params) {
        config.params = {}
      }
      config.params['_t'] = new Date().getTime();//可以为每次请求添加一个时间
      return config;//必须要返回
    }
  },
  //响应拦截器 启用内置拦截器时，服务器返回数据一般为json格式，一般以{success:true|false,msg:String,data:any}返回或者在format中自行格式化
  //1.此值不设置则拦截器不发生作用。可以通过axios.interceptors.response.use进行原生设置
  //2.此值为数组时，可以提供一个或两个方法，分别对应拦截器中的response、error拦截
  //3.此值为object时，将启用扩展内置拦截器。此时可以配置{res:拦截response,err:拦截error},则先调用内置后，再调用配置
  //4.此值为function时，将转换为第3点处理，此时这个方法为第3点中的res
  <span>response</span> {}
}
      </pre>
    </div>
    <h2>.query(options)</h2>
    <div class="detail">
      使用query方法，与axios原生调用的区别在于：1、不返回Promise，需要配置回调方法；2、新增mask/confirm/prompt/ok/err/complete配置选项；
      <br />
      <pre class="code">
query({
  url:'...',
  data:{},
  //请求时将启用遮罩层,默认提示『请稍候...』，如果mask:string，则在遮罩层上显示指定的提示文本；更多的配置详见『扩展组件->弹窗消息』中的mask
  //此mask还可以配置为一个方法function(loading:boolean) 当loading=true时表示正在请求中,loading=false时表示请求完成。交互响应可以在此方法中根据loading来自定义
  mask:true,
  //开启请求前的二次确认。除直接设置提示文本外，还可以配置object，具体配置参考『扩展组件->弹窗消息』中的confirm
  //使用object配置时，不需要配置handler选项，此选项会在封装方法重写；
  confirm:'确认要提交保存吗？',
  //提交前弹窗输入一个值，有效配置请参考『扩展组件->弹窗消息』中的prompt，handler不需配置，但需额外新增name字段，作为输入值的变量名
  prompt:{name:'msg'},
  //在服务器响应数据中或通过拦截器格式化数据中用success=true时，会回调err方法
  ok:(res)=>{},
  //在服务器响应数据中或通过拦截器格式化数据中用success=false时，会回调err方法，其他异常(如:服务器错误，通讯失败等)也会调用err
  err:(res)=>{},
  //请求完成后回调此方法，该方法在ok或err之后调用。接收三个参数：
  //res:响应或失败的数据 done:当存在confirm或propmpt的弹窗时，可以用done()来关闭 instance:弹窗实例
  complete:(res,done,instance)=>{}
})<br />
<span>注意:mask、confirm、prompt这三个配置在一次请求中只能选用一项！<br />结合实际的使用场景，补充说明：</span>
//在启用confirm进行二次确认时，点击提交后，需要保持窗口并且不可操作，直到提交完成后再关闭或保留。
query({
  url:'...',
  data:{},
  confirm:{
    btnText:'删除',//配置按钮文本
    message:'确认要删除用户吗？',//提示文本
  },
  ok:res=>{
    //获得响应数据后，根据业务逻辑自行处理
  },
  //err:res=>{},//如果错误数据返回中有{msg:string}，则err可以不配置，会直接提示msg内容
  complete:(res,done)=>{
    done();//直接关闭提示框;
    //done(false,'删除失败了',5);//保留提示框，并提示指定文本，提示内容在指定秒数后消息；默认是2s，可不写；
    //done(true,'删除完成');//关闭提示框并提示指定文本
    <span>return true;</span>//此处必须有一个返回true，否则在点击按钮后，提示框会直接关闭
  }
})
      </pre>
    </div>
    <h2>.get(url,params)</h2>
    <div class="detail">
      参数：url:请求地地址；params:请求参数，格式为{}，将附加在url后提交
      <br />此方法返回Promise
    </div>
    <h2>.post(url,data,[params])</h2>
    <div class="detail">
      参数：url:请求地地址；data:将以post方式提交，格式为{}；params:(可选)请求参数，格式为{}，将附加在url后提交
      <br />此方法返回Promise
    </div>
  </div>
</template>

<script>
const apiUrl = "/v1/common/symbols";
export default {
  components: {},
  data() {
    return {
      bodyStyle: { padding: 0 },
      demos: [
        {
          title: "默认遮罩效果请求",
          handler: () => {
            this.demoMask(true);
          },
          code: `query({
  url: "${apiUrl}",
  mask:true,
  ok: res => {
    $.success(\`共获得\${res.data.length}条记录\`);
  }
});`
        },
        {
          title: "自定义遮罩提示请求",
          handler: () => {
            this.demoMask("马上就好...");
          },
          code: `query({
  url: "${apiUrl}",
  mask:"马上就好...",
  ok: res => {
    $.success(\`共获得\${res.data.length}条记录\`);
  }
});`
        },
        {
          title: "更多效果的遮罩请求",
          handler: () => {
            this.demoMask({ background: true });
          },
          code: `query({
  url: "${apiUrl}",
  //更多配置请参考『扩展组件->弹窗消息』中的mask说明
  mask:{background:true},//随机变换背景颜色
  ok: res => {
    $.success(\`共获得\${res.data.length}条记录\`);
  }
});`
        },
        {
          title: "自定义请求状态交互",
          handler: () => {
            this.demoMask(ing =>
              ing ? $.info("正在请求中...") : $.warn("请求结束")
            );
          },
          code: `query({
  url: "${apiUrl}",
  //一个接收状态的方法
  mask:ing=>{
    if(ing){
      $.info('正在请求中...')
    }else{
      $.warn('请求结束')
    }
  },
  ok: res => {
    $.alert(\`共获得\${res.data.length}条记录\`);
  }
});`
        },
        {
          title: "自定义二次确认信息的请求",
          handler: () => {
            $.query({
              url: apiUrl,
              format: this.format,
              confirm: {
                title: "请求提示",
                message: "真的要向服务器请求数据吗？",
                btnText: "要",
                cancel: "不要",
                loadText: "努力中..."
              },
              ok: res => {
                $.success(`共获得${res.data.length}条记录`);
              }
            });
          },
          code: `query({
  url: "${apiUrl}",
  //更多配置请参考『扩展组件->弹窗消息』中的confirm说明
  confirm:{
    title:'请求提示',
    message:'真的要向服务器请求数据吗？',
    btnText:'要',
    cancel:'不要',
    loadText:'努力中...'
  },
  ok: res => {
    $.success(\`共获得\${res.data.length}条记录\`);
  }
});`
        },
        {
          title: "带二次确认效果的请求",
          handler: () => {
            $.query({
              url: apiUrl,
              format: this.format,
              confirm: "这是一个带二次确认效果的请求",
              ok: res => {
                $.success(`共获得${res.data.length}条记录`);
              },
              err: res => {
                $.error(res.msg || "未知错误");
              }
            });
          },
          code: `query({
  url: "${apiUrl}",
  confirm:'这是一个带二次确认效果的请求',
  ok: res => {
    $.success(\`共获得\${res.data.length}条记录\`);
  },
  //要自定义提示错误的情况下可以使用err，否则封装中已自行处理
  err:res=>{
    $.error(res.msg || '未知错误')
  }
});`
        },
        {
          title: "自行控制二次提示框的请求",
          handler: () => {
            $.query({
              url: apiUrl,
              confirm:
                "请求过程中会处于引导状态，请求完成后要自行控制提示框的演示",
              complete: (res, done, instance) => {
                done(false, "请求结束，但提示框保留，可以手动关闭");
                return true;
              }
            });
          },
          code: `query({
  url:"${apiUrl}",
  confirm:'请求过程中会处于引导状态，请求完成后要自行控制提示框的演示',
  complete:(res,done,instance)=>{
    //res是返回数据，根据实际情况判断并处理
    //done是控制提示的方法，done(state,msg,delay):state=true则关闭，=false则保留,msg:是一个提示信息,delay是延时取消提示信息，单位秒
    //  多种写法：done()=done(true)、done(false,msg):保留并显示msg,2秒后msg消息、done(false,msg,5) 保留关显示msg，5秒后提示消息
    //instance是提示框实例
    done(false,'请求结束，但提示框保留，可以手动关闭')
    return true;//在complete中返回true，可以阻止提示框自行关闭
  }
})`
        },{
          title:'带输入框的提交',
          handler:()=>{
            $.query({
              url:apiUrl,
              format:this.format,
              prompt:{name:'email',message:'输入电子邮件',title:'提交前必须',vtype:'email'},
              ok:(res,inputValue)=>{
                $.success(`请求完成，输入的值是${inputValue}`)
              }
            })
          },
          code:`$.query({
  url:${apiUrl},
  //必须配置name作为输入值的变量名，其他更多配置参考『扩展组件->弹窗消息』中的prompt说明
  prompt:{name:'email',message:'输入电子邮件',title:'提交前必须',vtype:'email'},
  ok:(res,inputValue)=>{
    //inputValue 是输入的值
    $.success(\`请求完成，输入的值是\${inputValue}\`)
  }
})`
        }
      ]
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    format(res) {
      if (res.status === "ok") {
        return { success: true, msg: "ok", data: res.data };
      } else {
        return { success: false, msg: "数据格式不正确" };
      }
    },
    demoMask(mask) {
      $.query({
        url: apiUrl,
        mask,
        format: this.format,
        ok: res => {
          if ($.isFunction(mask)) {
            $.alert(`共获得${res.data.length}条记录`);
          } else {
            $.success(`共获得${res.data.length}条记录`);
          }
        }
      });
    }
  }
};
</script>