<template>
  <div class="portfolio">
    <span>Total balance usd:</span>
    <table>
      <thead>
        <tr>
          <th>
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
          <th><span>Последние 7 дней</span></th>
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
td, th
  text-align: left
  padding: 5px 12px
  background: #fff
  border-radius: 1px

  &:first-child
    border-top-left-radius: 6px
    border-bottom-left-radius: 6px
    border-collapse: collapse
    border-right: none
    border-spacing: 0
  &:last-child
    border-top-right-radius: 6px
    border-bottom-right-radius: 6px

.center
  text-align: center
.right
  text-align: right
</style>

<style lang="sass" scoped>
thead
  span
    color: #4a4a4a
    font-weight: 600
    font-size: .90em
  th
    padding: 10px 14px 9px 16px
    text-align: center

span.name
  padding: 0 0 0 14px
</style>
