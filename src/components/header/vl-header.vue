<template>
  <div class="header-wrapper">
    <div class="header">
      <div class="avatar"></div>
      <h1 class="title">BouBou</h1>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable.styl'

  .header-wrapper
    position: relative
    height: 44px
    font-size: 0
    .header
      display: flex
      justify-content: center
      align-items: center
      .title
        line-height: 44px
        color: $color-text
        text-align: center
        font-size: $font-size-large
      .avatar
        width: 30px
        height: 30px
        margin-right: 10px
        background-image: url('../../common/image/default.png')
        background-size: 100%
</style>
