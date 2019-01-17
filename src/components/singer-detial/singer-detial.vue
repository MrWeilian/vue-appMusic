<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" ></music-list>
    </transition>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {getSingerDetail, getMusic} from '../../api/singer.js'
    import {ERROK} from '../../api/config.js'
    import {createSong} from '../../common/js/song.js'
    import musicList from '../music-list/music-list.vue'

    export default {
        data() {
            return {
                songs: []
            }
        },
        computed: {
            title() {
                return this.singer.name
            },
            bgImage() {
                return this.singer.avatar
            },
            ...mapGetters([
                'singer'
            ])
        },
        created() {
            this._getDetail()
            console.log(this.singer)
        },
        methods: {
            _getDetail() {
                if (!this.singer.id) {
                    this.$router.push('/singer')
                    return
                }
                getSingerDetail(this.singer.id).then((res) => {
                    if (res.code === ERROK) {
                        this.songs = this._normalizeSongs(res.data.list)
                        console.log(this.songs)
                    }
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach(item => {
                    let {musicData} = item
                    if (musicData.songid && musicData.albummid) {
                        getMusic(musicData.songmid).then(res => {
                            const svley = res.data.items
                            const songVkey = svley[0].vkey
                            ret.push(createSong(musicData, songVkey))
                        })
                    }
                })
                console.log(ret)
                return ret
            }
        },
        components: {
            musicList
        }
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable.styl'

  .slide-enter-active,.slide-leave-active
    transition: all .3s ease
  .slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>