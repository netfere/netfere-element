<style scoped>
</style>

<template>
  <div>
    <nf-table v-bind="config">
      <div style="padding:10px" slot="expand" slot-scope="{row}">
        <nf-expand-none v-if="row.id===1" />
        <template v-else>
          {{row}}
          <pre>
              {
                  type:'expand',
                  toggle:true, //交换显示展开行
              }
          </pre>
        </template>
      </div>
    </nf-table>
  </div>
</template>

<script>
import { $ } from "../../packages/utils";
const tableData = [];
for (let i = 1; i <= 25; i++) {
  tableData.push({
    id: i,
    "name": "姓名" + i,
    age: $.rnd(20, 40),
    gender: ["男", "女"][$.rnd(0, 1)],
    email:
      $.rndString(5) +
      "@" +
      ["qq.com", "163.com", "126.com", "sina.com.cn"][$.rnd(0, 3)],
    phone:
      ["138", "139", "130", "182", "135", "188"][$.rnd(0, 5)] +
      $.rndString(8, ["0"]),
    score: {
      chinese: $.rnd(50, 100),
      math: $.rnd(50, 100),
      english: $.rnd(50, 100),
      no: $.rndString(9, ["0"])
    }
  });
}
export default {
  components: {},
  data() {
    return {
      editByid: null,
      keyWord: ""
    };
  },
  created() {},
  mounted() {},
  computed: {
    config() {
      return {
        title: "NfTable演示",
        size: "small",
        rowKey: "id",
        offetHeight: 55,
        columns: {
          align: "center",
          items: [
            { type: "index" },
            {
              type: "expand",
              toggle: false,
              filter: row => {
                return row.id === 3 || row.id === 7;
              }
            },
            { type: "selection", limit: 0, summary: "汇总" },
            {
              label: "姓名",
              prop: "name",
              width: 120,
              type: "popover",
              render: (h, { row }) => {
                return h("el-popover", {}, [
                  h(
                    "span",
                    { slot: "reference", style: { cursor: "default" } },
                    row["name"]
                  ),
                  JSON.stringify(row)
                ]);
              },
              editor: { xtype: "input", width: 150 },
              summary: "{{count}}人"
            },
            {
              label: "年龄",
              prop: "age",
              width: 80,
              editor: {
                xtype: "number",
                width: 150,
                cellEdit: { controls: false }
              },
              summary: "average"
            },
            {
              label: "性别",
              prop: "gender",
              width: 60,
              editor: {
                xtype: "radios",
                items: ["男", "女"],
                cellEdit: {
                  xtype: "select",
                  on: {
                    change: (value, ins, commit) => {
                      setTimeout(() => {
                        commit(false);
                      }, 3000);
                    }
                  }
                }
              },
              summary: data => {
                const res = data.reduce(
                  (value, curr) => {
                    if (curr["gender"] === "男") {
                      value[0] += 1;
                    } else if (curr["gender"] === "女") {
                      value[1] += 1;
                    }
                    return value;
                  },
                  [0, 0]
                );
                return res[0] + "男" + res[1] + "女";
              }
            },
            {
              label: "手机号码",
              prop: "phone",
              width: 120,
              editor: { xtype: "input", width: 150, disabled: ["append"] }
            },
            {
              prop: "email",
              label: "电子邮件",
              align: "left",
              compact: true,
              editor: {
                xtype: "input",
                width: 180,
                hidden: "edit",
                cellEdit: {
                  on: {
                    change: (value, ins, commit) => {
                      setTimeout(() => {
                        commit();
                      }, 3000);
                    }
                  }
                }
              },
              render: {
                header: (h, { column }) => {
                  return h("span", { style: { color: "red" } }, column.label);
                }
              }
            },
            {
              label: "",
              prop: "action",
              compact: true,
              width: 100,
              render: {
                default: (h, data) => {
                  return [
                    {
                      xtype: "button",
                      type: "text",
                      text: "编辑",
                      handler: () => this.editData(data)
                    },
                    {
                      xtype: "button",
                      type: "text",
                      text: "删除",
                      handler: () => this.removeData(data)
                    }
                  ];
                },
                header: (h, data) => {
                  return {
                    xtype: "button",
                    type: "text",
                    text: "添加",
                    handler: () => this.editData(data)
                  };
                }
              }
            },
            {
              label: "考试",
              columns: [
                {
                  label: "语文",
                  prop: "score.chinese",
                  summary: "average",
                  editor: {
                    xtype: "number",
                    width: 150,
                    cellEdit: { controls: false }
                  }
                },
                { label: "数学", prop: "score.math", summary: "average",editor: {
                    xtype: "number",
                    width: 150,
                    cellEdit: { controls: false }
                  } },
                { label: "英语", prop: "score.english", summary: "average" },
                {
                  label: "总分",
                  summary: data => {
                    return (
                      data.reduce((value, row) => {
                        value +=
                          row.score.chinese +
                          row.score.math +
                          row.score.english;
                        return value;
                      }, 0) / data.length
                    );
                  },
                  formatter: row =>
                    row.score.chinese + row.score.math + row.score.english
                }
              ]
            }
          ]
        },
        data: tableData,
        //selections:[2,7,0],
        //expandRowKeys:[2],
        rowClassName: ({ row, rowIndex }) => {
          if (rowIndex === 1) {
            return "warning";
          } else if (rowIndex === 3) {
            return "success";
          }
          return "";
        },
        pager: true,
        on: {
          cellClick: (row, column, cell, event) => {
            if (column.property === "email") {
              this.editByid = row.id;
            }
          }
        }
      };
    }
  },
  methods: {
    editData({ $index, column, row, _self }) {
      _self.edit({
        title: row ? "编辑{{name}}" : "添加学生",
        record: row,
        mode: "dialog",
        width: "30%",
        fields: [
          {
            index: -1,
            label: "城市",
            prop: "city",
            xtype: "select",
            items: ["南京", "上海", "北京", "成都"]
          }
        ],
        handler: (model, done, from) => {
          console.log(model)
          setTimeout(() => {
            done(true, "完成");
          }, 5000);
          return true;
        }
      });
    },
    removeData({ row, _self }) {
      _self.remove({
        title: `确认要删除{{name}}吗？`,
        record: row,
        handler: done => {
          setTimeout(() => {
            done(true, "完成");
          }, 5000);
          return true;
        }
      });
    },
    editEmail(h, { row }) {
      return row.id === this.editByid
        ? {
            xtype: "input",
            value: row.email,
            on: {
              change: (value, instance) => {
                if ($.vtype.email(value)) {
                  instance.set({
                    disabled: true,
                    prefixIcon: "el-icon-loading"
                  });
                  setTimeout(() => {
                    row.email = value;
                    this.editByid = null;
                    this.$.success("保存完成");
                  }, 3000);
                } else {
                  this.$.warn("邮件格式不正确");
                }
              },
              render: instance => {
                instance.focus();
              },
              blur: e => {
                if (e.target.value === row.email) {
                  this.editByid = null;
                }
              }
            }
          }
        : { tag: "span", context: row.email };
    }
  }
};
</script>