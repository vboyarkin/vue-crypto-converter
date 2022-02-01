<template>
  <div class="home">
    <div class="inputs">
      <div class="input-wrap">
        <input type="number" v-model="baseVal" />
        <VueSelect
          :clearable="false"
          class="vue-select"
          @input="onBaseCurrencyChange"
          :options="currencyOptions[0]"
          :value="baseCurrency"
        />
      </div>

      <div class="fill"></div>

      <div class="input-wrap">
        <input type="number" v-model="counterVal" />
        <VueSelect
          :clearable="false"
          class="vue-select"
          @input="onCounterCurrencyChange"
          :options="currencyOptions[1]"
          :value="counterCurrency"
        />
      </div>
    </div>
    <span>{{ currencyPairSpan }}</span>
    <Chart class="chart" :chartDataProp="getChartData" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Chart from "@/components/Chart.vue";
export default {
  name: "Home",
  components: { Chart, VueSelect },
  computed: {
    ...mapGetters([
      "baseCurrency",
      "baseValue",
      "counterCurrency",
      "counterValue",
      "currencyOptions",
      "getChartData",
    ]),
    currencyPairSpan() {
      return this.baseCurrency.label + "/" + this.counterCurrency.label;
    },
    baseVal: {
      get() {
        return this.baseValue;
      },
      set(val) {
        this.updateBaseValue(val);
      },
    },
    counterVal: {
      get() {
        return this.counterValue;
      },
      set(val) {
        this.updateCounterValue(val);
      },
    },
  },
  methods: {
    ...mapActions([
      "selectBaseCurrency",
      "selectCounterCurrency",
      "fetchChart",
      "updateCounterValue",
    ]),
    ...mapMutations(["updateBaseValue"]),
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

<style lang="sass">
.vue-select
  width: 160px
  > div[role="combobox"]
    border-top-left-radius: 0px
    border-bottom-left-radius: 0px
</style>

<style lang="sass" scoped>
.home
  display: flex
  flex-direction: column
  align-items: center

.inputs
  display: flex
  justify-content: space-between
  flex-wrap: wrap
  margin: 0px 0px 16px 0px

.input-wrap
  display: flex
  margin-bottom: 4px
  input[type="number"]
    width: 140px
    text-align: right
    padding: 4px 9.5px 4px 0px
    border: 1px solid rgba(60,60,60,.26)
    border-right: 1px solid rgba(60,60,60,0)
    border-radius: 4px
    border-top-right-radius: 0px
    border-bottom-right-radius: 0px
    font-size: inherit
    -moz-appearance: textfield
    &:focus-visible
      outline: none

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance: none
  margin: 0

div.fill
  width: 15px

.chart
  min-width: 270px
  height: 380px
  width: 100vw
  @media screen and (min-width: 700px)
    width: 70vw
</style>
