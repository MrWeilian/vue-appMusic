<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="styBgImg" ref="bgI">
            <div class="filter"></div>
            <div class="random-btn" v-show="songs.length>0" ref="randomBtn" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
            </div>
        </div>
        <loading v-show="songs.length===0"></loading>
        <div class="layler" ref="layler"></div>
        <scroll class="list" 
                :data="songs" 
                ref="list"
                :probeType="probeType"
                :listenScroll="listenScroll"
                @scroll="scrollNow"
        >
            <div class="song-list-wrapper">
                <song-list :songs="songs" @select="selectItem"></song-list>
            </div>
        </scroll>
    </div>
</template>

<script>
    import scroll from '../../base/scroll/scroll.vue'
    import songList from '../song-list/song-list.vue'
    import loading from '../../base/loading/loading.vue'
    import {mapActions} from 'vuex'

    const HEADER_HEIGHT = 40

    export default {
        props: {
            bgImage: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                probeType: 3,
                listenScroll: true
            }
        },
        mounted() {
            this.maxLaylerHeight = this.$refs.bgI.offsetHeight - HEADER_HEIGHT
            this.bgioffsetHieght = this.$refs.bgI.offsetHeight
            this.$refs.list.$el.style.top = `${this.$refs.bgI.offsetHeight}px`
        },
        computed: {
            styBgImg() {
                return `background-image: url(${this.bgImage})`
            }
        },
        components: {
            scroll,
            songList,
            loading
        },
        methods: {
            scrollNow(pos) {
                let zIndex = 0
                let scale = 1
                let translateY = Math.max(-this.maxLaylerHeight, pos.y)
                this.$refs.layler.style.transform = `translate3d(0, ${translateY}px, 0)`
                this.$refs.layler.style['webkitTransform'] = `translate3d(0, ${translateY}px, 0)`
                if (pos.y <= -this.maxLaylerHeight) {
                    zIndex = 6
                    this.$refs.bgI.style.paddingTop = 0
                    this.$refs.bgI.style.height = 40 + 'px'
                    this.$refs.randomBtn.style.display = 'none'
                } else {
                    this.$refs.bgI.style.paddingTop = '70%'
                    this.$refs.bgI.style.height = 0
                    this.$refs.randomBtn.style.display = 'block'
                }
                const percent = Math.abs(pos.y / this.bgioffsetHieght)
                if (pos.y > 0){
                    scale = 1 + percent
                }
                this.$refs.bgI.style.zIndex = zIndex
                this.$refs.bgI.style.transform = `scale(${scale})`
                this.$refs.bgI.style['webkitTransform'] = `scale(${scale})`
            },
            back() {
                this.$router.back()
            },
            selectItem(item, index, e) {
                this.selectPlay({
                    list: this.songs,
                    index
                })
            },
            random() {
                this.randomPlay({
                    list: this.songs
                })
            },
            ...mapActions([
                'selectPlay',
                'randomPlay'
            ])
        }
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable.styl'

  .music-list
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 10
    color: #fff
    background: $color-theme
    .layler
      position: relative
      height: 100%
      background: $color-theme
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 10
      .icon-back
        display: inline-block
        padding: 10px
        color: $color-text
        font-size: $font-size-large-x
    .title
      position: absolute
      top: 0
      width: 100%
      height: 40px
      line-height: 40px
      text-align: center
      z-index: 8
      font-size: $font-size-large
      color: $color-text-l
    .bg-image
      position: relative
      width: 100%
      padding-top: 70%
      height: 0
      transform-origin: top
      background-repeat: no-repeat
      background-size: cover
      box-shadow: 1px 4px 4px $color-theme-g
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.3)
      .random-btn
        position: absolute
        padding: 2px 16px
        left: 50%
        transform: translate3d(-50%, 0, 0)
        height: 32px
        line-height: 32px
        text-align: center
        bottom: 20px
        background: rgba(0, 0, 0, 0.5)
        border: 1px solid $color-text
        border-radius: 100px
        color: $color-text-l
        font-size: $font-size-small
        .icon-play
          margin-right: 6px
          font-weight: 700
        .text
          font-weight: 700
    .list
      position: absolute
      left: 0
      right: 0
      bottom: 0
      .song-list-wrapper
        padding: 20px 30px 60px 30px
</style>