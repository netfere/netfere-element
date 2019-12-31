<style scoped>
</style>

<template>
  <div style="height:600px" v-html="html">
    
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
// https://cn.tradingview.com/widget/advanced-chart/
export default {
  components: {},
  data() {
    return {
        html:`
            <!-- TradingView Widget BEGIN -->
                <div class="tradingview-widget-container">
                <div id="tradingview_a57d4"></div>
                <div class="tradingview-widget-copyright">
                <a href="https://cn.tradingview.com/symbols/HUOBI-BTCUSDT/" rel="noopener" target="_blank"><span class="blue-text">BTCUSDT图表</span></a>由TradingView提供</div>
                </div>
            <!-- TradingView Widget END -->`
    };
  },
  created() {},
  mounted() {
    let el = this.$el.querySelector(".tradingview-widget-container");
    let script1 = document.createElement("script");
    let script2 = document.createElement("script");
    script1.setAttribute("src", "https://s3.tradingview.com/tv.js");
    script2.innerHTML = `new TradingView.widget(
        {
        "width": 1200,
        "height": 700,
        "symbol": "HUOBI:BTCUSDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "Light",
        "style": "1",
        "locale": "zh_CN",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "hide_side_toolbar": false,
        "container_id": "tradingview_a57d4"
        });`;
    el.appendChild(script1);
    el.appendChild(script2);
  },
  computed: {
    ...mapState({}),
    ...mapGetters([])
  },
  methods: {}
};
</script>

