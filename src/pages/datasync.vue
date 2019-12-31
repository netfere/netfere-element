<style lang="scss" scoped>
</style>

<template>
  <div>
    <nf-radios :config="radios"></nf-radios>
    <el-tabs v-model="activeTab" v-if="currExchange">
      <el-tab-pane label="账户信息" name="account">
        <nf-table :config="accountConfig()">
            <el-button slot="append" type="text" @click="asyncAccounts()">刷新账户信息</el-button>
        </nf-table>
      </el-tab-pane>
      <el-tab-pane label="交易对" name="symbol">
        <el-button type="text" @click="asyncSymbols()">刷新交易对</el-button>
        <nf-table :config="symbolsConfig()"></nf-table>
      </el-tab-pane>
      <el-tab-pane label="基础币种" name="currency">
        <el-button type="text" @click="asyncCurrencys()">刷新基础币种</el-button>
        <div>{{currExchange.currencys.join('、')}}</div>
      </el-tab-pane>
    </el-tabs>
    <h3 v-else>请选择交易所</h3>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
const symbolKeyValue = {
  symbol: "交易对", // 交易对
  "base-currency": "基础币种", // 交易对中的基础币种
  "quote-currency": "报价币种", // 交易对中的报价币种
  "price-precision": "报价精度", // 交易对报价的精度（小数点后位数）
  "amount-precision": "基础币计数精度", // 交易对基础币种计数精度（小数点后位数）
  "symbol-partition": "交易区", // 交易区，可能值: [main，innovation]
  // 交易对状态；可能值: [online，offline,suspend] online - 已上线；offline - 交易对已下线，不可交易；suspend -- 交易暂停
  state: "状态",
  "value-precision": "金额精度", // 交易对交易金额的精度（小数点后位数）
  "min-order-amt": "最小下单量", // 交易对最小下单量 (下单量指当订单类型为限价单或sell-market时，下单接口传的'amount')
  "max-order-amt": "最大下单量", // 交易对最大下单量
  // 最小下单金额 （下单金额指当订单类型为限价单时，下单接口传入的(amount * price)。当订单类型为buy-market时，下单接口传的'amount'）
  "min-order-value": "最小下单金额",
  "leverage-ratio": "杠杆最大倍数" // 交易对杠杆最大倍数
};
export default {
  components: {},
  data() {
    return {
      currExchange: null,
      activeTab: ""
    };
  },
  created() {},
  mounted() {
    $.query({
      url: "/houbi/getBaseData",
      ok: res => {
        this.$store.commit("init", { exchanges: res.data });
      }
    });
  },
  computed: {
    ...mapState({
      exchanges: o => o.exchanges
    }),
    ...mapGetters([]),
    radios() {
      return {
        button: true,
        items: this.exchanges.map(item => {
          return { value: item.id, label: item.name };
        }),
        onChange: value => {
          this.activeTab = "account";
          this.currExchange = this.exchanges.find(a => a.id === value);
        }
      };
    }
  },
  methods: {
    asyncSymbols() {
      const owner = this.currExchange.id;
      $.query({
        url: "/houbi/asyncSymbols?owner=" + owner,
        confirm: "确认要同步交易对吗？",
        ok: res => {
          const record = this.$store.state.exchanges.find(a => a.id === owner);
          if (record) {
            this.$set(record, "symbols", res.data);
          }
        }
      });
    },
    symbolsConfig() {
      const state = { online: "已上线", offline: "已下线", suspend: "暂停" };
      const config = {
        maxHeight: 600,
        size: "mini",
        columns: [{ type: "index" }].concat(
          Object.keys(symbolKeyValue).map(key => {
            const column = { prop: key, label: symbolKeyValue[key] };
            if (key === "state") {
              column["formatter"] = row => state[row["state"]] || row["state"];
            }
            return column;
          })
        ),
        data: this.currExchange.symbols,
        page: {
          local: true
        }
      };
      return config;
    },
    asyncCurrencys() {
      const owner = this.currExchange.id;
      $.query({
        url: "/houbi/asyncCurrencys?owner=" + owner,
        confirm: "确认要同步基础币种吗？",
        ok: res => {
          const record = this.$store.state.exchanges.find(a => a.id === owner);
          if (record) {
            this.$set(record, "currencys", res.data);
          }
        }
      });
    },
    asyncAccounts() {
      const owner = this.currExchange.id;
      $.query({
        url: "/houbi/asyncAccounts?owner=" + owner,
        confirm: "确认要账户信息吗？",
        ok: res => {
          const record = this.$store.state.exchanges.find(a => a.id === owner);
          if (record) {
            this.$set(record, "accounts", res.data);
          }
        }
      });
    },
    accountConfig() {
      const renderNumber = ({ row, column }, h) => {
        const value = row[column.property];
        if (value === 0) {
          return "-";
        } else if (value > 0) {
          return value;
        } else {
          return h("span", { style: "color:red" }, value);
        }
      };
      const data = [];
      const columns = [
        {
          type: "expand",
          toggle: true,
          slots: ({ row }, h) => {
            return h("nf-table", {
              props: {
                config: {
                  size: "mini",
                  showHeader: false,
                  columns: row.childTableColumns,
                  data: row.details
                }
              }
            });
          }
        },
        { prop: "currency", label: "币种", width: 120,formatter:row=>$.toUpper(row.currency) },
        { prop: "total", label: "总额", slots: renderNumber },
        { prop: "trade", label: "交易余额", slots: renderNumber },
        { prop: "frozen", label: "冻结余额", slots: renderNumber },
        { prop: "loan", label: "借款", slots: renderNumber },
        { prop: "interest", label: "利息", slots: renderNumber }
      ];
      //trade: '交易余额', frozen: '冻结余额', loan: '借款', interest: '利息'
      this.currExchange.accounts.forEach(acc => {
        acc.list.forEach(item => {
          let record = data.find(a => a.currency === item.currency);
          if (!record) {
            record = {
              currency: item.currency,
              total: 0,
              trade: 0,
              frozen: 0,
              loan: 0,
              interest: 0,
              details: [],
              childTableColumns: [
                { prop: "accType", width: 120 },
                { prop: "typeText", width: 120 },
                { prop: "balance" }
              ]
            };
            data.push(record);
          }
          const balance = parseFloat(item.balance);
          record.total += balance;
          if (item.type === "trade") {
            record.trade += balance;
          } else if (item.type === "frozen") {
            record.frozen += balance;
          } else if (item.type === "loan") {
            record.loan += balance;
          } else if ((item.type = "interest")) {
            record.interest += balance;
          }
          record.details.push({
            id: acc.id,
            accType: acc.typeText,
            stateText: acc.stateText,
            balance: item.balance,
            typeText: item.typeText
          });
        });
      });
      return {
        maxHeight: 600,
        size: "mini",
        rowKey: "currency",
        columns,
        data: data.sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
      };
    }
  }
};
</script>