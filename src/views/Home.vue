<template>
  <div class="home">
    <VueSelect
      @input="onBaseCurrencyChange"
      :options="currencyOptions[0]"
      :value="baseCurrency"
    />
    <VueSelect
      @input="onCounterCurrencyChange"
      :options="currencyOptions[1]"
      :value="counterCurrency"
    />
    <span>{{ currencyPairSpan }}</span>
    <Chart class="chart" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Chart from "@/components/Chart.vue";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  components: { Chart, VueSelect },
  computed: {
    ...mapGetters(["baseCurrency", "counterCurrency", "currencyOptions"]),
    currencyPairSpan() {
      return this.baseCurrency.label + "/" + this.counterCurrency.label;
    },
  },
  methods: {
    ...mapActions([
      "selectBaseCurrency",
      "selectCounterCurrency",
      "fetchChart",
    ]),
    onBaseCurrencyChange(currency) {
      this.selectBaseCurrency(currency);
    },
    onCounterCurrencyChange(currency) {
      this.selectCounterCurrency(currency);
    },
  },
  async mounted() {
    await this.fetchChart();
  },
};
</script>

<style lang="sass" scoped>
.chart
  width: 70vw
  height: 300px
</style>
