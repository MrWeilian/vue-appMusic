<template>
  <div id="app">
    <header class="head-top">
      <vlHeader></vlHeader>
      <tab></tab>
    </header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import vlHeader from './components/header/vl-header.vue'
  import Tab from './components/tab/tab.vue'
  import player from './components/player/player.vue'

  export default {
    name: 'App',
    components: {
      vlHeader,
      Tab,
      player
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/variable.styl'

  .head-top
    box-shadow: 1px 4px 4px $color-theme-slider
</style>
