<template>
  <div class="loader">
    <span>Загрузка...</span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.loader
  animation: $animation-pulse-loader
  vertical-align: middle
  span
    display: inline-flex
    align-items: center
    height: 100%
    margin-top: auto
</style>
