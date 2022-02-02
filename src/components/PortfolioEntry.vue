<template>
  <tbody
    v-if="coinData"
    class="portfolio-entry"
    v-on:keyup.esc.prevent="addClear"
  >
    <tr>
      <td class="add">
        <div class="wrap">
          <button
            :class="{ 'selected-action': isAddingPlus }"
            @click="add('+')"
          >
            +
          </button>
          <button
            :class="{ 'selected-action': isAddingMinus }"
            @click="add('-')"
          >
            −
          </button>
        </div>
      </td>
      <td class="name add-form">
        <form class="add-form" v-show="isAdding">
          <input
            type="number"
            v-model="addValue"
            :ref="`add_input_${currency.apiId}`"
          />
          <div class="wrap">
            <button
              :class="{ disabled: !canSubmit }"
              type="submit"
              @click.prevent="addSubmit"
            >
              ✓
            </button>
            <button @click.prevent="addClear">×</button>
          </div>
        </form>

        <div class="name-wrap">
          <img :src="coinData.image.thumb" alt="" />
          <span class="name">{{ coinData.name }}</span>
        </div>
      </td>
      <td>
        <div class="holdings">
          <span>{{ holdingsCrypto }}</span>
          <span>{{ holdingsUsd }}</span>
        </div>
      </td>
      <td class="right">
        <span class="price">{{ price }} $</span>
      </td>
      <td class="right">
        <span class="price-change" :class="{ decreased: priceChange24h < 0 }"
          >{{ priceChange24h }}%</span
        >
      </td>
      <td class="right">
        <span class="price-change" :class="{ decreased: priceChange7d < 0 }"
          >{{ priceChange7d }}%</span
        >
      </td>
      <td class="right">
        <span class="market_cap">{{ marketCap }} $</span>
      </td>
      <td>
        <LineChart
          class="chart"
          :chartDataProp="sparklineData"
          :displayTooltip="false"
          :displayAxes="false"
          :displayGrid="false"
          :fillSpaceUnderLine="false"
          :lineColor="sparklineColor"
        />
      </td>
    </tr>
  </tbody>

  <tbody v-else class="portfolio-entry-loader">
    <tr>
      <td colspan="8"><Loader /></td>
    </tr>
  </tbody>
</template>

<script>
import LineChart from "./LineChart.vue";
import sassVariables from "@/assets/styles/_variables.sass";
import { mapActions } from "vuex";
import { round } from "@/assets/utils.js";
import Loader from "./Loader.vue";

export default {
  components: { LineChart, Loader },
  props: ["currency", "coinData"],
  data() {
    return {
      isAdding: false,
      addAction: "",
      addValue: "",
    };
  },
  computed: {
    price() {
      return this.coinData.market_data.current_price.usd.toLocaleString(
        "ru-RU",
        { minimumFractionDigits: 2 },
        { maximumFractionDigits: 2 }
      );
    },
    priceChange24h() {
      return (
        Math.round(this.coinData.market_data.price_change_percentage_24h * 10) /
        10
      );
    },
    priceChange7d() {
      return (
        Math.round(this.coinData.market_data.price_change_percentage_7d * 10) /
        10
      );
    },
    marketCap() {
      return this.coinData.market_data.market_cap.usd.toLocaleString("ru-RU");
    },
    holdingsCrypto() {
      return (
        this.currency.value.toLocaleString("ru-RU", {
          maximumFractionDigits: 12,
        }) +
        " " +
        this.currency.label
      );
    },
    holdingsUsd() {
      return (
        round(
          this.currency.value * this.coinData.market_data.current_price.usd
        ).toLocaleString("ru-RU", {
          maximumFractionDigits: 6,
        }) + " $"
      );
    },
    sparklineData() {
      const prices = this.coinData.market_data.sparkline_7d.price;

      let X = [];
      for (let i = 0; i < prices.length; i++) {
        X[i] = i + 1;
      }

      return {
        X,
        Y: prices,
      };
    },
    sparklineColor() {
      if (this.priceChange7d < 0) return sassVariables.colorDecrease;

      return sassVariables.colorIncrease;
    },
    canSubmit() {
      return this.addValue !== "";
    },
    isAddingPlus() {
      return this.isAdding && this.addAction === "+";
    },
    isAddingMinus() {
      return this.isAdding && this.addAction === "-";
    },
  },
  methods: {
    ...mapActions(["addValueToPortfolio"]),
    add(addAction) {
      this.isAdding = true;
      this.addAction = addAction;
      this.$nextTick(() => {
        this.$refs[`add_input_${this.currency.apiId}`].focus();
      });
    },
    addSubmit() {
      if (this.addValue === "") return;

      const value = Number(
        (this.addAction + this.addValue).replaceAll("+-", "-")
      );

      this.addValueToPortfolio({ apiId: this.currency.apiId, value });

      this.addValue = "";
      this.isAdding = false;
    },
    addClear() {
      this.addValue = "";
      this.isAdding = false;
    },
  },
};
</script>

<style lang="sass" scoped>
button
  cursor: pointer
  padding: 7px 10px
  background: #00000000
  border: none
  color: $color-alt
  font-size: 1.2rem
  &:hover
    animation: $animation-shadow, bg-hover .10s linear forwards

span.name
  font-weight: 600
  color: #0e1419
  position: relative
  top: 1px

td.name
  *
    vertical-align: middle
  div.name-wrap
    white-space: nowrap

span.price-change
  color: $color-increase
span.decreased
  color: $color-decrease

.holdings
  span
    display: block

.chart
  height: 60px
  max-width: 220px

img
  width: 24px
  padding: 0 13px 0 0

td.add
  padding: 0
  .wrap
    display: flex
    flex-direction: column
    button
      &.selected-action
        background: $bg-hover
        animation: shadow .10s linear forwards
      &:first-child
        border-top-left-radius: $border-radius
      &:last-child
        border-bottom-left-radius: $border-radius

td.add-form
  position: relative

form.add-form
  background: $bg-accent
  position: absolute
  display: flex
  top: 0
  left: 0
  height: 100%
  animation: shadow .15s linear forwards
  z-index: 999
  border-top-right-radius: $border-radius
  border-bottom-right-radius: $border-radius
  .wrap
    display: flex
    flex-direction: column
    button
      padding: 7px 8.5px
      background: $bg-accent
      border: none
      color: $color-alt
      font-size: 1.2rem
      &:first-child
        padding-top: 5px
        padding-bottom: 5px
        border-top-right-radius: $border-radius
      &:last-child
        border-bottom-right-radius: $border-radius
      &:hover
        background: $bg-hover
      &[type="submit"].disabled
        cursor: not-allowed
        background: $bg-accent
        animation: none
        color: $color-inactive

  input
    border: none
    width: calc(100% - 30px)
    height: 100%
    box-sizing: border-box
    padding: 10px 4px 9px 10px
    font-size: .9rem
    &:focus-visible
      outline: none

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance: none
  margin: 0

.portfolio-entry-loader
  td
    text-align: center
    height: 60px
</style>
