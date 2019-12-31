
<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="1" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">{{collapsed?'':title}}</el-col>
      <el-col :span="1">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="15">
        <slot name="banner"></slot>
      </el-col>
      <el-col :span="2" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img :src="userAvatar" />
            {{userName}}
          </span>
          <el-dropdown-menu slot="dropdown" v-if="Array.isArray(actions)">
            <el-dropdown-item v-for="(item,i) in actions" :key="i" :divided="item.divided" :disabled="item.disabled" @click.native="item.handler">{{item.text}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside v-if="$slots.navigation" :class="collapsed?'menu-collapsed':'menu-expanded'">
        <slot name="navigation"></slot>
      </aside>
      <aside v-else :class="collapsed?'menu-collapsed':'menu-expanded'">
        <nf-nav :data="$router.options.routes" @handler="$emit($event)" :roles="roles" :default-active="$route.path" :collapse="collapsed" class="el-menu-vertical-demo"></nf-nav>
      </aside>
      <section class="content-container">
        <slot name="message"></slot>
        <div class="grid-content bg-purple-light">
          <slot v-if="$slots.toolbar" :router="router" name="toolbar"></slot>
          <el-col :span="24" class="breadcrumb-container" v-else>
            <strong class="title">{{router.title}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in router.parents" :key="item.path">{{ item.title }}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <slot></slot>
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import NfNav from "./nav.js";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "NfFrame",
  props: {
    title: {
      type: String,
      default: "NetfereElement"
    },
    userName: {
      type: String,
      default: "admin"
    },
    userAvatar: {
      type: String,
      default:''
    },
    actions: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    NfNav
  },
  data() {
    return {
      collapsed: false
    };
  },
  computed: {
    ...mapState("permission", {
      roles: o => o.roles
    }),
    router() {
      let title = this.$route.meta ? this.$route.meta.title : this.$route.name;
      return {
        title: title || "[无标题]",
        path: this.$route.path,
        parents: this.$route.matched.map(a => {
          return {
            title: a.meta ? a.meta.title : a.name || "",
            path: a.path
          };
        })
      };
    }
  },
  methods: {
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    }
  }
};
</script>

<style scoped lang="scss">
@import "../styles/vars.scss";
@import "../styles/frame.scss";
</style>