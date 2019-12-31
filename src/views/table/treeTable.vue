<style scoped>
</style>

<template>
  <div>
    <el-button type="text" @click="dialog.visible = true">点击打开 Dialog</el-button>

    <nf-table v-bind="config"></nf-table>
  </div>
</template>

<script>
import { $ } from "../../packages/utils";

const getGrade = schid => {
  return ["高一", "高二", "高三"].map((name, i) => {
    return {
      id: schid * 100 + (i + 1),
      name,
      master: "段长" + (i + 1),
      info: "",
      type: "grade",
      hasChildren: true
    };
  });
};
const getClass = gid => {
  const arr = [];
  while (arr.length < 5) {
    const no = $.rnd(1, 10);
    if (arr.indexOf(no) === -1) {
      arr.push(no);
    }
  }
  return arr
    .sort((a, b) => a - b)
    .map((no, i) => {
      return {
        id: gid * 100 + (i + 1),
        name: no + "班",
        master: "老师" + (i + 1),
        info: "",
        type: "class"
      };
    });
};
const store = ["福州一中", "厦门附中", "人大附中"].map((name, i) => {
  const rec = {
    id: i + 1,
    name,
    master: "校长" + (i + 1),
    info: "",
    type: "school"
  };
  if (i === 0) {
    rec["children"] = getGrade(i + 1);
  } else {
    rec["hasChildren"] = true;
  }
  return rec;
});

export default {
  components: {},
  data() {
    return {
      store
    };
  },
  created() {},
  mounted() {},
  computed: {
    config() {
      return {
        title: "树型表格演示",
        data: this.store,
        size: "small",
        rowKey: "id",
        stripe: false,
        load: (tree, treeNode, resolve) => {
          setTimeout(() => {
            if (tree.type === "school") {
              resolve(getGrade(tree.id));
            } else if (tree.type === "grade") {
              resolve(getClass(tree.id));
            }
          }, 1000);
        },
        columns: [
          { type: "index" },
          { type: "selection" },
          { label: "名称", prop: "name", width: 200 },
          { label: "负责人", prop: "master", width: 100 },
          { label: "更多信息", prop: "info" }
        ]
      };
    }
  },
  methods: {
    
  }
};
</script>