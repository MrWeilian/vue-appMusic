<template>
    <div class="progress-bar" @click="progressClick">
        <div class="bar-inner" ref="progressBar">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" 
                ref="progressBtn"
                @touchstart.prevent="progressTouchStart"
                @touchmove.prevent="progressTouchmove"
                @touchend="progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
    const progressBtnWidth = 16

    export default {
        props: {
            percent: {
                type: Number,
                default: 0
            }
        },
        watch:  {
            percent(newPercent) {
                if (newPercent >= 0 && !this.touch.initiated) {
                    const barWidth = this.$refs.progressBar.offsetWidth -progressBtnWidth
                    const offsetWidth = newPercent * barWidth
                    this._offset(offsetWidth)
                }
            }
        },
        created() {
            this.touch = {}
        },
        methods: {
            progressTouchStart(e) {
                this.touch.initiated = true
                this.touch.startX = e.touches[0].pageX
                this.touch.left = this.$refs.progress.clientWidth
            },
            progressTouchmove(e) {
                if (!this.touch.initiated) {
                    return
                }
                const deltaX = e.touches[0].pageX - this.touch.startX
                const offsetWidth = Math.min(this.$refs.progressBar.offsetWidth -progressBtnWidth, Math.max(0, this.touch.left + deltaX))
                this._offset(offsetWidth)
            },
            progressTouchEnd() {
                this.touch.initiated = false
                this._triggerPercent()
            },
            progressClick(e) {
                const rect = this.$refs.progressBar.getBoundingClientRect()
                const offsetWidth = e.pageX - rect.left
                this._offset(e.offsetX)
                this._triggerPercent()
            },
            _triggerPercent() {
                const barWidth = this.$refs.progressBar.offsetWidth -progressBtnWidth
                const offsetWidth = this.$refs.progress.offsetWidth
                const newPercent = offsetWidth/barWidth
                this.$emit('percentChange', newPercent)
            },
            _offset(offsetWidth) {
                this.$refs.progress.style.width = `${offsetWidth}px`
                this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
            }
        }
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/variable.styl'
  
  .progress-bar
    .bar-inner
      position: relative
      height: 4px
      top: 13px
      background: $color-text-d
      .progress
        position: absolute
        height: 100%
        background: $color-text-l
     .progress-btn-wrapper
        width: 30px
        height: 30px
        position: absolute
        left: -8px
        top: -13px
        .progress-btn
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid #fff;
          border-radius: 50%;
          background: $color-text-l
</style>