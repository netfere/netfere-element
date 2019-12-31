<style scoped>
</style>

<template>
  <div>
    <h2>NfFrame</h2>现在呈现在您眼前的整个页面即由NfFrame组件生成。
    <h3>Props</h3>title:string - 站点标题，显示在界面的左上角
    <br />userName:string - 用户姓名，将显示在界面右上角
    <br />userAvatar:string - 用户头像，将以圆形方式显示在右上角，与userName位置并列，提供一个图片地址或base64图片
    <br />actions:Array - 当鼠标滑过姓名或头像时出现下拉菜单项目。数组项目格式数据参考el-dropdown-item，响应字段为handler
    <h3>Slots</h3>navigation - 自定义导航菜单，NfFrame默认显示导航方式将失效
    <br />message - 主显示区域顶部
    <br />banner - 整个页面最上方，与站点标题同行
    <br />default - 即默认slot将显示NfFrame中router-view之前
    <br />
    toolbar - 是一个scopedSlots，接收{router}参数，设置此项，将替换默认的主显示区上方的界面信息提示
    <div>
      <nf-form v-bind="config" v-model="model" />
    </div>
    <h3>Events</h3>
    配合路由，可自定义事件，具体用法是在路由配置项目中的meta={emit:'事件名称'}，然后此处可侦听这个事件名称。具体还可以参考路由配置说明
    <h3>使用</h3>
    参考项目目录结构中的src/views/index.vue说明。NfFrame是一个包含router-view的组件，点击导航菜单后的内容就加载在router-view中。
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      model: {
        message: false,
        navigation: false,
        toolbar: false,
        default: false,
        banner:false
      },
      config: {
        span: 5,
        fields: [
          {
            xtype: "checkbox",
            value: false,
            prop: "message",
            display: "显示message",
            on:{
                change:value=>{
                    this.$bus.$emit("nfframe-slot", 'message',value)
                }
            }
          },{
            xtype: "checkbox",
            value: false,
            prop: "navigation",
            display: "显示navigation",
            on:{
                change:value=>{
                    this.$bus.$emit("nfframe-slot", 'navigation',value)
                }
            }
          },{
            xtype: "checkbox",
            value: false,
            prop: "toolbar",
            display: "显示toolbar",
            on:{
                change:value=>{
                    this.$bus.$emit("nfframe-slot", 'toolbar',value)
                }
            }
          },{
            xtype: "checkbox",
            value: false,
            prop: "banner",
            display: "显示banner",
            on:{
                change:value=>{
                    this.$bus.$emit("nfframe-slot", 'banner',value)
                }
            }
          },{
            xtype: "checkbox",
            value: false,
            prop: "default",
            display: "显示default",
            on:{
                change:value=>{
                    this.$bus.$emit("nfframe-slot", 'default',value)
                }
            }
          }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {}
};
</script>