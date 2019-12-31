<template>
  <div>
    <nf-form style="width:450px;margin:20px auto;" v-bind="config" v-model="model"></nf-form>
  </div>
</template>

<script>
import { adminRoutes } from "../router.js";
import {$} from "../packages/utils";
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
                setTimeout(() => {
                  this.login(form, btn);
                }, 200);
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
      const permission = {
        type: "admin",
        expired: $.date().addHours(1).getTime(),
        roles: ["master"],
        token: ""
      };
      sessionStorage.setItem("permission", JSON.stringify(permission));
      this.$router.loadRoutes(adminRoutes, permission.roles);
      this.$router.push({ path: "/admin" });
    }
  }
};
</script>