<template>
  <div class="portfolio">
    <span>Total balance usd:</span>
    <div v-for="(currency, i) of portfolio" :key="i">
      <PortfolioEntry
        :currency="currency"
        :coinData="portfolioData[currency.apiId]"
      />
    </div>
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

<style lang="sass" scoped>
</style>
