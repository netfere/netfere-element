<style lang="scss" scoped>
.content {
  padding-left: 20px;
}
</style>

<template>
  <div>
    <el-collapse>
      <el-collapse-item title=".alert(options)">
        <div class="content">
          对MessageBox.alert进了封装。与Message.alert的用法类似，但又有不同。
          <div>
            <el-button type="text" @click="$.alert('这是一个最简普通提示框')">最简普通提示框</el-button>
            <el-button type="text" @click="alert1">有响应的提示框</el-button>
          </div>
          <pre>
                .alert('这是一个最简普通提示框');
                //有响应的使用代码示例
                .alert({
                    message:'点击确定按钮后，有其他响应操作',
                    handler:(done,instance)=>{
                        $.success('您点击了『确定』')
                    },
                    //必须在有handler的情况下close才生效
                    close:(done,instance)=>{
                        $.success('关闭提示框')
                    }
                })
          </pre>配置项:handler:function(done,instance) - 在点击确定后，将回调此方法，参数done用于关闭提示框，instance是提示框实例
          <br />配置项:close:function(done,instance) - 在点击右上角 x 及背景或按下esc键时，关掉提示框的回调，参数同handler。
          <br />参数变形
          <br />
          .alert(message:string) 等价于 .alert({message})
          <br />
          .alert(message:string,:string) 等价于 .alert{message,title}
          <br />
          .alert(message:string,:function) 等价于 .alert{message,handler}
          <br />
          .alert(message:string,title:string,:string) 等价于 .alert({message,title,type})
          <br />
          .alert(message:string,title:string,:function) 等价于 .alert({message,title,handler})
          <br />其他更多配置选项，请参考
          <a href="https://element.eleme.cn/#/zh-CN/component/message-box" target="_blank">ElementUi MessageBox</a>的说明
        </div>
      </el-collapse-item>
      <el-collapse-item title=".confirm(options)">
        <div class="content">
          对MessageBox.confirm进了封装。与Message.confirm的用法类似，但又有不同。
          <div>
            <el-button type="text" @click="$.confirm('这是二次确认的提示文本内容',()=>{$.success('点击了确认')})">最简用法</el-button>
            <el-button type="text" @click="confirm1">更复杂二次确认框</el-button>
          </div>
          <pre>
                .confirm('这是二次确认的提示文本内容',(done,instance)=>{$.success('点击了确认')});
                //更复杂的代码示例
                .confirm({
                    title:'确认要删除吗？',
                    message:'用户删除后将无法恢复。请谨慎操作！',
                    btnText:'删除',
                    cancel:{text:'放弃',handler:()=>{$.warn('您放弃了操作')}},
                    handler:(done,instance)=>{
                        $.success('您点击了『删除』按钮')
                    },
                    close:()=>{
                        $.info('这是通过点击右上角x或背景或esc键关闭窗口')
                    }
                })
          </pre>配置项:handler:function(done,instance) - 在点击确定后，将回调此方法，参数done用于关闭提示框，instance是提示框实例
          <br />
          cancel:(string|function|object) - 对取消按钮的配置，如果仅为string时，则为取消按钮显示文本，仅为function时则是点击取消的响应。或者为{text,handler}则同时配置取消按钮显示文本和响应
          <br />配置项:close:function(done,instance) - 在点击右上角 x 及背景或按下esc键时，关掉提示框的回调，参数同handler。
          <br />参数变形 与.alert相同
          <br />其他更多配置选项，请参考
          <a href="https://element.eleme.cn/#/zh-CN/component/message-box" target="_blank">ElementUi MessageBox</a>的说明
        </div>
      </el-collapse-item>
      <el-collapse-item title=".prompt(options)">
        <div class="content">
          对MessageBox.prompt进了封装。与Message.prompt的用法类似，但又有不同。
          <div>
            <el-button type="text" @click="$.prompt('请输入一个内容',(value)=>{$.success(`您刚才输入的是${value}`)})">最简用法</el-button>
            <el-button type="text" @click="prompt1">更复杂输入框</el-button>
          </div>
          <pre>
                $.prompt('请输入一个内容',(value)=>{$.success(\`您刚才输入的是\${value}\`)});
                //更复杂的代码示例
                .prompt({
                    title:'填写信息',
                    message:'请输入一个邮箱',
                    vtype:'email',
                    handler:(value,done)=>{
                        $.success(\`您的邮箱是：\${value}，将模拟提交失败效果...\`);
                        setTimeout(() => {
                            done(false,'提交失败了！')
                        }, 5000);
                        return true;
                    },
                    cancel:done=>{
                        $.info('您点击了取消，3s后将关闭窗口');
                        setTimeout(done, 3000);
                        return true;
                    }
                })
          </pre>配置项:handler:function(value,done,instance) - 在点击确定后，将回调此方法，参数value为输入的值；参数done用于关闭提示框；instance是提示框实例
          <br />
          cancel:(string|function|object) - 对取消按钮的配置，如果仅为string时，则为取消按钮显示文本，仅为function时则是点击取消的响应。或者为{text,handler}则同时配置取消按钮显示文本和响应
          <br />配置项:close:function(done,instance) - 在点击右上角 x 及背景或按下esc键时，关掉提示框的回调，参数同handler。
          <br />参数变形 与.alert相同
          <br />其他更多配置选项，请参考
          <a href="https://element.eleme.cn/#/zh-CN/component/message-box" target="_blank">ElementUi MessageBox</a>的说明
          <br />与输入项设置有关的配置说明如下：
          <ul>
            <li>
              类型设置 - type均可设置类型，默认为text，允许取值number/textarea。
              <span style="color:red">如果您直接配置inputType则本例无效</span>
            </li>
            <li>
              占位符 - placeholder或empty均可设置，无默认值。
              <span style="color:red">如果您直接配置inputPlaceholder则本例无效</span>
            </li>
            <li>
              初始文本 - value可以设置
              <span style="color:red">如果您直接配置inputValue则本例无效</span>
            </li>
            <li>
              检测末通过时的提示文本 - error 默认为:输入的数据不合法!
              <span style="color:red">如果您直接配置inputErrorMessage则本例无效</span>
            </li>
            <li>
              检测相关配置项有 - allowEmpty、pattern、regexp、vtype、check
              <br />allowEmpty - 是否允许输入框内容为空，默认false
              <br />pattern、regexp都是设置一个正则表达式，二选一即可，此表达式将用于验证输入值。
              <span style="color:red">如果您直接配置inputPattern则本例无效</span>
              <br />vtype为内置的正则表达式验证，如vtype='email'将验证邮件，关于vtype的具体说明参考『工具库->常用函数』中的vtype
              <br />check可以配置成一个检测方法，接收参数是输入值，需返回true或错误提示文本
              <br />
              <span style="color:red">如果您直接配置inputValidator则上述allowEmpty、vtype、check均无效</span>
            </li>
          </ul>
        </div>
      </el-collapse-item>
      <el-collapse-item title=".alert、.confirm、.prompt 的一些情况说明">
        <div class="content">
          此三个方法均扩展自ElementUi MessageBox中，所以原生中的配置项目一般均支持，但这三个方法是针对特定情形使用的。所以在使用过程中需要统一遵循以下要求：
          <br />一、不建议配置：distinguishCancelAndClose、beforeClose、callback；因为此三项已在封装时用固定写法代替。如强行使用可能出现意想不到的结果；
          <br />二、关于handler、close、cancel配置
          <br />1、handler是一个回调方法，在点击『确定』时回调，『确定』按钮的显示文本可能通过btnText或confirmButtonText来设定；
          <br />
          2、cancel是在点击『取消』时回调，标准数据格式是{text:'取消按钮文本',handler:function}，其中cancel.handler为回调方法；变形写法是当cancel=string时，则只设置按钮文本,cancel=function时，只为回调方法
          <br />3、close是关闭窗口的回调方法。在点击窗口右上解x、按下ESC键、点击背景时回调。这三种情况是否可用，分别由showClose、closeOnPressEscape、closeOnClickModal控制
          <br />4、在.alert方法中，cancel配置无效；
          <br />5、close的生效有一个前提条件，就是必须配置了handler;
          <br />6、handler、cancel、close这三个方法均接收两个参数done和instance。需注意的是在.prompt中handler的第一个参数为value(输入值);
          <br />7、在一些情况下需要控制弹出窗口显示与关闭，此时可以根据需要在上述三个方法中通过return true的写法，让封装的函数不自动关闭窗口，然后自己通过done来控制；在.prompt示例中有这个演示；
          <br />8、关于done的使用方法。该方法的调用有三个参数 done(boolean,string,number)
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第一个参数为true时，将关闭窗口，为false时将保持窗口；
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二个参数是一个提示文本，将以.info的方式显示；
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第三个参数是控制第二个参数文本显示的秒数；
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支持一些变形写法 done()=done(true) 此时直接关闭，也无提示;done(string)=done(false,string) 保持窗口并提示信息，默认2秒消息提示内容
          <br />9、当.confirm、.prompt在.query方法中使用时(详见Axios请求)，不需要配置handler这个项目；
        </div>
      </el-collapse-item>
      <el-collapse-item title=".toast(options)">
        <div>
          <el-button @click="$.success('这是type=success的消息提示')">success</el-button>
          <el-button @click="$.warn('这是type=warning的消息提示')">warning</el-button>
          <el-button @click="$.info('这是type=info的消息提示')">info</el-button>
          <el-button @click="$.error('这是type=error的消息提示')">error</el-button>
        </div>
        <div class="content">
          .toast方法是对ElementUi Message的封装，支持原生数据配置。包括以下配置项目
          <pre>
              {
                  message:(string|VNode),//消息内容
                  type:[string='info'],//显示主题，可选项success/warning/info/error
                  iconClass:[string],//自定义图标的类名 可简写为 icon
                  dangerouslyUseHTMLString:[boolean=false],//将message内容作为html输出，可简写为ishtml
                  customClass:[string],//自定义类名
                  duration:[number=3000],//显示时间, 毫秒。设为 0 则不会自动关闭 可简写为delay,此时单位是秒
                  showClose:[boolean=false],//是否显示关闭按钮
                  center:[boolean=false],//文字是否居中
                  onClose:[function],//关闭时的回调函数, 参数为被关闭的 message 实例，可简写为close
                  offset:[number=20]//Message 距离窗口顶部的偏移量
              }
          </pre>调用.toast时，参数的变形支持有：
          <ul>
            <li>.toast(type:string,message:string)等价于.toast({type,message})</li>
            <li>.toast(type:string,message:string,delay:number),delay&lt;100时等价于.toast({type,message,delay})</li>
            <li>.toast(type:string,message:string,duration:number),delay&gt;100时等价于.toast({type,message,duration})</li>
            <li>.toast(type:string,message:string,showClose:boolean),等价于.toast({type,message,showClose})</li>
            <li>.toast(type:string,message:string,onClose:function),等价于.toast({type,message,onClose})</li>
          </ul>在.toast变形写法的基础上，扩展了.success、.warn、.info、.error，分别对应toast中type=success,warning,info,error；
          <br />使用这些简写方法时，不需要传递type值，即在.toast变形用法的参数中减少第一个，其他类似；
        </div>
      </el-collapse-item>
      <el-collapse-item title=".notice(options)">
        <div>
          <el-button @click="$.notice.success('这是type=success的消息提示')">success</el-button>
          <el-button @click="$.notice.warn('这是type=warning的消息提示')">warning</el-button>
          <el-button @click="$.notice.info('这是type=info的消息提示')">info</el-button>
          <el-button @click="$.notice.error('这是type=error的消息提示')">error</el-button>
        </div>
        <div class="content">
          .notice方法是对ElementUi Notification的封装，支持原生数据配置。包括以下配置项目
          <pre>
              {
                  title:[string],//标题
                  message:(string|VNode),//消息内容
                  type:[string='info'],//显示主题，可选项success/warning/info/error
                  iconClass:[string],//自定义图标的类名 可简写为 icon
                  dangerouslyUseHTMLString:[boolean=false],//将message内容作为html输出，可简写为ishtml
                  customClass:[string],//自定义类名
                  duration:[number=3000],//显示时间, 毫秒。设为 0 则不会自动关闭 可简写为delay,此时单位是秒
                  showClose:[boolean=false],//是否显示关闭按钮
                  center:[boolean=false],//文字是否居中
                  onClose:[function],//关闭时的回调函数, 参数为被关闭的 message 实例，可简写为close
                  offset:[number=20],//Message 距离窗口顶部的偏移量
                  position [string='top-right'], 自定义弹出位置 可选 top-right/top-left/bottom-right/bottom-left
                  onClick [function] 点击 Notification 时的回调函数 可简写为 click
              }
          </pre>在.notice的基础上，可以通过notice.success,notice.error,notice.info,notice.warning快捷调用，以success为例：
          <ul>
            <li>notice.success(message:string)等价于({type:'success',message})</li>
            <li>notice.success(message:string,title:string),等价于({type:'success',message,title})</li>
            <li>notice.success(message:string,title:string,delay:number),delay&lt;100时等价于({type:'success',message,title,delay})</li>
            <li>notice.success(message:string,title:string,duration:number),delay&gt;100时等价于({type:'success',message,title,duration})</li>
            <li>notice.success(message:string,title:string,showClose:boolean),等价于({type:'success',message,title,showClose})</li>
            <li>notice.success(message:string,title:string,onClose:function),等价于({type:'success',message,title,onClose})</li>
          </ul>
        </div>
      </el-collapse-item>
      <el-collapse-item title=".dialog(options)">
        <div class="content">
          .dialog封装自ElementUi中的Dialog对话框，直接通过脚本代码来调用对话框比写html代码更方便。
          关于ElementUi Dialog的功能与参数配置等详见
          <a href="https://element.eleme.cn/#/zh-CN/component/dialog" target="_blank">文档</a>
          <br />
          <el-button @click="dialog1">打开dialog</el-button>
          <el-button @click="dialog2">更灵活的dialog</el-button>
          <pre>
                常用配置选项
                {
                    title:[string],//标题
                    width:[string='50%'|number],//窗口宽度，为number时将转为px
                    modal:[boolean=true],//是否需要遮罩层
                    fullscreen:[boolean=false],//是否全屏
                    top:[string='15vh'],//Dialog CSS 中的 margin-top 值
                    showClose:[boolean=true],//是否显示关闭按钮
                    center:[boolean=false],//是否对头部和底部采用居中布局
                    closeOnClickModal:[boolean=true],//是否可以通过点击 modal 关闭 Dialog
                    closeOnPressEscape:[boolean=true],//是否可以通过按下 ESC 关闭 Dialog
                    lockScroll:[boolean=true],//是否在 Dialog 出现时将 body 滚动锁定
                    //以上所列项目均为ElementUi Dialog原生配置，还有几个未列出的配置项已封装在扩展中，不建议使用其配置
                    //以下是新增字段。
                    allowDrag:[boolean=true],//允许通过鼠标拖动窗口
                    scoped:null,//参见文末说明
                    message:[string|VNode],//窗口正文部分的内容
                    //事件侦听
                    on:{
                        open:()=>{},//Dialog 打开的回调
                        opened:()=>{},//Dialog 打开动画结束时的回调
                        close:()=>{},//Dialog 关闭的回调
                        closed:()=>{}//Dialog 关闭动画结束时的回调
                    },
                    footer:[string|VNode],//窗口底部内容，不提供的情况下会自动生成『确定』和『取消』两个按钮
                    //以下字段仅在不设置footer时会自动生成『确定』和『取消』两个按钮的情况下有效
                    handler:[function(done,btn)],//写法同.confirm中的handler，done用于控制窗口,btn是当前按钮实例
                    cancel:[function(done,btn)],//写法同.confirm中的cancel
                    btnText:[string='确定'],//默认确定按钮显示文本
                    loadText:[string='保存中...'],//在请求状态过程中默认显示的文本内容
                }
            </pre>
            如果message、footer、title要使用dom对象，可以按以下方式操作：<br>
            1、在调用.dialog的.vue页面的html代码部分写&lt;nf-dialog ref="refName"&gt;&lt;/nf-dialog&gt;<br>
            2、然后在其中写入slot="title"或slot="footer"；对于message是默认内容，不需要具名slot;<br>
            3、在.dialog的配置数据中加上scoped:this.$refs[refName]。这样封装方法中将会从scoped中读取$slots.title或$slots.footer或$slots.default；
            <pre>
                &lt;nf-dialog ref="example"&gt;
                    &lt;el-button slot="footer" @click="$.success('您点击了我')"&gt;自定义按钮&lt;/el-button&gt;
                    &lt;span&gt;我是标题title&lt;/span&gt;
                    &lt;div&gt;
                        这里是message内容。
                    &lt;/div&gt;
                    这里还是message的内容
                &lt;/nf-dialog&gt;
            </pre>
        </div>
      </el-collapse-item>
      <el-collapse-item title=".mask(options)和.unmask">
        <div class="content">
          .mask封装自ElementUi中的Loading，显示全屏的遮罩效果。通过.unmask()来关闭遮罩
          <div>
            <el-button @click="$.mask(5)">最简遮罩</el-button>
            <el-button @click="mask1">带参数配置的遮罩</el-button>
          </div>
          <pre>
                mask();或mask(true)
                //带参数配置的遮罩
                mask({
                    background:true,
                    msg:'背景颜色随机变化',
                    click:true
                })
            </pre>
          <pre>
                {
                    target:[string|object],//默认'#app'Loading 需要覆盖的 DOM 节点。
                    text:[string='请稍候...'],//显示在加载图标下方的加载文案，别名 msg
                    spinner:[string='el-icon-loading'],//自定义加载图标类名 别名 icon
                    background:[string|boolean],//背景颜色，默认rgba(0, 0, 0, 0.7),当background=true时，将随机变换背景色
                    customClass:[string],//Loading 的自定义类名
                    //以下为扩展字段
                    delay:[number],//在指定秒数后自动关闭遮罩,
                    open:[function],//在遮罩显示时回调，参数为instance(遮罩实例),
                    click:[function|boolean],//在点击背景时回调，参数为instance，当click=true时，则点击背景时关闭
                }
            </pre>.mask的参数多态写法
          <ul>
            <li>.mask()=.mask(true) 打开遮罩层; .mask(false)=.unmask() 关闭遮罩层</li>
            <li>当mask传递一个参数时：string={msg}、number={delay}、function={click}</li>
            <li>当mask传递两个参数时：第1个参数必须为string,作为提示文本，第二个参数根据类型来设置，同上</li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>

    <nf-dialog ref="example">
        <div style="text-align:left" slot="footer">
            <el-button @click="$.success('您点击了我')">自定义按钮</el-button>
        </div>
        <span slot="title">我是标题title</span>
        <div>这里是message的内容</div>
        这里还是message的内容
    </nf-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    getData(name) {
      return this.params.filter(a => {
        return !$.isArray(a.allow) || a.allow.indexOf(name) > -1;
      });
    },
    alert1() {
      $.alert({
        message: "点击确定按钮后，有其他响应操作",
        handler: (done, instance) => {
          $.success("您点击了『确定』");
        },
        close: () => {
          $.success("关闭提示框");
        }
      });
    },
    confirm1() {
      $.confirm({
        title: "确认要删除吗？",
        message: "用户删除后将无法恢复。请谨慎操作！",
        btnText: "删除",
        cancel: {
          text: "放弃",
          handler: () => {
            $.warn("您放弃了操作");
          }
        },
        handler: (done, instance) => {
          $.success("您点击了『删除』按钮");
        },
        close: () => {
          $.info("这是通过点击右上角x或背景或esc键关闭窗口");
        }
      });
    },
    prompt1() {
      $.prompt({
        title: "填写信息",
        message: "请输入一个邮箱",
        vtype: "email",
        handler: (value, done) => {
          $.success(`您的邮箱是：${value}，将模拟提交失败效果...`);
          setTimeout(() => {
            done(false, "提交失败了！");
          }, 5000);
          return true;
        },
        cancel: done => {
          $.info("您点击了取消，3s后将关闭窗口");
          setTimeout(done, 3000);
          return true;
        }
      });
    },
    mask1() {
      $.mask({
        background: true,
        msg: "背景颜色随机变化",
        click: true
      });
    },
    dialog1() {
      $.dialog({
        title: "通过脚本调用的Dialog",
        message: this.$createElement("pre", {}, [
          `
                .dialog{
                    title:"通过脚本调用的Dialog",
                    message:"message字段的内容显示在这儿",
                    handler: () => {
                        $.success("您点击了确定按钮");
                    },
                    cancel: {
                        text: "关闭",
                        handler: () => {
                            $.info("您点击了取消按钮");
                        }
                    }
                }
                如果配置footer，则底部显示footer定义的内容
            `
        ]),
        handler: () => {
          $.success("您点击了确定按钮");
        },
        cancel: {
          text: "关闭",
          handler: () => {
            $.info("您点击了取消按钮");
          }
        }
      });
    },
    dialog2(){
        $.dialog({
            scoped:this.$refs['example']
        })
    }
  }
};
</script>