<template>
  <div class="home">
    <span>{{ currencyPairSpan }}</span>
    <Chart class="chart" />
  </div>
</template>

<script>
import Chart from "@/components/Chart.vue";
import { mapGetters } from "vuex";
export default {
  name: "Home",
  components: { Chart },
  computed: {
    ...mapGetters(["currencyPair"]),
    currencyPairSpan() {
      if (!this.currencyPair) return "";

      return this.currencyPair.map((p) => p[0]).join("/");
    },
  },
};
</script>

<style lang="sass" scoped>
.chart
  width: 70vw
  height: 300px
</style>
