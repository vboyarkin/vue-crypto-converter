<template>
  <div class="portfolio">
    <div class="total-holdings-wrap">
      <span class="total-holdings">
        Стоимость портфеля: {{ totalHoldings }}
      </span>
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
import PortfolioEntry from "../components/PortfolioEntry.vue";
export default {
  components: { PortfolioEntry },
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
  },
  methods: {
    ...mapActions(["fetchPortfolioData"]),
  },
  mounted() {
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

  .total-holdings
    display: inline-block
    border-radius: $border-radius
    padding: 10px 16px
    background: $bg-accent
    font-weight: 600
</style>
