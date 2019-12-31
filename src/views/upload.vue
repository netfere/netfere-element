<style scoped>
</style>

<template>
  <div>
    <nf-upload v-bind="config">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </nf-upload>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      config: {
        width: 300,
        action: "http://localhost:8360/",
        fileList: [
          {
            name: "food.jpeg",
            url:
              "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
          },
          {
            name: "food2.jpeg",
            url:
              "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
          }
        ],
        listType: "picture",
        beforeRemove: file => {
          return this.$confirm(`确定移除 ${file.name}？`);
        }
      }
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {}
};
</script>