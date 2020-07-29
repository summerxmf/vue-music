<template>
  <div ref="wrapper">
  	<slot></slot>
  </div>
</template>
<script>
	import BScroll from 'better-scroll'
    const DIRECTION_H = 'horizontal'
    const DIRECTION_V = 'vertical'
  export default {
    name: 'scroll',
    props: {
        data: {
            type: Array,
            default: []
        },
        /**
        * 1 滚动的时候会派发scroll事件，会截流。
        * 2 滚动的时候实时派发scroll事件，不会截流。
        * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
        */
    	probeType: {
    		type: Number,
    		default: 1
    	},
        /**
        * 点击列表是否派发click事件
        */
    	click: {
    		type: Boolean,
    		default: true
    	},
        /**
        * 是否派发滚动事件
        */
        listenScroll: {
            type: Boolean,
            default: false
        },
        // 是否派发滚动到底部的事件，用于上拉加载
        pullup: {
            type: Boolean,
            default: false
        },
        /**
        * 是否派发列表滚动开始的事件
        */
        beforeScroll: {
            type: Boolean,
            default: false
        },
        /**
        * 当数据更新后，刷新scroll的延时。
        */
        refreshDelay: {
            type: Number,
            default: 20
        },
        direction: {
            type: String,
            default: DIRECTION_V
        },
        directionLockThreshold: {
            type: Number,
            default: 0
        }

    },
    mounted() {
    	setTimeout(() => {
    		this._initScroll()
    		console.log('better-scroll init')
    	}, 20)
    },
    methods: {
    	_initScroll() {
    		if (!this.$refs.wrapper) {
    			return
    		}
            // better-scroll的初始化
    		this.scroll = new BScroll(this.$refs.wrapper, {
    			probeType: this.probeType,
    			click: this.click,
                eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V,
                directionLockThreshold: this.directionLockThreshold
    		})
            // 是否派发滚动事件
            if (this.listenScroll) {
                this.scroll.on('scroll', (pos) => {
                    this.$emit('scroll', pos)
                })
            }
            // 是否派发滚动到底部事件，用于上拉加载
            if (this.pullup) {
                this.scroll.on('scrollEnd', () => {
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToEnd')
                    }
                })
            }
            // 是否派发列表滚动开始的事件
            if (this.beforeScroll) {
                this.scroll.on('beforeScrollStart', () => {
                    this.$emit('beforeScroll')
                })
            }
    	},
    	enable() {
    		this.scroll && this.scroll.enable()
    	},
    	disable() {
    		this.scroll && this.scroll.disable()
    	},
    	refresh() {
    		this.scroll && this.scroll.refresh()
    	},
        scrollTo() {
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    watch: {
    	data() {
    		setTimeout(() => {
	    		this.refresh()
	    	}, this.refreshDelay)
    	}
    }
  }
</script>
