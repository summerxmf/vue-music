<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :rank="rank" :songs="songs"></music-list>
  </transition>
</template>
<script>
	import MusicList from 'components/music-list/music-list'
	import {mapGetters} from 'vuex'
	import {getMusicList} from 'api/rank'
	import {ERR_OK} from 'api/config'
	import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
  export default {
    name: 'top-list',
    computed: {
    	title() {
    		return this.topList.topTitle
    	},
    	bgImage() {
    		if(this.songs.length) {
    			return this.songs[0].image
    		}
    		return ''
    		// return this.topList.picUrl
    	},
    	...mapGetters([
    		'topList'
    	])
    },
    data() {
    	return {
    		songs: [],
    		rank: true
    	}
    },
    created() {
    	this._getMusicList()
    },
    methods: {
    	_getMusicList() {
    		if(!this.topList.id) {
    			this.$router.push('/rank')
    			return
    		}
    		getMusicList(this.topList.id).then((res) => {
    			console.log(res);
    			if(res.code === ERR_OK) {
    				processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
    					this.songs = songs
    				})
    			}
    		})    		
    	},
    	_normalizeSongs (list) {
	        let ret = []
	        list.forEach((item) => {
	          const musicData = item.data
	          if (isValidMusic(musicData)) {
	            ret.push(createSong(musicData))
	          }
	        })
	        return ret
	     }
    	
    },
    components: {
    	MusicList
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .slide-enter-active, .slide-leave-active
  	transition: all 0.3s ease
  .slide-enter, .slide-leave-to
  	transform: translate3d(100%, 0, 0)
</style>