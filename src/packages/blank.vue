<template>
  <div class="page-index-article-body">
    <p>这是一个空白页</p>
    <p style="color:#606266">{{$route.fullPath}}</p>
  </div>
</template>

<script>
export default {
  name:'NfBlank'
}
</script>

<style lang="scss" scoped>
.page-index-article-body {
  padding:50px;
  text-align: center;
}
</style>
