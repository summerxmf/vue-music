<template>
  <div class="singer" ref="singer">
    <listview :data="singers" @selectItem="selectSinger" ref="list"/>
    <router-view></router-view>
  </div>
</template>
<script>
	import { getSingerList } from 'api/singer'
	import { ERR_OK } from 'api/config'
    import Singer from 'common/js/singer'
    import Listview from 'base/listview/listview'
    import {mapMutations} from 'vuex'
    import {playlistMixin} from 'common/js/mixin'
    const HOT_NAME = 'Hot'
    const HOT_SINGER_LEN = 10
  export default {
    name: 'singer',
    mixins: [playlistMixin],
    data() {
    	return {
    		singers: []
    	}
    },
    created() {
    	this._getSingerList()
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : '0'
            this.$refs.singer.style.bottom = bottom
            this.$refs.list.refresh()
        },
        selectSinger(singer) {
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
    	_getSingerList() {
    		getSingerList().then((res) => {
                console.log(res)
    			if (res.code === ERR_OK) {
    				this.singers = this._normalizeSinger(res.data.list)
                    console.log(this.singers)
                 }
    		})
    	},
        _normalizeSinger(list) {
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            }
            list.forEach((item, index) => {
                if (index < HOT_SINGER_LEN) {
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
                    name: item.Fsinger_name,
                    id: item.Fsinger_mid
                }))
            })
            console.log(map)
            // sort map into an index array
            let hot = []
            let ret = []
            for (let key in map) {
                let val = map[key]
                if (val.title === HOT_NAME) {
                    console.log(val)
                    hot.push(val)
                } else if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val)
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    },
    components: {
        Listview
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
	.singer
		position: fixed
		top: 88px
		bottom: 0
		width: 100%
</style>