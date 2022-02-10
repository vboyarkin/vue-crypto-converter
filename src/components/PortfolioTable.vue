<template>
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
</template>

<script>
import PortfolioEntry from "@/components/PortfolioEntry.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    PortfolioEntry,
  },
  computed: {
    ...mapGetters(["portfolio", "portfolioData"]),
  },
};
</script>

<style lang="sass" scoped></style>
