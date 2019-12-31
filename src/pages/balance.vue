<style scoped>
</style>

<template>
  <div>
    <nf-table :config="config"></nf-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.initData();
  },
  computed: {
    ...mapState({
      exchanges: o => o.exchanges,
      accountHistorys: o => o.accountHistorys
    }),
    ...mapGetters([]),
    config() {
      return {
        page: {
          local: true
        },
        columns: [
          { type: "expand", slots: ({ row }) => JSON.stringify(row) },
          {
            prop: "account-id",
            label: "账户",
            width: 120,
            formatter:row=>{
                const ex=this.exchanges.find(a=>!!a.accounts.find(b=>b.id===row['account-id']));
                if(ex){
                    return ex.accounts.find(a=>a.id===row['account-id']).typeText
                }else{
                    return row['account-id']
                }
            }
          },
          { prop: "currency", label: "币种", width: 100 },
          { prop: "transact-type", label: "类型", width: 100 },
          { prop: "avail-balance", label: "可用余额" },
          { prop: "acct-balance", label: "账户余额" },
          {
            prop: "transact-time",
            label: "交易时间",
            formatter: row => $.date(row["transact-time"]).toString()
          },
          { prop: "transact-amt", label: "变动金额" }
        ],
        data: this.accountHistorys.sort(
          (a, b) => b["transact-time"] - a["transact-time"]
        )
      };
    }
  },
  methods: {
    initData() {
      if ($.isEmpty(this.exchanges)) {
        $.query({
          url: "/houbi/getBaseData",
          ok: res => {
            this.$store.commit("init", { exchanges: res.data });
          }
        });
      }
      if ($.isEmpty(this.accountHistorys)) {
        $.query({
          url: "/houbi/getAccountHistory?local=yes",
          ok: res => {
            this.$store.commit("init", { accountHistorys: res.data });
          }
        });
      }
    }
  }
};
</script>