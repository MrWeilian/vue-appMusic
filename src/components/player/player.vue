<template>
    <div class="player" v-show="playlist.length>0" ref="player">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.image" alt="" width="100%" height="100%">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdRotate">
                                <img :src="currentSong.image" alt="" class="image">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progressBar :percent="percent" @percentChange="percentChange"></progressBar>
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i @click="togglePlaying" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right">
                            <i @click="next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="min">
            <div class="min-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <img :class="cdRotate" :src="currentSong.image" width="40" height="40" alt="">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progressCircle :radius="radius" :percent="percent">
                        <i @click.stop="togglePlaying" class="icon-min" :class="minPlayIcon"></i>
                    </progressCircle>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio :src="currentSong.url" 
                ref="Maudio" 
                @canplay="canplay" 
                @error="error"
                @timeupdate="timeUpDate"
                @ended="end"
        ></audio>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import animations from 'create-keyframe-animation'
    import progressBar from '../../base/progress-bar/progress-bar.vue'
    import progressCircle from '../../base/progress-circle/progress-circle.vue'
    import {playMode} from '../../common/js/config.js'
    import {shuffle} from '../../common/js/util.js'

    export default {
        data() {
            return {
                canClick: false,
                currentTime: 0,
                radius: 32
            }
        },
        computed: {
            cdRotate() {
                return this.playing ? 'play' : 'play pause'
            },
            playIcon() {
                return this.playing ? 'icon-pause' : 'icon-play'
            },
            minPlayIcon() {
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },
            percent() {
                return this.currentTime / this.currentSong.duration
            },
            iconMode() {
                return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
            },
            ...mapGetters([
                'fullScreen',
                'playlist',
                'currentSong',
                'playing',
                'currentIndex',
                'mode',
                'sequenceList'
            ])
        },
        methods: {
            back() {
                this.setFullScreen(false)    
            },
            open() {
                this.setFullScreen(true)
            },
            enter(el, done) {
                const {x, y, scale} = this._getPosAndScale()
                let animation = {
                    0: {
                        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0, 0, 0) scale(1.1)`
                    },
                    100: {
                        transform: `translate3d(0, 0, 0) scale(1)`
                    }
                }

                animations.registerAnimation({
                    name: 'move',
                    animation,
                    presets: {
                        duration: 400,
                        easing: 'linear'
                    }
                })

                animations.runAnimation(this.$refs.cdWrapper, 'move', done)
            },
            afterEnter() {
                animations.unregisterAnimation('move')
                this.$refs.cdWrapper.style.animation = ''
            },
            leave(el, done) {
                const {x, y, scale} = this._getPosAndScale()
                this.$refs.cdWrapper.style.transition = 'all .4s'
                this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
                this.$refs.cdWrapper.addEventListener('transitionend', done)
            },
            afterLeave() {
                this.$refs.cdWrapper.style.transition = ''
                this.$refs.cdWrapper.style.transform = ''
            },
            error() {
                this.canClick = true
            },
            canplay() {
                this.canClick = true
            },
            togglePlaying() {
                this.$refs.Maudio.play()
                this.setPlayingState(!this.playing)
            },
            prev() {
                if (!this.canClick) {
                    return
                }
                let index = this.currentIndex - 1
                if (index === -1) {
                    index = this.playlist.length - 1
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
                this.canClick = false
            },
            next() {
                if (!this.canClick) {
                    return
                }
                let index = this.currentIndex + 1
                if (index === this.playlist.length) {
                    index = 0
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
                this.canClick = false
            },
            loop() {
                this.$refs.Maudio.currentTime = 0
                this.$refs.Maudio.play()
            },
            end() {
                if (!this.mode === playMode.loop) {
                    this.loop()
                } else {
                    this.next()   
                }
            },
            timeUpDate(e) {
                this.currentTime = e.target.currentTime
            },
            format(interval) {
                interval = interval | 0
                const minute = interval/60 | 0
                const second = this._pad(interval % 60)
                return `${minute}:${second}`
            },
            percentChange(newPercent) {
                this.$refs.Maudio.currentTime = this.currentSong.duration * newPercent
                if (!this.playing) {
                    this.setPlayingState(!this.playing)
                }
            },
            changeMode() {
                const mode = (this.mode + 1) % 3
                this.setPlayMode(mode)
                let list = null
                if (mode === playMode.random) {
                    list = shuffle(this.sequenceList)
                } else {
                    list = this.sequenceList
                }
                this.resetCurrentIndex(list)
                this.setPlaylist(list)
            },
            resetCurrentIndex(list) {
                let index = list.findIndex((item) => {
                    return item.id === this.currentSong.id
                })
                this.setCurrentIndex(index)
            },
            _pad(num, n=2) {
                let length = num.toString().length
                while (length < n) {
                    num = '0' + num
                    length++
                }
                return num
            },
            _getPosAndScale() {
                const minWidth = 40
                const minOriginLeft = 20
                const minOriginBottom = 30
                const normalTop = 80
                const normalWidth = window.innerWidth * 0.8
                const scale = minWidth/normalWidth
                const x = -(window.innerWidth/2 - minOriginLeft)
                const y = window.innerHeight - minOriginBottom - normalWidth/2
                return {
                    x,
                    y,
                    scale
                }
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
                setPlayingState: 'SET_PLAYING_STATE',
                setCurrentIndex: 'SET_CURRENT_INDEX',
                setPlayMode: 'SET_PLAY_MODE',
                setPlaylist: 'SET_PLAYLIST'
            })
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (newSong.id === oldSong.id) {
                    return
                }
                this.$nextTick(() => {
                    this.$refs.Maudio.play()
                })
            },
            playing(newPlaying) {
                let Maudio = this.$refs.Maudio
                this.$nextTick(() => {
                    newPlaying ? Maudio.play() : Maudio.pause()
                })
            }
        },
        components: {
            progressBar,
            progressCircle
        }
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable.styl'

  .player
    .normal-player
      position: fixed
      top: 0
      left: 0
      bottom: 0
      right: 0
      z-index: 88
      background: $color-theme
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        filter: blur(20px) grayscale(80%)
      .top
        position: absolute
        top: 0
        width: 100%
        .back
          position: absolute
          transform: rotate(-90deg)
          left: 6px
          padding: 8px
          .icon-back
            font-size: $font-size-large-x
        .title
          height: 40px
          line-height: 40px
          text-align: center
          text-overflow: ellipsis
          overflow: hidden
          white-space: nowrap
          font-size: $font-size-large
          font-weight: 700
        .subtitle
          height: 20px
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
      .middle
        position: fixed
        top: 80px
        bottom: 170px
        width: 100%
        white-space: nowrap
        font-size: 0
        .middle-l
          position: relative
          width: 100%
          padding-top: 80%
          height: 0
          .cd-wrapper
            position: absolute
            top: 0
            left: 10%
            width: 80%
            box-sizing: border-box
            height: 100%
            border: 8px solid $color-highlight-background
            border-radius: 50%
            .cd
              width: 100%
              height: 100%
              &.play
                animation: rotate 20s linear infinite                
              &.pause
                animation-play-state: paused
              .image
                width: 100%
                height: 100%
                border-radius: 50%
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .progress-wrapper
          display: flex
          width: 80%
          padding: 10px 0
          margin: 0 auto
          .time
            flex: 0 0 30px
            width: 30px
            line-height: 30px
            text-align: center
            font-size: $font-size-small
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          justify-content: space-around
          align-items: center
          .icon
            font-size: 30px
          .icon-play, .icon-pause
            font-size: 40px
    .min-player
      position: fixed
      left: 0
      bottom: 0
      width: 100%
      height: 60px
      display: flex
      align-items: center
      background: $color-theme-g
      color: $color-text-ll
      z-index: 100
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        border-radius: 50%
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite                
          &.pause
            animation-play-state: paused
      .text
        flex: 1
        line-height: 20px
        .name,.desc
          margin-bottom: 2px
          text-overflow: ellipsis
          white-space: nowrap
          overflow: hidden
          font-size: $font-size-medium
          color: #fff
        .desc
          color: $color-text-ll
          font-size: $font-size-small
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        font-size: 26px
        .icon-min
          position: absolute
          font-size: 32px
          left: 0
          top: 0
          color: $color-theme-slider-g


  .normal-enter-active, .normal-leave-active
    transition: all .4s
    .top, .bottom
      transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  .normal-enter, .normal-leave-to
    opacity: 0
    .top
      transform: translate3d(0, -100px, 0)
    .bottom
      transform: translate3d(0, 100px, 0)

  .min-enter-active, .min-leave-active
    transition: all .4s
  .min-enter, .min-leave-to
    opacity: 0
    transform: translate3d(0, 100%, 0)

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>