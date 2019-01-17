<template>
    <div class="song-list">
        <ul>
            <li class="song-item" @click="selectItem(song, index)" v-for="(song, index) in songs">
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            songs: {
                type: Array,
                default: []
            }
        },
        methods: {
            getDesc(song) {
                return `${song.singer}·${song.album}`
            },
            selectItem(song, index) {
                this.$emit('select', song, index)
            }
        }
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable.styl'

  .song-list
    .song-item
      display: flex
      align-items: center
      height: 64px
      font-size: $font-size-medium
      .content
        line-height: 20px
        overflow: hidden
        .name,.desc
          text-overflow: ellipsis
          overflow: hidden
          color: $color-text-l
        .desc
          white-space: nowrap
          margin-top: 4px
          color: $color-text
</style>