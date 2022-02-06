<template>
  <div class="card-container">
    <div v-if="!inversed" class="head-wrap" :class="{ round: squashToHead }">
      <span class="head">
        <slot name="head"></slot>
      </span>
    </div>
    <div v-if="!squashToHead" class="card-wrap">
      <slot name="main-content"></slot>
    </div>
    <div v-if="inversed" class="head-wrap" :class="{ round: squashToHead }">
      <span class="head">
        <slot name="head"></slot>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inversed: {
      default: false,
    },
    squashToHead: {
      default: false,
    },
  },
};
</script>

<style lang="sass" scoped>
.card-container
  width: fit-content

  >*:first-child
    margin-bottom: 2px
    border-top-left-radius: $border-radius
    border-top-right-radius: $border-radius

  >*:nth-child(2)
    border-bottom-left-radius: $border-radius
    border-bottom-right-radius: $border-radius

  > *
    width: 100%
    background: $bg-accent

  .head
    color: $color-alt
    font-weight: 600
    font-size: inherit
    display: inline-block
    padding: 10px 16px

  .round
    border-radius: $border-radius
</style>
