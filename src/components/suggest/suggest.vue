<template>
  <scroll
  	ref="suggest"
  	class="suggest" 
  	:data="result" 
  	:pullup="pullup"
  	:beforeScroll="beforeScroll"
  	@scrollToEnd="searchMore"
  	@beforeScroll="listScroll"
  >
  	<ul class="suggest-list">
  		<li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
  			<div class="icon">
  				<i :class="getIconCls(item)"></i>
  			</div>
  			<div class="name">
  				<p class="text" v-html="getDisplayName(item)"></p>
  			</div>
  		</li>
  		<loading v-show="hasMore"/>
  	</ul>
  	<div class="no-result-wrapper" v-show="!hasMore && !result.length">
  		<no-result title="Sorry, no result..."/>
  	</div>
  </scroll>
</template>
<script>
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	import NoResult from 'base/no-result/no-result'
	import {search} from 'api/search'
	import { ERR_OK } from 'api/config'
	import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
	import Singer from 'common/js/singer'
	import {mapMutations, mapActions} from 'vuex'

	const TYPE_SINGER = 'singer'
	const perpage = 20
  export default {
    name: 'suggest',
    props: {
    	query: {
    		type: String,
    		default: ''
    	},
    	showSinger: {
    		type: Boolean,
    		default: true
    	}
    },
    data() {
    	return {
    		page: 1,
    		result: [],
    		hasMore: true
    	}
    },
    created() {
    	this.pullup = true
    	this.beforeScroll = true
    },
    methods: {
    	search() {
    		this.page = 1    		
    		this.hasMore = true
    		this.$refs.suggest.scrollTo(0, 0)	
    		search(this.query, this.page, this.showSinger, perpage).then((res) => {
    			if(res.code === ERR_OK) {
    				this._getResult(res.data).then((result) => {
    					this.result = result
    					this.hasMore= false //由于版权，能显示的歌曲大大低于list给出的，所以这里人为阻断loadMore（） 					
    					this._checkMore(res.data) 					
    				})
    			}
    		})
    	},
    	searchMore() {
    		if(!this.hasMore) {
    			return
    		}
    		this.page++
    		search(this.query, this.page, this.showSinger, perpage).then((res) => {
    			if(res.code === ERR_OK) {
    				this._getResult(res.data).then((result) => {
    					this.result = this.result.concat(result)    					
    					this._checkMore(res.data) 					
    				})
    			}
    		})


    	},
    	getDisplayName(item) {
    		if (item.type === TYPE_SINGER) {
    			return item.singername
    		} else {
    			return `${item.name}-${item.singer}`
    		}
    	},
    	getIconCls(item) {
    		if (item.type === TYPE_SINGER) {
    			return 'icon-mine'
    		} else {
    			return 'icon-music'
    		}
    	},
    	selectItem(item){
    		if(item.type === TYPE_SINGER) {
    			const singer = new Singer({
    				id: item.singermid,
    				name: item.singername
    			})
    			this.$router.push({
    				path: `/singer/${singer.id}`
    			})
    			this.setSinger(singer)
    		} else {
    			this.insertSong(item)
    		}
    		this.$emit('select')
    	},
    	listScroll() {
    		this.$emit('listScroll')
    	},
      refresh() {
        this.$refs.suggest.refresh()
      },
    	_checkMore(data) {
    		const song = data.song
    		if (!song.list.length || (song.curnum + (song.curpage -1) * perpage) >= song.totalnum) {
    			this.hasMore = false
    		} else {
    			if(!this.$refs.suggest.scroll.hasVerticalScroll) {
    				this.searchMore()
    			}
    		}

    	},   	
    	_getResult(data) {
    		let ret = []
    		// if(data.zhida && data.zhida.singerid && this.page === 1) {
    		if(data.zhida && data.zhida.singerid ) {
    			ret.push({...data.zhida, ...{ type: TYPE_SINGER }})
    		}
    		return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
    			ret = ret.concat(songs)
    			return ret
    		})    		
    	},
    	_normalizeSongs(list) {
    		let ret = []
    		list.forEach((musicData) => {
    			if(isValidMusic(musicData)) {
    				ret.push(createSong(musicData))
    			}
    		})
    		return ret
    	},
    	...mapMutations({
    		setSinger: 'SET_SINGER'
    	}),
    	...mapActions([
    		'insertSong'
    	])
    },
    watch: {
    	query() {
    		this.search()
    	}
    },
    components: {
    	Scroll,
    	Loading,
    	NoResult
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"
	.suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
