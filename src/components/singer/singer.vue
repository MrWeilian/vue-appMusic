<template>
    <div>
        <scroll class="singer-wrapper" 
            :data="singers" 
            ref="singerWrapper" 
            :listenScroll="listenScroll" 
            :probeType="probeType"
            @scroll="scroll"
    >
            <ul class="singer-list">
                <li class="list-group" v-for="(singerType, index) in singers" ref="listGroup" :key="index">
                    <ul class="singer-type">
                        <h1 class="title">{{singerType.title}}</h1>
                        <li class="singer-item" 
                            v-for="(singerItem, index) in singerType.items" 
                            :key="index"
                            @click="selectSinger(singerItem)"
                        >
                            <div class="avatar">
                                <img v-lazy="singerItem.avatar" alt="">
                            </div>
                            <div class="name">
                                {{singerItem.name}}
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="shortList" 
                @touchstart.stop.prevent="shortListTouchstart" 
                @touchmove.stop.prevent="shortListMove"
                v-show="shortListItem.length>0"
            >
                <ul>
                    <li class="shortList-item" 
                        v-for="(item, index) in shortListItem" 
                        :data-index="index" 
                        :key="index"
                        :class="{'currentActive': scrollIndex === index}"
                    >{{item}}</li>
                </ul>
            </div>
            <div class="fix-title" v-show="fixTitle" ref="fixTitle">
                <h1 class="title">{{fixTitle}}</h1>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
    import {getSinger} from '../../api/singer'
    import {ERROK} from '../../api/config'
    import Singer from '../../common/js/singer.js'
    import scroll from '../../base/scroll/scroll'
    import {getData} from '../../common/js/dom.js'
    import {mapMutations} from 'vuex'

    const HOT_NAME = '热门'
    const HOT_LENGTH = 10
    const SHORT_LIST_ITEM_HEIGHT = 18
    const LIST_TITLE_HEIGHT = 34

    export default {
        data() {
            return {
                singers: [],
                listenScroll: true,
                scrollY: -1,
                scrollIndex: 0,
                probeType: 3,
                sectionY: [],
                titleMove: 0
            }
        },
        created() {
            this._getSinger()
            this.touchY = {}
        },
        methods: {
            _getSinger() {
                getSinger().then((res) => {
                    if (res.code === ERROK) {
                        this.singers = this._sortSingers(res.data.list)
                        // console.log(this.singers)
                        setTimeout(() => {
                            this._calculateHeight()
                        }, 20)
                    }
                }).catch((rej) => {
                    console.log(rej)
                })
            },
            _sortSingers(list) {
                let map = {
                    hot: {
                        title: HOT_NAME,
                        items: []
                    }
                }
                list.forEach((item, index) => {
                    if (index < HOT_LENGTH) {
                        map.hot.items.push(new Singer({
                            id: item.Fsinger_mid,
                            name: item.Fsinger_name
                        }))
                    }
                    const key = item.Findex
                    if (!map[key]) {
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }
                    map[key].items.push(new Singer({
                        id: item.Fsinger_mid,
                        name: item.Fsinger_name
                    }))
                })
                
                let hotList = []
                let rankList = []
                
                for (let key in map) {
                    var value = map[key]
                    if (value.title.match(/[a-zA-Z]/)) {
                        rankList.push(value)
                    }else if (value.title === HOT_NAME) {
                        hotList.push(value)
                    }
                }
                // 按字母顺序排序rankList
                rankList.sort((a, b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                })

                return hotList.concat(rankList)
            },
            shortListTouchstart(e) {
                let currentIndex = getData(e.target, 'index')
                this.touchY.firstY = e.touches[0].pageY
                this.touchY.currentIndex = currentIndex
                this._scrollToElement(currentIndex)
                
                if (this.sectionY[currentIndex]) {
                    this.scrollY = -this.sectionY[currentIndex]
                }
                
            },
            shortListMove(e) {
                this.touchY.moveY = e.touches[0].pageY
                let delta = Math.floor((this.touchY.moveY - this.touchY.firstY) / SHORT_LIST_ITEM_HEIGHT)
                if (this.touchY.currentIndex === null) {
                    return
                }
                let newIndex = this.touchY.currentIndex-0 + delta
                this._scrollToElement(newIndex)

                if (this.sectionY[newIndex]) {
                    this.scrollY = -this.sectionY[newIndex]
                }
            },
            scroll(pos) {
                this.scrollY = Math.round(pos.y)
                // console.log(pos.y,this.sectionY[this.scrollIndex])
                this.titleMove = Math.abs(Math.round(pos.y))
            },
            _scrollToElement(index) {
                if (index === null) {
                    return
                }
                if (index < 0){
                    index = 0
                } else if (index > this.$refs.listGroup.length-1) {
                    index = this.$refs.listGroup.length - 1
                }
                this.$refs.singerWrapper.scrollToElement(this.$refs.listGroup[index], 300)
            },
            _calculateHeight() {
                let height = 0
                this.sectionY.push(height)
                for (let i = 0; i < this.$refs.listGroup.length; i++) {
                    let item = this.$refs.listGroup[i]
                    height+= item.offsetHeight
                    this.sectionY.push(height)
                }
                // console.log(this.sectionY)
            },
            selectSinger(singer) {
                this.$router.push({
                    path: `/singer/${singer.id}`
                })
                this.setSinger(singer)
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            })
        },
        components: {
            scroll
        },
        computed: {
            shortListItem() {
                return this.singers.map((currentVal) => {
                    return currentVal.title.substring(0,1)
                })
            },
            fixTitle() {
                if (this.scrollY > 0) {
                    return ''
                }
                return this.singers[this.scrollIndex] ? this.singers[this.scrollIndex].title : ''
            }
        },
        watch: {
            scrollY() {
                
                // 超过顶部
                if (this.scrollY > 0) {
                    this.scrollIndex = 0
                    return
                }
                
                // 区间内滚动
                for (let i = 0; i < this.sectionY.length; i++) {
                    let height1 = this.sectionY[i]
                    let height2 = this.sectionY[i + 1]
                    
                    if (!height2 || (-this.scrollY>=height1 && -this.scrollY<height2) ) {
                        this.titleMove = height2 + this.scrollY   
                        this.scrollIndex = i
                        return
                        
                    }
                    this.scrollIndex = 0
                }
            },
            titleMove(newVal) {
                let fixTop = (newVal > 0 && newVal < LIST_TITLE_HEIGHT) ? newVal - LIST_TITLE_HEIGHT: 0
                // console.log(fixTop)
                this.$refs.fixTitle.style.transform = `translate3D(0, ${fixTop}px, 0)`
            }
        }
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable'

  .singer-wrapper
    position: absolute
    width: 100%
    top: 88px
    bottom: 0
    overflow: hidden
    z-index: -1
    .singer-list
      .list-group
        padding-bottom: 30px
      .singer-type
        .title
          height: 30px
          line-height: 34px
          padding: 2px 0 2px 30px
          background: $color-highlight-background
          color: $color-text-d
          font-weight: 700
          font-size: $font-size-small
        .singer-item
          display: flex
          height: 50px
          padding: 20px 0 0 30px
          .avatar
            width: 50px
            height: 50px
            & > img
              display: block
              width: 100%
              height: 100%
              border-radius: 50%
          .name
            margin-left: 14px
            height: 50px
            line-height: 50px
            font-size: $font-size-medium
            color: $color-text-l
    .shortList
      position: absolute
      right: 0
      width: 20px
      padding: 10px 0
      top: 50%
      transform: translateY(-50%)
      background: $color-theme-g
      border-radius: 3px
      z-index: 8
      .shortList-item
        padding: 3px
        text-align: center
        font-size: $font-size-small
        color: $color-text-ll
        &.currentActive
          color: $color-text-d
          font-weight: 700
          background: $color-highlight-background
    .fix-title
      position: absolute
      left: 0
      top: 0
      width: 100%
      background: $color-highlight-background
      .title
        height: 30px
        line-height: 34px
        padding: 2px 0 2px 30px
        background: $color-highlight-background
        color: $color-text-d
        font-weight: 700
        font-size: $font-size-small
</style>