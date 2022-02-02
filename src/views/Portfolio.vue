<template>
  <div class="portfolio">
    <div class="doughnut-chart-container">
      <div class="doughnut-chart-wrap">
        <DoughnutChart
          v-if="doughnutChartData"
          class="doughnut-chart"
          :chartDataProp="doughnutChartData"
          :borderColor="doughnutBorderColor"
        />
        <div v-else class="doughnut-loader"><span>Загрузка...</span></div>
      </div>
      <div class="total-holdings-wrap">
        <span class="total-holdings">
          Стоимость портфеля: {{ totalHoldings }}
        </span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th colspan="2">
            <span class="name">Монета</span>
          </th>
          <th>
            <span>Активы</span>
          </th>
          <th class="center">
            <span>Цена</span>
          </th>
          <th class="center">
            <span>24 ч</span>
          </th>
          <th class="center">
            <span>7 д</span>
          </th>
          <th>
            <span>Рыночная кап-ция</span>
          </th>
          <th><span>Цена за последние 7 дней</span></th>
        </tr>
      </thead>

      <PortfolioEntry
        v-for="(currency, i) of portfolio"
        :key="i"
        :currency="currency"
        :coinData="portfolioData[currency.apiId]"
      />
    </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import DoughnutChart from "@/components/DoughnutChart.vue";
import PortfolioEntry from "@/components/PortfolioEntry.vue";
import { colors } from "@/assets/utils.js";

export default {
  components: { PortfolioEntry, DoughnutChart },
  computed: {
    ...mapGetters(["portfolio", "portfolioData"]),
    totalHoldings() {
      let sum = 0;

      for (const cur of this.portfolio) {
        if (!this.portfolioData[cur.apiId]) return "";

        sum +=
          cur.value *
          this.portfolioData[cur.apiId].market_data.current_price.usd;
      }
      return (
        sum.toLocaleString("ru-RU", {
          maximumFractionDigits: 2,
        }) + " $"
      );
    },
    doughnutChartData() {
      const X = [];
      const Y = [];

      for (const cur of this.portfolio) {
        if (!this.portfolioData[cur.apiId]) continue;
        if (!cur.value) return null;

        const usd = this.portfolioData[cur.apiId].market_data.current_price.usd;
        X.push(cur.label);
        Y.push(cur.value * usd);
      }

      return { X, Y, colors };
    },
  },
  methods: {
    ...mapActions(["fetchPortfolioData", "fetchPortfolio"]),
  },
  mounted() {
    this.fetchPortfolio();
    this.fetchPortfolioData();
  },
};
</script>

<style lang="sass">
span
  white-space: nowrap

table
  margin-left: auto
  margin-right: auto

td, th
  text-align: left
  padding: 5px 12px
  background: $bg-accent
  border-radius: 1px

  &:first-child
    border-top-left-radius: $border-radius
    border-bottom-left-radius: $border-radius
    border-collapse: collapse
    border-right: none
    border-spacing: 0
  &:last-child
    border-top-right-radius: $border-radius
    border-bottom-right-radius: $border-radius

.center
  text-align: center
.right
  text-align: right
</style>

<style lang="sass" scoped>
thead
  span
    color: $color-alt
    font-weight: 600
    font-size: .90rem
  th
    padding: 10px 14px 9px 16px
    text-align: center

span.name
  padding: 0 0 0 14px

.total-holdings-wrap
  margin-bottom: $header-margin
  border-bottom-left-radius: $border-radius
  border-bottom-right-radius: $border-radius
  background: $bg-accent
  width: 100%

  .total-holdings
    display: inline-block
    padding: 10px 16px
    font-weight: 600

.doughnut-chart-container
  width: fit-content
  margin-right: auto
  margin-left: auto

  .doughnut-chart-wrap
    width: auto
    background: $bg-accent
    border-top-left-radius: $border-radius
    border-top-right-radius: $border-radius
    margin-bottom: 2px
    .doughnut-chart
      margin-right: auto
      margin-left: auto
      max-width: 250px
    .doughnut-loader
      animation: $animation-pulse-loader
      vertical-align: middle
      span
        display: inline-flex
        align-items: center
        min-height: 250px
        margin-top: auto
</style>
