<template>
  <div class="page-index-article-body">
    <div>
      <img :src="img" />
    </div>
    <el-button v-for="(btn,i) in actions" :key="i" :type="btn.type || 'text'" @click="$router.replace({path:btn.path || '/'})">{{btn.text}}</el-button>
  </div>
</template>

<script>
import img404 from "../assets/img404.jpeg";
export default {
  props:{
    actions:{
      type:Array,
      default(){return []}
    }
  },
  data() {
    return {
      img: img404
    };
  },
  mounted(){
    //console.log(this.$route)
  }
};
</script>

<style lang="scss" scoped>
.page-index-article-body {
  padding:50px;
  text-align: center;
}
</style>
