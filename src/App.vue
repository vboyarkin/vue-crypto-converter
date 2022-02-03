<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Конвертер</router-link>
      <router-link to="/Portfolio">Портфель</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="sass">
body
  background: $bg

#app
  font-family: $main-font
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

#nav
  padding: 30px

  a
    background: $bg-accent
    padding: 10px 14px 10px 16px
    color: $color-alt
    text-decoration: none
    @include shadow-transition-after

    &:first-child
      margin-right: 2px
      border-top-left-radius: $border-radius
      border-bottom-left-radius: $border-radius

    &:nth-child(2)
      border-top-right-radius: $border-radius
      border-bottom-right-radius: $border-radius

    &.router-link-exact-active
      box-shadow: $shadow
      @include shadow-transition-after-cancel
      font-weight: bold
</style>
