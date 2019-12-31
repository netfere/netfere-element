<style scoped>
</style>

<template>
  <div>
      <nf-table :config="config">
          <div slot="expand" slot-scope="{row}">{{row}}</div>
      </nf-table>
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
    if ($.isEmpty(this.myTrades)) {
      $.query({
        mask: "获取交易历史",
        url: "http://127.0.0.1:8360/index/test",
        ok: res => {
            this.$store.state.myTrades=res.data;
        }
      });
    }
  },
  computed: {
    ...mapState({
      myTrades: o => o.myTrades
    }),
    ...mapGetters([]),
    keys(){
        if(this.myTrades.length>0){
        return Object.keys(this.myTrades[0])
        }
    },
    config(){
        //"id", "info", "order", "timestamp", "datetime", "symbol", "type", "side", "takerOrMaker", "price", "amount", "cost", "fee"
        return {
            maxHeight:500,
            columns:[
                {type:'expand',slots:'expand'},
                {prop:'datetime',formatter:row=>$.date(row.timestamp).toString()},
                {prop:'symbol'},
                {prop:'side'},
                {prop:'price'},
                {prop:'amount'},
                {prop:'cost'},
                {prop:'fee.cost'}
            ],
            data:this.myTrades
        }
    }
  },
  methods: {}
};
</script>