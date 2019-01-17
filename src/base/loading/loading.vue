<template>
    <div class="loading-img">
        <img src="./loading.gif" alt="">
    </div>
</template>

<script>
    export default {
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  .loading-img
    position: absolute
    padding: 30px 0
    left: 50%
    transform: translate3d(-50%, 0, 0)
    width: 8%
    z-index: 88
    & > img
      display: block
      width: 100%
</style>