<style scoped>
</style>

<template>
  <div>
    <nf-table ref="table" :config="config">
      <div slot="expand" slot-scope="{row}">
        展开项目
        <br />
        {{row}}
      </div>
    </nf-table>
  </div>
</template>

<script>
import {$} from "../packages/utils";
const students = [];
for (let i = 1; i <= 25; i++) {
  students.push({
    id: i,
    name: "学生" + i,
    age: $.rnd(10, 20),
    address: { city: "city", zip: "zip" }
  });
}
export default {
  components: {},
  data() {
    return {
      config: {
        //header: "NfTable 演示",
        data: [],
        render: {
          /* empty: { tag: "span", context: "empty" },
          append: { tag: "div", context: "this is table append slot" },
          prepend: { tag: "div", context: "this.is prepend" },
          action: [{ xtype: "button", text: "btn1" }] */
        },
        data: students,
        rowKey: "id",
        selection: [2],
        columns: [
          { type: "index" },
          { type: "selection", limit: 2 },
          {
            type: "expand",
            toggle: true,
            render: "expand"
          },
          {
            prop: "name",
            label: "姓名",
            width: 100,
            editor: {
              width: 120,
              rules: { required: true, message: "不能为空", trigger: "blur" }
            }
          },
          {
            prop: "age",
            label: "年龄",
            width: 80,
            editor: { xtype: "number" }
          },
          {
            label: "多级表头",
            prop: "address",
            compact:true,
            render:(h,{row})=>{
              return {xtype:'input',width:100,value:row.name,onChange:value=>row.name=value}
            }
            /* columns: [
              { label: "city", prop: "address.city" },
              { label: "zip", prop: "address.city" }
            ] */
          },
          {
            label: "功能",
            width: 180,
            compact: true,
            render: {
              header: (h, { $index, column, store, _self }) => {
                const config = {
                  text: "添加",
                  type: "text",
                  handler: () => {
                    _self.append({
                      mode: "dialog",
                      title: "添加新学生",
                      record: { name: "name", age: 10 },
                      handler: (model, done) => {
                        setTimeout(() => {
                          done(true, "添加完成");
                          this.$.insert(this.config.data, 0, model);
                        }, 3000);
                      },
                      other: {
                        width: 400
                      }
                    });
                  }
                };
                return h("nf-button", { props: { config } });
              },
              default: (h, { row, _self }) => {
                return {
                  xtype: "buttons",
                  type: "text",
                  items: [
                    {
                      text: "编辑",
                      icon: "el-icon-edit",
                      handler: btn => {
                        this.edit(row, _self.editor);
                      }
                    },
                    {
                      text: "删除",
                      icon: "el-icon-delete",
                      style: { marginLeft: "10px" },
                      handler: btn => {
                        _self.remove(
                          "确认要删除" + row["name"] + "吗？",
                          done => {
                            setTimeout(() => {
                              $.remove(this.config.data, row);
                              done();
                            }, 3000);
                            return true;
                          }
                        );
                      }
                    }
                  ]
                };
              }
            }
          }
        ],
        pager:{
          local: true,
          size: 5
        },
        page: {
          local: true,
          size: 5,
          layout: ["prev", "pager", "next", "total"]
        }
      }
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    edit(row, editor) {
      editor({
        action: "edit",
        record: row,
        mode: "dialog",
        title: "编辑{{name}}的信息",
        fields: [{ xtype: "input", prop: "addr", label: "地址" }],
        handler: (data, done, form) => {
          setTimeout(() => {
            done(false);
          }, 3000);
        },
        other: {
          width: 400,
          btnText: "提交",
          loadText: "等一下"
        }
      });
    }
  }
};
</script>