<style lang="scss" scoped>
.code {
  background-color: dimgray;
  color: #fff;
  overflow: auto;
  padding: 0 5px;
  span {
    color: yellow;
    font-weight: bold;
  }
}
</style>

<template>
  <div>
    <nf-form v-bind="formConfig" v-model="model">
      <nf-form-item prop="self" slot="selfitem" label="自定义" label-width="80px">
        <nf-input v-model="model.self" />
      </nf-form-item>
      <div style="padding:5px;color:red;" slot="prepend">这个位置的slot=prepend的位置</div>
      <div style="padding:5px;color:red;" slot="footer">这个位置的slot=footer的位置</div>
      <el-button-group slot="action">
        <el-button size="mini" :disabled="formConfig.span===2" @click="formConfig.span=2">2栏</el-button>
        <el-button size="mini" :disabled="formConfig.span===3" @click="formConfig.span=3">3栏</el-button>
        <el-button size="mini" :disabled="formConfig.span===0" @click="formConfig.span=0">不分栏</el-button>
      </el-button-group>
      <div>{{model}}</div>
    </nf-form>
    <!-- <h2>NfForm使用帮助</h2>本组件扩展自ElementUi的ElForm组件，支持ElForm原生组件的所有props/methods/events，
    <a href="https://element.eleme.cn/#/zh-CN/component/form" target="_blank">详见ElForm文档</a>
    <h3>新增属性</h3>
    <ul>
      <li>title:[string] - 为表单添加一个标题</li>
      <li>shadow:[string=never] - 设置阴影显示时机，取值:always / hover / never</li>
      <li>bodyStyle:[object={ padding: '10px' }] - 主表单区域显示样式</li>
      <li>items:[array,object] - 表单项目数据</li>
      <li>buttons:[array,object] - 表单底部按钮，显示在slot=footer的最上方面</li>
      <li>render:[object,string,array,VNode,function] - 配置slots渲染</li>
      <li>model:[object] - 表单值。本属性为ElForm原生属性，在扩展中需要通过v-model来赋值</li>
    </ul>
    <h3>新增Slots</h3>
    <ul>
      <li>action - 显示在表单右上角，一般用于一些操作或提示，如示例中右上角三个分栏设置按钮</li>
      <li>prepend - 显示在表单主显示区域的上方，已在示例中用红色文字标识</li>
      <li>footer - 显示在表单最下方区域，已在示例中用红色文字标识</li>
      <li>default - 显示在表单项目之后，示例中显示表单值的区域是默认区域</li>
    </ul>
    <h3>Methods</h3>
    <ul>
      <li>支持ElForm原生的方法，详见ElForm文档</li>
      <li>新增 .reset() 与 .resetFields功能一致，但在重置前会先提示</li>
      <li>新增 .getField(prop:string|string[]) 通过prop来获取表单字段</li>
      <li>新增 .setValue(prop:string,value:any) 通过prop找到表单字段并将值设置为value</li>
      <li>新增 .setValue(props:object) props格式为{key1:value1,...}即找到prop为key1的表单字段，将值设置为value1</li>
      <li>
        新增 .submit(cb) 验证并提交表单，参数为一个回调函数，不设置回调则返回Promise
        <br />&nbsp;&nbsp;&nbsp;&nbsp;回调函数接收两个参数(model,form)
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;如果不设置回调，通过 submit().then(res=>{})的方法调用，此时res={model,form}
        <br />&nbsp;&nbsp;&nbsp;&nbsp;model是当前表单的值，form是当前表单实例
      </li>
    </ul>
    <h3>详细说明</h3>
    <pre class="code">
        html代码:
        &lt;nf-form v-bind="config" v-model="model"&gt;&lt;/nf-form&gt;
        config为所有配置内容，通过v-bind一次绑定，也可以用:来分别绑定项目。

        1.model
        model通过v-model来绑定，不要写在config中。可以为表单项目设置初始值，并且随意表单项目的设值而变化。
        其数据结构为{prop:value,...}其中prop与items中的项目字段prop一致

        2.items - 配置表单的项目
        标准格式是一个object数据，允许字段如下:
        {
            span:[number=0],//此项指定表单项目分几栏显示，取值范围[2,4]，为0或1均不分栏。设定此值后inline无效
            labelPosition:[string='right'],//统一设置表单标签显示位置
            labelWidth:[string='80px'],//统一设置表单标签的宽度
            //上述3项在不设置时将使用默认值，除此之外，还可以配置更多内容，将统一应用于items中子项
            items:[array],//每个表单项目的具体配置。详见后续说明
        }
        如果直接将items配置为一个数组，将转换为items={items:这个数组}

            具体的项目配置说明
            2.1 支持所有ElFormItem的配置项目;
            2.2 支持所有表单字段如ElInput、ElSelect等组件的所有项目，如果此项目字与ElFormItem有冲突，请用field来区分;
            2.3 特定属性：
                2.3.1 xtype - 专门用于指示以nf-开头的扩展组件，如要使用nf-input，则xtype="input"即可，不需要nf-前缀;
                2.3.2 tag - 除nf-开头的组件，可以是常规的html标签，如div、span等，也可以是ElementUi组件名称，如el-button等
                2.3.3 xtype和tag不能同时使用;
                2.3.4 prop - 是ElFormItem的属性，同时也将以此作为字段的键名，如果不设置，会自动生成。一般表单字段都需要指明;
                2.3.5 render - 渲染slot。允许渲染ElFormItem的具名slot(label,error,default)，同时也允许当前表单组件特有的slot
                2.3.6 value - 表单组件的值，可以在项目中指定，也可以在model中指定，如果二者都指定，则以项目中指定的为准;
                2.3.7 field - 当表单组件与ElFormItem存在同名属性时通过field来区分，如需要指定input的width，则需要配置field:{width:200}
            2.4 具体的表单组件请看后继说明

        3.buttons - 表单底部按钮
        标准格式是一个object，允许字段如下:
        {
            type:[string='primary'],//按钮统一样式
            //还可以设置更多的统一样式，如size:'mini'
            buttons:[array],//具体的按钮配置，数据按nf-button-group中items的要求，详见『扩展组件-按钮button』
        }
        如果直接将buttons配置为一个数组，将转换为buttons:{items:这个数组}

        4.render - 通过配置来设置slots的渲染。具体说明请看『扩展组件-关于render配置』

    </pre>
    <nf-table :config="table">
      <div slot="prepend" style="padding:5px">
        特殊说明：
        <br />1、关于value属性 - 可以初始化值或不设置，也可以在model中以prop为键名进行设置;
        <br />2、在items中配置了分栏显示时，可以在子项目中通过flex来指示当前字段占据的栏数
      </div>
      <div slot="expand" slot-scope="{row}">
        <pre class="code" v-if="row.xtype==='input'">
                {
                    xtype: "input",
                    label: "姓名",
                    prop: "name",
                    value: "netfere",
                    rules: { required: true, msg: "不能为空" },
                    //因为ElFormItem中有width属性，所以要配置字段本身宽度，则用field来区分
                    field: { width: 230 },
                    render: {
                        append: { tag: "span", context: "必填" }
                    }
                }
            </pre>
        <pre class="code" v-else-if="row.xtype==='number'">
                {
                    xtype: "number",
                    label: "年龄",
                    prop: "age",
                    value: 40
                }
            </pre>
        <pre class="code" v-else-if="row.xtype==='radio-group'">
                {
                    xtype: "radios",
                    label: "性别",
                    prop: "sex",
                    items: [
                        { label: "男", value: 1,disabled:true }, 
                        { label: "女", value: 0 }
                    ]
                    //如果items=['男','女'],则label=value=项目值
                }
            </pre>
        <pre class="code" v-else-if="row.xtype==='checkbox'">
            {
                xtype: "checkbox",
                label: "协议",
                prop: "agree",
                display: "同意" //用display来指示显示内容
            }
        </pre>
        <pre class="code" v-else-if="row.xtype==='checkbox-group'">
            {
                xtype: "checkboxs",//这里用的是别名
                label: "兴趣爱好",
                prop: "hao",
                flex: 2,//演示中将表单分成3栏显示，而此项比较宽，通过flex=2来指示此项占2栏
                items: ["游泳", "计算机", "体育", "阅读", "游戏"]
                //items项目还可以配置为[{label:'游泳',value:'100',disabled:true|false}]
            }
        </pre>
        <pre class="code" v-else-if="row.xtype==='color'">
            {
                xtype: "color",
                label: "颜色",
                prop: "color"
            }
        </pre>
        <pre class="code" v-else-if="row.xtype==='switch'">
            {
                xtype: "switch",
                label: "订阅",
                value: true,
                active: "包月",
                inactive: "包年",
                prop: "type"
            }
            关于active和inactive可以使用ElSwitch的原生配置写法，也可以有特殊写法，以active为例:
            当active=string时，即相当于activeText=string;
            还可以写成active={
                text,value,color,iconClass
            }
        </pre>
        <pre class="code" v-else-if="row.xtype==='slider'">
            {
                xtype: "slider",
                label: "月数",
                prop: "slider",
                max: 10,
                min: 0,
                value: 3,
                width: 200 //直接写width是设置ElFormItem的宽度，如果要设置字段宽度，请用{field:{width:150}}
            }
        </pre>
        <pre class="code" v-else-if="row.xtype==='rate'">
            {
                xtype: "rate",
                label: "评级",
                prop: "rate",
                value: 3
            }
        </pre>
        <pre class="code" v-else-if="row.xtype==='select'">
            {
                xtype: "select",
                label: "城市",
                prop: "city",
                multiple: true,
                //还可以写成items:['福州','南京','上海',..] 则label=value
                items: [
                    { value: 1, label: "福州" },
                    { value: 2, label: "南京" },
                    { value: 3, label: "上海" },
                    { value: 4, label: "北京" },
                    { value: 5, label: "苏州" },
                    { value: 6, label: "贵阳" },
                    { value: 7, label: "香港", disabled: true }
                ],
                //通过render来配置slot渲染
                render: {
                    prefix: { tag: "i", class: "el-icon-edit" },
                    empty: {
                        tag: "span",
                        style: "color:red",
                        context: "没有内容可选"
                    },
                    option: (h, item) => {
                        return h("div", {}, [
                            h("span", item.label + "m"),
                            h("span", { style: { float: "right" } }, item.value + "")
                        ]);
                    }
                }
            }
            下拉项目分组的写法有两种：
            1.在配置items的同时添加group的配置:
                group=[{id:组标识,label:'组名',disabled:false|true},...] 此时id和label必须有，且id在group中唯一
                在items的项目中新增parent字段，此字段与group中的id匹配，实现按id进行分组
            2.不用group和items的配置，直接使用children:[]的配置，此时children按以下写法:
                children=[
                    {
                        label:'组名',
                        disabled:false|true,//可选
                        items:[按items的要求写，此时不需要parent]
                    }
                ]
        </pre>
        <pre class="code" v-else-if="row.xtype==='cascader'">
            {
                xtype: "cascader",
                prop: "cascader",
                label: "选择",
                options: []
            }
            options的格式按以下写法
            [
                {
                    label:'显示名称',
                    value:'值',
                    //子级
                    children:[
                        {
                            label,value,children
                        }
                    ]
                }
            ]
        </pre>
      </div>
    </nf-table>-->
  </div>
</template>

<script>
import { baseFields } from "./config";

export default {
  components: {},
  data() {
    return {
      table: {
        title: "表单组件",
        rowKey: "xtype",
        columns: [
          { type: "expand", toggle: true, render: "expand" },
          {
            label: "组件名称",
            width: 150,
            formatter: row => "nf-" + row.xtype
          },
          {
            label: "xtype",
            prop: "xtype",
            width: 150
          },
          {
            label: "对应ElementUi组件",
            width: 200,
            prop: "eleui",
            formatter: row => row.eleui || "el-" + row.xtype
          },
          { label: "", formatter: row => row.info || "" }
        ],
        data: [
          { xtype: "input" },
          { xtype: "number", eleui: "el-input-number" },
          { xtype: "radio-group", info: "别名：radios" },
          { xtype: "checkbox" },
          { xtype: "checkbox-group", info: "别名：checkboxs" },
          { xtype: "color" },
          { xtype: "switch" },
          { xtype: "slider" },
          { xtype: "rate" },
          { xtype: "select" },
          { xtype: "cascader" }
        ]
      },
      model: {
        self: ""
      },
      formConfig: {
        span: 3,
        title: "NfForm & Field 演示",
        fields: [
          ...baseFields,
          {
            self: true,
            render: {
              default: "selfitem"
            }
          },
          {
            self: true,
            xtype: "button",
            text: "日期时间组件",
            handler: () => {
              this.$router.push({ path: "/components/datetime" });
            }
          }
        ],
        buttons: [
          {
            text: "保存",
            submit: (model, form, btn) => this.formSubmit(model, form, btn)
          },
          { text: "重置", reset: true },
          { text: "随机值", handler: form => this.formRndValue(form) },
          {
            text: "控制字段",
            handler: form => {
              form.getField("name").set({
                value: $.id(),
                disabled: [true, false][$.rnd(0, 1)],
                width: $.rnd(200, 300)
              });
            }
          }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    formSubmit(model, form, btn) {
      const message = [];
      for (let i in model) {
        message.push(`${i}=${model[i]}`);
      }
      this.$.alert({
        type: "",
        title: "当前表单值",
        message: message.join("<br>"),
        ishtml: true
      });
    },
    formRndValue(form) {
      const arr = ["游泳", "计算机", "体育", "阅读", "游戏"];
      const hao = [arr[$.rnd(0, 4)]];
      const ri = $.rnd(0, 4);
      if (hao.indexOf(arr[ri]) === -1) {
        hao.push(arr[ri]);
      }
      const cas = [
        ["zhinan", "shejiyuanze", "yizhi"],
        ["ziyuan", "jiaohu"],
        ["zhinan", "daohang", "dingbudaohang"],
        ["zujian", "basic", "layout"]
      ];
      form.setValue({
        name: $.id(),
        age: $.rnd(20, 40),
        sex: $.rnd(0, 1),
        agree: [true, false][$.rnd(0, 1)],
        hao,
        type: [true, false][$.rnd(0, 1)],
        slider: $.rnd(1, 9),
        rate: $.rnd(1, 4),
        color: $.rndColor(),
        cascader: cas[$.rnd(0, 3)],
        city: [$.rnd(1, 2), $.rnd(3, 5)]
      });
    }
  }
};
</script>