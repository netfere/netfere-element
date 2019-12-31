<style scoped>
</style>
<template>
  <nf-frame :title="title" :user-name="userName" :user-avatar="userAvatar" :actions="actions"  @logout="logout">
	  <div slot="banner" v-if="slot.banner" style="background-color:red;">这里是banner slot，高度限制为60px</div>
    <el-page-header v-if="slot.toolbar" @back="$router.go(-1)" slot-scope="{router}" :content="router.title" slot="toolbar"></el-page-header>
    <div slot="message" style="width:100%;background-color:red;" v-if="slot.message">这里是message slot的显示位置</div>
	<div slot="navigation" v-if="slot.navigation">这里是navigation slot的显示位置，此时默认的导航失效，请在此自行显示导航</div>
	<div v-if="slot.default" style="width:100%;background-color:red;">此处slot为默认</div>
  </nf-frame>
</template>


<script>
import avatar from "../assets/user.png";
import {$} from "../packages/utils";
export default {
  data() {
    return {
      slot:{
		  message:false,
		  navigation:false,
		  toolbar:false,
		  banner:false,
		  default:false
	  },
      //站点标题文本
      title: "Netfere",
      userName: "admin",
      userAvatar: avatar,
      actions: [
        {
          text: "个人中心",
          disabled: true //禁用
        },
        {
          text: "退出系统",
          divided: true, //与上一条目之间加分隔线
          //点击项目的响应
          handler: () => {
            this.logout();
          }
        }
      ]
    };
  },
  created() {},
  mounted() {
    this.$bus.$on('nfframe-slot',(key,value)=>{
		if($.has(this.slot,key)){
			this.slot[key]=value;
		}
	})
  },
  methods: {
    //退出登录
    logout() {
      this.$.confirm({
        message: "确认退出吗？",
        btnText: "退出",
        cancel: "再留一会",
        type: "warning",
        handler: () => {
          sessionStorage.clear();
          //sessionStorage.removeItem("user");
          this.$router.push("/login");
        }
      });
    }
  }
};
</script>
