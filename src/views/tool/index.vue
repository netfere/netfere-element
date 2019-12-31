<style scoped>
</style>

<template>
  <div>
      <nf-table ref="table" v-bind="config">
          <pre class="precode" slot="apply">
            apply(target,...) - 每项都必须是object数据，数量不限；
            功能与Object.assign一致，即将参数中数据第二项起从前往后逐一合并到target中，有重复键名时以最后的值为准。
            此时第一项会变化，如果要保持第一项不变化，可以将第一项直接写{}
          
            <span>.apply({a:1},{b:2,a:3},{d:5})={{formatString($.apply({a:1},{b:2,a:3},{d:5}))}}</span>
          </pre>
      </nf-table>
  </div>
</template>

<script>
import { $ as util} from "../../packages/utils";
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    config() {
      return {
        title: "NetfereJs常用函数 版本："+util.version,
        size:'small',
        rowKey: "name",
        columns: [
          { type: "index" },
          {
            type: "expand",
            toggle: true,
            filter: row => row.expand===false,
            render: (h, { row }) => {
              const vnode = this.$refs["table"].$slots[row.name];
              if (vnode) {
                return vnode;
              } else {
                return h("span", "无内容");
              }
            }
          },{
              label:'函数名称',prop:'name',width:150
          },{
              label:'说明',prop:'info'
          }
        ],
        data: this.getData()
      };
    }
  },
  methods: {
    getData() {
        return Object.keys(util).sort().reduce((res,key)=>{
            switch(key){
                case 'apply':
                    res.push({name:key,info:'合并object数据'})
                    break;
                case 'applyIf':
                    res.push({name:key,info:'只合并第一项中存在的键值'})
                    break;
                case 'applyNot':
                    res.push({name:key,info:'只合并第一项中不存在的键值'})
                    break;
                default:
                    res.push({name:key,expand:false})
                    break;
            }
            return res;
        },[]);
        /* const adds=util.slice(this.$,Object.keys(util),false);
        Object.keys(adds).sort().reduce((res,key)=>{
            res.push({name:key,extend:true})
            return res;
        },arr);
        return arr; */
    },
    formatString(data){
        return JSON.stringify(data)
    }
  }
};
</script>