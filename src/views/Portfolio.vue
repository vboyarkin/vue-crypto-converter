<template>
  <div class="portfolio">
    <div class="doughnut-chart-container">
      <CardWithHead :inversed="true" :squashToHead="isPortfolioEmpty">
        <template v-slot:main-content>
          <Loader v-if="isLoadingPortfolioData" class="loader" />
          <DoughnutChart
            v-if="!isLoadingPortfolioData && doughnutChartData"
            class="doughnut-chart"
            :chartDataProp="doughnutChartData"
          />
        </template>

        <template v-slot:head class="round">
          Стоимость портфеля: {{ totalHoldings }}
        </template>
      </CardWithHead>
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
import Loader from "@/components/Loader.vue";
import CardWithHead from "@/components/CardWithHead.vue";

export default {
  data() {
    return { isLoadingPortfolioData: true };
  },
  components: {
    PortfolioEntry,
    DoughnutChart,
    Loader,
    CardWithHead,
  },
  computed: {
    ...mapGetters(["portfolio", "portfolioData", "doughnutChartData"]),
    isPortfolioEmpty() {
      if (!this.portfolio) return true;

      return this.portfolio.reduce((acc, cur) => acc + cur.value, 0) === 0;
    },
    totalHoldings() {
      if (this.isPortfolioEmpty) return 0;

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
  },
  methods: {
    ...mapActions(["fetchPortfolioData", "fetchPortfolio"]),
  },
  mounted() {
    this.fetchPortfolio();
    this.fetchPortfolioData().then(() => (this.isLoadingPortfolioData = false));
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

.doughnut-chart-container .loader span
  min-height: 250px
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
  margin-bottom: $header-margin
  .doughnut-chart
    margin-right: auto
    margin-left: auto
    max-width: 250px
</style>
