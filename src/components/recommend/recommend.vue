<template>
    <scroll class="recommend-wrapper" :data="discList" ref="scroll">
        <div class="recommend-content">
            <div class="recommend">
                <div v-if="recommendSlider.length" class="slider-wrapper">
                    <slider :loop="loop">
                        <div v-for="(item,index) in recommendSlider" :key="index">
                            <a :href="item.linkUrl">
                                <img class="needsclick" @load="checkload" :src="item.picUrl">
                            </a>
                        </div>
                    </slider>
                </div>
            </div>
            <div v-show="discList.length">
                <div class="recommend-fm">
                    <h1 class="recommend-title">电台&nbsp;<span class="icon-playlist"></span></h1>
                    <div class="fm-wrapper">
                        <div class="fm-item" v-for="(item, index) in recommendFm">
                            <div class="item-img">
                                <span class="icon-play-mini"></span>
                                <img :src="item.picUrl">
                            </div>
                            <p class="description">{{item.Ftitle}}</p>
                        </div>
                    </div>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul class="list-box">
                        <li v-for="listItem in discList" class="item">
                            <div class="icon">
                                <img v-lazy="listItem.picUrl" alt="">
                            </div>
                            <div class="text">{{listItem.songListDesc}}</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading" v-show="!discList.length">
                <loading></loading>
            </div>
        </div>
    </scroll>
</template>

<script>
    import {getRecommend, getDistcList} from '../../api/recommend'
    import {ERROK} from '../../api/config'
    import slider from '../../base/slider/slider'
    import scroll from '../../base/scroll/scroll'
    import loading from '../../base/loading/loading'

    export default {
        data() {
            return {
                recommendSlider: [],
                loop: true,
                recommendFm: [],
                discList: [],
                loaded: false
            }
        },
        created() {
            this._getRecommend()
        },
        methods: {
            _getRecommend() {
                getRecommend().then((res) => {
                    if (res.code === ERROK) {
                        this.recommendSlider = res.data.slider
                        this.recommendFm = res.data.radioList
                        this.discList = res.data.songList
                        // console.log(res.data)
                    }
                }).catch((rej) => {
                    console.log(rej)
                })
            },
            _getDiscList() {
                getDistcList().then((res) => {
                    if (res.code === ERROK) {
                        console.log(res.data)
                    }
                }).catch((rej) => {
                    console.log(rej)
                })
            },
            checkload() {
                if (!this.loaded) {
                    this.$refs.scroll.refresh()
                    this.loaded = true
                }
            }
        },
        components: {
            slider,
            scroll,
            loading
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable.styl'

  .recommend-wrapper
    position: absolute
    width: 100%
    top: 88px
    bottom: 0
    overflow: hidden
    z-index: -1
    border-radius: 6px 6px 0 0
    .recommend-content
      padding: 20px 8px
    .recommend-fm
      width: 100%
      .recommend-title
        height: 56px
        line-height: 56px
        text-align: center
        color: $color-text
        font-size: $font-size-medium
        .icon-playlist
          font-weight: 800
      .fm-wrapper
        display: flex
        width: 100%
        justify-content: space-around
        .fm-item
          width: 48%
          .item-img
            position: relative
          .icon-play-mini
            position: absolute
            top: 50%
            left: 50%
            transform: translate(-50%, -50%)
            font-size: $font-size-large-x
            font-weight: 700
            color: #fff
            z-index: 8
          img
            width: 100%
            border-radius: 50%
            overflow: hidden
            animation: imgRotate 18s linear infinite
          .description
            padding-top: 8px
            text-align: center
            font-size: $font-size-medium
            color: $color-text-l
    .recommend-list
      .list-title
        height: 56px
        line-height: 56px
        text-align: center
        color: $color-text
        font-size: $font-size-medium
      .list-box
        display: flex
        flex-wrap: wrap
        justify-content: space-around
        .item
          width: 30%
          margin: 10px 0
          .icon
            width: 100%
            & > img
              display: block
              width: 100%
              border-radius: 3%
          .text
            display: -webkit-box
            margin-top: 4px
            line-height: 16px
            font-size: $font-size-small
            -webkit-box-orient: vertical
            text-overflow: ellipsis
            -webkit-line-clamp: 2
            overflow: hidden
            color: $color-text-l
  .loading
    display: flex
    width: 100%
    padding-top: 60px
    justify-content: center
    align-items: center

  @keyframes imgRotate{
    0%{
        transform: rotate(0deg)
    }
    100%{
        transform: rotate(360deg)
    }
  }
</style>