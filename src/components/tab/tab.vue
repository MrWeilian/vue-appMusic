<template>
    <div class="tab-wrapper">
        <nav class="tab-nav">
            <router-link class="nav-item" to="/recommend">
                <span class="nav-text">推荐</span>
            </router-link>
            <router-link class="nav-item" to="/singer">
                <span class="nav-text">歌手</span>
            </router-link>
            <router-link class="nav-item" to="/rank">
                <span class="nav-text">排行</span>
            </router-link>
            <router-link class="nav-item" to="/search">
                <span class="nav-text">搜索</span>
            </router-link>
        </nav>
    </div>
</template>

<script>
    export default {
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable.styl'

  .tab-wrapper
    .tab-nav
      display: flex
      font-size: 0
      .nav-item
        flex: 1
        display: inline-block
        line-height: 44px
        text-align: center
        font-size: $font-size-medium
        color: $color-text-d
        &.router-link-active
          .nav-text
            padding-bottom: 5px
            color: $color-background
            border-bottom: 2px solid $color-background
</style>