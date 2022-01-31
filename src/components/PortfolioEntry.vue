<template>
  <tbody v-if="coinData" class="portfolio-entry">
    <tr>
      <td class="name">
        <img :src="coinData.image.thumb" alt="" />
        <span class="name">{{ coinData.name }}</span>
      </td>
      <td>
        <div class="holdings">
          <span>{{ holdingsCrypto }}</span>
          <span>{{ holdingsUsd }}</span>
        </div>
      </td>
      <td class="right">
        <span class="price"
          >{{ coinData.market_data.current_price.usd }} $</span
        >
      </td>
      <td class="right">
        <span class="price-change" :class="{ decreased: priceChange24h < 0 }"
          >{{ priceChange24h }}%</span
        >
      </td>
      <td class="right">
        <span class="price-change" :class="{ decreased: priceChange7d < 0 }"
          >{{ priceChange7d }}%</span
        >
      </td>
      <td>
        <span class="market_cap">{{ marketCap }} $</span>
      </td>
      <td>
        <Chart
          class="chart"
          :chartDataProp="sparklineData"
          :displayTooltip="false"
          :displayAxes="false"
          :displayGrid="false"
          :fillSpaceUnderLine="false"
        />
      </td>
    </tr>
  </tbody>

  <tbody v-else class="portfolio-entry-loader">
    <tr>
      <span>Загрузка...</span>
    </tr>
  </tbody>
</template>

<script>
import Chart from "./Chart.vue";
export default {
  components: { Chart },
  props: ["currency", "coinData"],
  computed: {
    priceChange24h() {
      return (
        Math.round(this.coinData.market_data.price_change_percentage_24h * 10) /
        10
      );
    },
    priceChange7d() {
      return (
        Math.round(this.coinData.market_data.price_change_percentage_7d * 10) /
        10
      );
    },
    marketCap() {
      return this.coinData.market_data.market_cap.usd.toLocaleString("ru-RU");
    },
    holdingsCrypto() {
      return this.currency.value + " " + this.currency.label;
    },
    holdingsUsd() {
      return (
        this.currency.value * this.coinData.market_data.current_price.usd + " $"
      );
    },
    sparklineData() {
      const prices = this.coinData.market_data.sparkline_7d.price;
      // let res = [];
      let X = [];
      for (let i = 0; i < prices.length; i++) {
        X[i] = i + 1;
      }

      return {
        X,
        Y: prices,
      };
    },
  },
};
</script>

<style lang="sass" scoped>
span.name
  font-weight: 600
  color: #0e1419
  position: relative
  top: 1px

span.price-change
  color: #4eaf0a
span.decreased
  color: #e15241

.holdings
  span
    display: block

.chart
  height: 60px

td.name *
  vertical-align: middle

img
  width: 24px
  padding: 0 13px 0 0
</style>
