<style lang="scss" scoped>
</style>

<template>
  <el-card :class="{'nf-card__headercompact':compact}" :header="header" :shadow="shadow" :bodyStyle="{padding:0}">
    <slot v-if="$.notEmpty($slots.header)" name="header" slot="header"></slot>
    <el-row v-else-if="$.notEmpty($slots.action)" slot="header" class="vertical">
      <el-col :span="header?8:0">{{header}}</el-col>
      <el-col :span="header?16:24" style="text-align:right">
        <slot name="action"></slot>
      </el-col>
    </el-row>

    <slot name="prepend"></slot>
    <div :style="bodyStyle">
      <slot></slot>
    </div>
    <div v-if="$.notEmpty($slots.footer)" class="el-card__footer">
      <slot name="footer"></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "NfCard",
  props: {
    header: String,
    shadow: {
      type: String,
      default: "never"
    },
    bodyStyle: {
      type: Object,
      default() {
        return { padding: "20px" };
      }
    }
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    compact() {
      return (
        this.$.isEmpty(this.$slots.header) &&
        this.$.notEmpty(this.$slots.action)
      );
    }
  },
  methods: {}
};
</script>