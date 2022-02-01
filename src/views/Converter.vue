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

      <!-- <div class="fill"></div> -->

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

    <div class="chart-container">
      <span>График {{ currencyPairSpan }} за 14 дней</span>
      <LineChart class="chart" :chartDataProp="getChartData" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import LineChart from "@/components/LineChart.vue";
export default {
  name: "Home",
  components: { LineChart, VueSelect },
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
</style>

<style lang="sass" scoped>
.home
  display: flex
  flex-direction: column
  align-items: center

.inputs
  // display: flex
  // justify-content: space-between
  // flex-wrap: wrap
  > *
    display: inline-block
    margin: 0px 0px calc(2* $header-margin) 0px

.input-wrap
  display: flex
  // margin-bottom: 2px
  margin: 0 5px 2px
  input[type="number"]
    width: 140px
    text-align: right
    padding: 4px 9.5px 4px 0px
    // border: 1px solid rgba(60,60,60,.26)
    border: none
    // border-right: 1px solid rgba(60,60,60,0)
    border-radius: $border-radius
    border-top-right-radius: 0px
    border-bottom-right-radius: 0px
    font-size: inherit
    -moz-appearance: textfield
    margin-right: 2px
    &:focus-visible
      outline: none

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance: none
  margin: 0

// div.fill
//   width: 15px

.chart-container
  box-sizing: border-box
  width: 100vw
  @media screen and (min-width: 800px)
    width: 70vw

  > *
    border-radius: $border-radius
    padding: 16px 26px
    background: $bg-accent

  span
    // padding-top: 11px
    // padding-bottom: 10px
    padding: 10px 16px
    color: $color-alt
    font-weight: 600
    display: inline-block
    box-sizing: border-box
    width: 100%
    margin-bottom: 2px
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0

  .chart
    padding-left: 10px
    min-width: 270px
    height: 380px
    border-top-left-radius: 0
    border-top-right-radius: 0
</style>
