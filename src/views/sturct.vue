<style scoped>
</style>

<template>
  <div>
    <nf-table ref="table" v-bind="config">
      <pre class="precode" slot="main">
            import Vue from 'vue';
            import App from './App.vue';
            import router from './router/index';
            import store from './store';
            import NetfereElement from 'netfere-element';
            //如果要启用WebSocket，请引用，详细说明见<router-link to="/admin/components/websocket">WebScoket</router-link>
            //import VueSocketio, { sockets } from 'netfere-element/websocket';

            //应用NetfereElement
            Vue.use(NetfereElement, {
                global:'$',//[可选]如果要全局使用工具库NetfereJs，请配置全局名称，会将工具库添加到Window,Vue,Vue.prototype
                store,//[必须]将vuex传入，会初始化NetfereElement中要用到的module
                axios:{},//[可选] 初始化axios配置，请参考<router-link to="/admin/utils/axios">axios请求</router-link>的配置说明
            })

            /* 
            如果启用了WebScoket，请应用并配置数据。具体可参考WebSocket说明
            Vue.use(VueSocketio, {
                debug: false,
                connection: "http://localhost:8360",
                options: { path: '/socket.io', autoConnect: false }
            });
            */

            new Vue({
                router,
                store,
                // sockets,//在启用WebSocket的情况下添加此项
                render: h => h(App),
                mounted() {
                    //$bus为NetfereElement中添加的，常用于跨组件侦听、触发事件;
                    //并且在NfTable中应用到$bus，主要实现NfTable的MaxHeight高度随窗口调整时自动适应
                    this.$bus.init(); 
                }
            }).$mount('#app')
      </pre>
      <pre class="precode" slot="app">
            &lt;template&gt;
            &lt;transition name="fade" mode="out-in"&gt;
                &lt;router-view id="app"&gt;&lt;/router-view&gt;
            &lt;/transition&gt;
            &lt;/template&gt;

            &lt;script&gt;
            export default {
                name: "app"
            };
            &lt;/script&gt;
      </pre>
      <pre class="precode" slot="viewindex">
            &lt;template&gt;
                &lt;nf-frame :title="title" :user-name="userName" :user-avatar="userAvatar" :actions="actions" @logout="logout"&gt;
                    &lt;!--
                        根据业务需求，可以在这里添加slot=[message,navigation,toolbar,banner]及不具名的slot
                        可以侦听@logout是因为在路由配置中有一个项目的meta中有配置{emit:'logout'}，您也可以配置其他内容，可以此处获得侦听
                        关于NfFrame的具体用法请参考『<router-link to="/admin/components/layout">首页框架</router-link>』中的说明
                    --&gt;
                &lt;/nf-frame&gt;
            &lt;/template&gt;

            &lt;script&gt;
            export default {
                data() {
                    return {
                    title: "站点标题",
                    userName: "用户姓名或昵称",
                    userAvatar: "头像图片url",
                    //鼠标滑过昵称或头像时出现的下接菜单设置
                    //actions内的项目有效字段为{text,handler,disabled,divided,icon}
                    actions: [
                        {
                            text: "个人中心",
                            icon: "el-icon-user",
                            handler: () => this.$router.push({ path: "/user" })
                        },
                        {
                            text: "历史消息",
                            icon: "el-icon-info",
                            handler: () => this.$router.push({ path: "/message" })
                        },
                        {
                            text: "退出系统",
                            icon: "el-icon-remove",
                            divided: true,//与上一条目之间加分隔线
                            handler: () => this.logout()
                        }
                    ]
                    };
                },
                methods: {
                    logout() {
                        this.$.confirm({
                            message: "确认退出吗？",
                            btnText: "退出",
                            cancel: "再留一会",
                            type: "warning",
                            handler: () => {
                            //退出时要处理的内容，如清空sessionStorage等
                            this.$router.push("/login");
                            }
                        });
                    }
                }
            };
            &lt;/script&gt;
      </pre>
      <pre class="precode" slot="viewhome">
        &lt;template&gt;
            &lt;div&gt;
                &lt;h1&gt;Home&lt;/h1&gt;
            &lt;/div&gt;
        &lt;/template&gt;

        &lt;script&gt;
        export default {
            components:{},
            data(){
                return {}
            },
            created(){},
            mounted(){},
            computed:{},
            methods:{}
        }
        &lt;/script&gt;
      </pre>
      <pre class="precode" slot="viewlogin">
        &lt;template&gt;
          &lt;div&gt;
            &lt;!--nf-form为封装的ElForm--&gt;
            &lt;nf-form style="width:450px;margin:20px auto;" v-bind="config" v-model="model" /&gt;
          &lt;/div&gt;
        &lt;/template&gt;

        &lt;script&gt;
        // 导出路由表，登陆成功后将动态添加，并自动生成导航菜单
        import { adminRoutes } from "../router.js";
        // 一个便捷且小的日期时间库
        import fns from "date-fns";
        export default {
          components: {},
          data() {
            return {
              model: {},
              config: {
                title: "登陆系统",
                fields: [
                  {
                    label: "用户名",
                    prop: "username",
                    required: true,
                    xtype: "input",
                    value: "admin"
                  },
                  {
                    label: "密码",
                    prop: "password",
                    required: true,
                    xtype: "input",
                    type: "password",
                    value: "123456"
                  }
                ],
                buttons: {
                  align: "right",
                  items: [
                    {
                      text: "登陆",
                      handler: (form, btn) => {
                        this.login(form, btn);
                      }
                    },
                    { text: "注册", handler: () => {} }
                  ]
                }
              }
            };
          },
          methods: {
            login(form, btn) {
              btn.mask(true,'登陆中...');
              // 此处自行编辑向后台进行身份验证的请求，当验证成功后，建议按下列代码处理
              // 构造sessionStorage要保存的数据，<span>这部分数据将在router.js中on:{ready(){}}中使用到，请注意二者的一致性</span>
              const permission = {
                type: "admin",
                expired: fns.addHours(new Date(), 1).getTime(),
                roles: ["master"],
                token: "..."
              };
              sessionStorage.setItem("permission", JSON.stringify(permission));
              <span>//调用封装路由动态添加新路由表</span>
              this.$router.loadRoutes(adminRoutes, permission.roles);
              //进入系统
              this.$router.push({ path: "/admin" });
            }
          }
        };
        &lt;/script&gt;
      </pre>
      <div slot="router">
          <el-alert type="warning" show-icon :closable="false">
              <span slot="title">
                  您可以不遵循NetfereElement要求的路由规范，可以按照常规Vue开发方式进行。只不过无法正常使用NetfereElement内置的导航菜单、动态路由、权限验证等功能！
              </span>
          </el-alert>
          <pre class="precode">
            /**
            引用经过二次封装的VueRouter
            Router可以实现动态路由、权限判断、根据路由生成导航菜单、401/404及找不到路由时自动转向404页面。
            Blank是一个空白的vue组件，方便在配置路由时临时应用
            BlankRouter是一个内含router-view的vue组件，在需要应用子路由时可以便捷使用
            关于二次封装的VueRouter具体说明请参考『<router-link to="/admin/components/router">路由封装</router-link>』
             */
            import { Router, Blank, BlankRouter } from 'netfere-element';

            export default new Router({
              /**
              routes为配置基础路由，主要是非权限路由，除meta有特殊配置说明外，其他均按VueRouter路由要求
              必须在routes中配置一个根路由，即path='/'作为全部入口
               */
              routes:[
                {
                  path: '/',
                  redirect: { path: '/login' },
                },
                {
                  path: '/login',
                  meta: { hidden: true },
                  component: () => import('./views/login')
                },
                {
                  path: '/logout',
                  meta: { title: '退出系统', index: 999, emit: 'logout' }
                }
              ],
              /**
              封装路由的事件侦听，支持以下事件
              error(Error) - 当路由发生错误时触发
              ready(instance) - VueRouter准备完成时触发，instance为封装路由实例
              before(to,from,next,instance) - 全局路由跳转之前触发 特别注意 如果要在此事件中调用next，则该方法要返回false
              after(to,from,next,instance) - 全局路由跳转之后触发
               */
              on:{
                //处理在刷新页面时通过sessionStorage数据判断并加载动态路由
                <span>//因为在刷新的情况下，之前登陆系统时加载的动态路由会丢失，所以需要特殊处理</span>
                ready: instance => {
                  const name = instance.getSub(); // 获取浏览器地址中#/xxx/...中xxx部分，我们一般用xxx表示子系统标识
                  // 在当前子系统标识下，获取数据，判断权限及过期时间等信息，然后动态加载路由
                  if (['admin'].indexOf(name) > -1) {
                    const { type, roles = [], expired = 0 } = JSON.parse(sessionStorage.getItem('permission') || "{}");
                    if (expired > new Date().getTime()) {
                      if (type === name) {
                        //loadRoutes为封装路由新增的方法，用于添加动态路由，接受两个参数，第1个为路由数据，第2个为当前用户权限，如['master']
                        instance.loadRoutes(adminRoutes, roles);
                      }else{
                        instance.force('/login')
                      }
                    }else{
                      //强制跳转到登陆页
                      instance.force('/login')
                    }
                  }
                }
              }
            })

            //建议在router.js文件再导出子系统的路由，在用户身份验证后将动态添加到当前路由中
            export const adminRoutes = [
              {
                path: '/admin',//建议与子系统标识名称一致
                redirect: { path: '/admin/home' },
                meta: { moveup:true },//moveup:true 表示在显示菜单时，将此项上移一级，请自行测试true和false的效果
                component: () => import('./views/index.vue'),
                children:[]
              }
            ]
          </pre>
      </div>
    </nf-table>
  </div>
</template>

<script>
import {$} from "../packages/utils";
const tableData = [
  {
    name: "main.js",
    message: "项目入口",
    expand: "main"
  },
  {
    name: "App.vue",
    message: "main.js中引入的vue文件",
    expand: "app"
  },
  {
    name: "store.js",
    message: "vuex入口文件",
    expand: "store"
  },
  {
    name: "router.js",
    message: "vue-router入口文件",
    expand:'router'
  },
  {
    name: "views",
    message: "项目更多的页面文件",
    children: [
      { name: "index.vue", message: "框架文件", expand: "viewindex" },
      { name: "home.vue", message: "首页", expand: "viewhome" },
      { name: "login.vue", message: "登陆页", expand: "viewlogin" }
    ]
  },
  {
    name: "styles/",
    message: "所有的css相关文件放在此目录下"
  },{
    name: "admin/",
    message: "admin子系统模块的所有vue文件"
  }
];

export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    config() {
      return {
        title: "NetfereElement项目的目录结构，主要展示src内的结构",
        size: "small",
        rowKey: "id",
        data: this.formatData(tableData, 1),
        columns: [
          {
            type: "expand",
            toggle: true,
            filter: row => !row.expand,
            render: (h, { row }) => {
              const vnode = this.$refs["table"].$slots[row.expand];
              if (vnode) {
                return vnode;
              } else {
                return h("span", "无内容");
              }
            }
          },
          {
            label: "目录或文件名",
            width: 250,
            prop: "name",
            render: (h, { row }) => {
              return h(
                "span",
                { style: `paddingLeft:${10 * row.level}px` },
                row.name
              );
            }
          },
          {
            label: "功能说明",
            prop: "message"
          }
        ]
      };
    }
  },
  methods: {
    formatData(data, level) {
      return data.reduce((arr, item) => {
        arr.push(
          $.apply({ level, id: $.id() }, $.slice(item, "children", false))
        );
        if (item.children) {
          arr.push(...this.formatData(item.children, level + 1));
        }
        return arr;
      }, []);
    }
  }
};
</script>