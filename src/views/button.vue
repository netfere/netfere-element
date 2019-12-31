<style scoped>
</style>

<template>
  <div>
    <h2>NfTag</h2>
    <nf-tag v-bind="tagConfig.base" />
    &nbsp;&nbsp;{{tagConfig.rndData}}
    <nf-tag :items="tagConfig.items">
      <div slot="prepend">这是一组tag。此区域的slot=prepend</div>
    </nf-tag>
    <pre>
      &lt;nf-tag v-bind="config" /&gt;
      config={
        label:"显示文本",
        width:100,//tag宽度，不设置时自动
        type: "warning",
        effect: "dark",
        //其他更多的el-tag属性
        //支持click、close、edit事件响应 instance参数是NfTag实例
        click:instance=>{},
        close:instance=>{},
        edit:instance=>{}, //edit默认的icon为el-icon-edit，如果在配置icon，则edit:{icon,handler}
        items:[] //要显示一组tag时，可以配置items项目，此时与items同级的属性将默认设置为items子项目的属性
        //配置append时，可以实现新增tag的操作，一般用于一组标签中。功能请参考示例中的『新增』
        append:(label,done)=>{
          //label为新增时输入的内容，
          ...
          done();//处理完成后，调用done用于恢复按钮
        } 
      }
      当显示一组按钮时，即配置items时，可以使用slot=prepend，将显示在一组tag之前
      实例提供一个.set()方法，用于变更实例的属性。注意，不能变更click,close,edit,append和items
      .set(prop,value) - prop为一个属性键名，value为键值;
      .set(prop) - prop为object，如{hit:true,label:'新名称',...};
      .set(prop:boolean) - 相当于.set('hit',prop);
      .set(prop:string) - 相当于.set('label',prop);
      .set(prop:number) - 相当于.set('width',prop);
    </pre>
    <h2>NfButton</h2>
    <nf-button v-bind="button" />
    <pre>
        &lt;nf-button v-bind="button" /&gt;
        button={
          text: "保存",
          handler: instance => {
            instance.mask(true, "loading");
            setTimeout(() => {
              instance.mask(false);
            }, 3000);
          }
        }
        支持ElButton的所有属性，同时新增text和handler属性。其中handler接收两个参数(instance,e)
        新增方法
        .set(prop:string,value:any) - 设置或变更实例的属性值 prop为属性名称
        .set(prop:object) - prop的格式为{type:'danger',size:'mini',...}
        .set(prop:boolean) - 相当于 .set('disabled',prop)
        .set(prop:string) - 相当于 .set('text',prop)
        .mask(ing:boolean,text?:string) 将实例变更禁用并引导状态 当ing=true时，text为可选的引导文本;ing=false时text无效
      </pre>
    <h2>NfButtonGroup</h2>
    <nf-button-group v-bind="group" />
    <pre>
        &lt;nf-button-group v-bind="group" /&gt;
        group={
          type: "danger",
          //可以配置ElButton的所有属性值，这些属性将统一应用于items中的按钮项目
          //items中的每个项目按NfButton的数据格式要求
          items: [
            { text: "变更Text", handler: btn => btn.set($.id()) },
            {
              text: "禁用",
              handler: btn => {
                btn.set(true)
              }
            },{
                text:'新增',
                handler:()=>{
                    this.group.items.push({text:$.id()})
                }
            }
          ]
        }
      </pre>
    <h2>NfDropdown</h2>
    <nf-dropdown v-bind="dropdown" />
    <pre>
      &lt;nf-dropdown v-bind="dropdown" /&gt;
      dropdown={
        type: "danger",//允许取el-button相同的type值
        text: "下拉菜单",//显示的文本
        //用click来响应el-dropdown的click事件，接收实例参数
        click: instance => {
          this.$.alert("click");
        },
        //用handler来响应el-dropdown的command事件，接收两个参数，value为在items中配置的value或command，instance为实例
        handler: (value, instance) => {
          this.$.alert(
            typeof value === "object" ? JSON.stringify(value) : value,
            "handler"
          );
        },
        //用change来响应el-dropdown的visible-change事件
        change: (visible, instance) => {},
        //items为下拉菜单的项目
        items: [
          //label为项目显示内容
          { label: "黄金糕", command: "abc" },//可以通过command为设置值
          { label: "狮子头", value: 2 },//用value来代替command也是可以的
          { label: "螺蛳粉",icon: "el-icon-delete", disabled: true },//有disabled=false|true和icon属性
          { label: "双皮奶", divided: true, value: [1, 2, 3] },//value的值可以是数组
          { label: "蚵仔煎", value: { m: "k" } }//value的值也可以是object
        ]
      }
      还允许配置el-dropdown的其他属性，如trigger=hover, click等；
      如果配置了click响应，则直接启用splitButton=true的效果,此时可以不配置splitButton
    </pre>
  </div>
</template>

<script>
import {$} from "../packages/utils";
import NfButton from "../packages/button";
import NfButtonGroup from "../packages/buttonGroup";
import NfDropdown from "../packages/dropdown";
import NfTag from "../packages/tag";
export default {
  components: {
    NfButton,
    NfButtonGroup,
    NfDropdown,
    NfTag
  },
  data() {
    return {
      visible: true,
      tagConfig: {
        rndData: null,
        base: {
          label: "点我试试",
          type: "warning",
          effect: "dark",
          click: instance => {
            this.tagConfig.rndData = {
              label: ["点我试试", "再点", "继续点", "随机"][$.rnd(0, 3)],
              type: ["success", "info", "warning", "danger"][$.rnd(0, 3)],
              hit: [true, false, true, false, true, false][$.rnd(0, 5)],
              size: ["medium", "small", "mini", ""][$.rnd(0, 3)],
              effect: ["dark", "light", "plain"][$.rnd(0, 2)]
            };
            instance.set(this.tagConfig.rndData);
          },
          close: () => {
            this.$.info("你点击了关闭");
          },
          edit: () => {
            this.$.info("你点击了编辑");
          }
        },
        items: [
          "黄金糕",
          "狮子头",
          "螺蛳粉",
          "双皮奶",
          "蚵仔煎",
          { label: "effect=dark", effect: "dark" },
          { label: "effect=light", effect: "light" },
          {
            label: "张三",
            type: "success",
            effect: "dark",
            edit: {
              icon: "el-icon-s-custom",
              handler: () => {
                this.$.alert({
                  title: "关于edit属性",
                  message:
                    'edit属性除直接设置为一个方法外，还可以配置为{icon:"el-icon-s-custom",handler:function}'
                });
              }
            }
          },
          { label: "type=success", type: "success" },
          { label: "type=warning", type: "warning" },
          { label: "type=danger", type: "danger" },
          { label: "type=info", type: "info" },
          {
            effect: "dark",
            type: "danger",
            append: (label, done) => {
              $.insert(this.tagItems, this.tagItems.length - 1, label);
              done();
            }
          }
        ]
      },
      group: {
        type: "danger",
        items: [
          { text: "变更Text", handler: btn => btn.set($.id()) },
          {
            text: "禁用",
            handler: btn => {
              btn.set(true);
            }
          },
          {
            text: "新增",
            handler: () => {
              this.group.items.push({ text: $.id() });
            }
          }
        ]
      },
      button: {
        text: "保存",
        handler: btn => {
          btn.mask(true, "loading");
          setTimeout(() => {
            btn.mask(false);
          }, 3000);
        }
      },
      dropdown: {
        type: "danger",
        text: "下拉菜单",
        click: instance => {
          this.$.alert("click");
        },
        handler: (value, instance) => {
          this.$.alert(
            typeof value === "object" ? JSON.stringify(value) : value,
            "handler"
          );
        },
        change: (visible, instance) => {},
        items: [
          { label: "黄金糕", command: "abc" },
          { label: "狮子头", value: 2 },
          { label: "螺蛳粉", disabled: true },
          { label: "双皮奶", divided: true, value: [1, 2, 3] },
          { label: "蚵仔煎", icon: "el-icon-delete", value: { m: "k" } }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    tagAppend(value) {
      console.log(value);
      this.visible = false;
    }
  }
};
</script>