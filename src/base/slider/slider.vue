<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span v-for="(item, index) in dots" :key="index" class="dot" :class="{active: index === currentPageIndex}"></span>
        </div>
    </div>
</template>

<script>
    import Bscroll from 'better-scroll'
    import {addClass} from '../../common/js/dom.js'

    export default {
        props: {
            loop: {
                type: Boolean,
                default: true
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            interval: {
                type: Number,
                default: 4000
            }
        },
        data() {
            return {
                dots: [],
                currentPageIndex: 0
            }
        },
        mounted() {
            setTimeout(() => {
                this._setSliderWidth()
                this._initDots()
                this._initSlider()

                if (this.autoPlay) {
                    this._play()
                }
            }, 20)

            window.addEventListener('resize', () => {
                if (!this.slider) {
                    return
                }
                this._setSliderWidth(true)
                this.slider.refresh()
            })
        },
        methods: {
            _setSliderWidth(isResize) {
                this.children = this.$refs.sliderGroup.children
                let width = 0
                let sliderWidth = this.$refs.slider.clientWidth
                for (let i = 0; i < this.children.length; i++) {
                    let child = this.children[i]
                    addClass(child, 'slider-item')
                    child.style.width = sliderWidth + 'px'
                    width += sliderWidth
                }
                /**
                 * better-scroll loop:true => 两端各补一张轮播图
                 */
                if (this.loop && !isResize) {
                    width += 2 * sliderWidth
                }
                this.$refs.sliderGroup.style.width = width + 'px'
            },
            _initSlider() {
                this.slider = new Bscroll(this.$refs.slider, {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapLoop: this.loop,
                    threshold: 0.3,
                    snapSpeed: 400
                })

                /**
                 * better文档
                 * getCurrentPage方法和属性
                 * 注意loop时候的index值变化
                 */
                this.slider.on('scrollEnd', () => {
                    let pageIndex = this.slider.getCurrentPage().pageX
                    if (this.loop) {
                        pageIndex -= 1
                    }
                    this.currentPageIndex = pageIndex

                    if (this.autoPlay) {
                        clearTimeout(this.timer)
                        this._play()
                    }
                })
            },
            _initDots() {
                this.dots = new Array(this.children.length)
            },
            _play() {
                let pageIndex = this.currentPageIndex + 1
                if (this.loop) {
                    pageIndex += 1
                }
                this.timer = setTimeout(() => {
                    this.slider.goToPage(pageIndex, 0, 400)
                }, this.interval)
            }
        },
        destroyed() {
            clearTimeout(this.timer)
        }
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable'

  .slider
    position: relative
    width: 100%
    height: 0
    padding-top: 40%
    border-radius: 4px
    overflow: hidden
    .slider-group
      position: absolute
      left: 0
      top: 0
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        & > a
          display: block
          width: 100%
          img
            display: block
            width: 100%
            border-radius: 4px
    .dots
      position: absolute
      left: 0
      right: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        width: 8px
        height: 8px
        margin: 0 4px
        border-radius: 50%
        background: $color-text-l
        transition: all .1s ease
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>