<template>
  <div class="home">
    <div class="inputs">
      <div>
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
      </div>

      <div>
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
    </div>

    <CardWithHead class="chart-container">
      <template v-slot:head>График {{ currencyPairSpan }} за 14 дней</template>
      <template v-slot:main-content>
        <LineChart
          v-if="getChartData"
          class="chart"
          :chartDataProp="getChartData"
        />
        <Loader v-else class="loader" />
      </template>
    </CardWithHead>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Loader from "@/components/Loader.vue";
import LineChart from "@/components/LineChart.vue";
import CardWithHead from "@/components/CardWithHead.vue";
export default {
  name: "Home",
  components: { LineChart, VueSelect, Loader, CardWithHead },
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
    border: none
    background: $bg-accent
    border-radius: $border-radius
    border-top-left-radius: 0px
    border-bottom-left-radius: 0px
  svg[role="presentation"]
    fill: $color-inactive
  .vs__selected
    color: $color-alt
  .vs__dropdown-menu
    box-shadow: $shadow
    border: none

.chart-container
  margin-bottom: $header-margin
  box-sizing: border-box
  width: 100vw !important
  @media screen and (min-width: 800px)
    width: 70vw !important

  .chart, .loader
    padding: 16px 26px 16px 10px
    min-width: 270px
    height: 380px
</style>

<style lang="sass" scoped>
.home
  display: flex
  flex-direction: column
  align-items: center

.inputs
  > *
    display: inline-block
    margin: 0px 0px calc(2* $header-margin) 0px

.input-wrap
  display: flex
  margin: 0 5px 2px
  input[type="number"]
    width: 140px
    text-align: right
    padding: 4px 9.5px 4px 0px
    border: none
    border-radius: $border-radius
    border-top-right-radius: 0px
    border-bottom-right-radius: 0px
    font-size: inherit
    -moz-appearance: textfield
    margin-right: 2px
    &:focus-visible
      animation: $animation-shadow
      outline: none

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance: none
  margin: 0
</style>
