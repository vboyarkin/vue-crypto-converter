<template>
  <div>
    <div v-if="coinData" class="portfolio-entry">
      <img :src="coinData.image.small" alt="" />
      <span class="name">{{ coinData.localization.ru }}</span>
      <span class="price">{{ coinData.market_data.current_price.usd }}</span>
      <span class="price_change_percentage_24h">{{
        coinData.market_data.price_change_percentage_24h
      }}</span>
      <span class="price_change_percentage_7d">{{
        coinData.market_data.price_change_percentage_7d
      }}</span>
      <span class="market_cap">{{ coinData.market_data.market_cap.usd }}</span>
      coinData.market_data.sparkline_7d
    </div>

    <div v-else class="portfolio-entry-loader">
      <span>Загрузка...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currency", "coinData"],
};
</script>

<style lang="sass" scoped>
</style>