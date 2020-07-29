// import jsonp from 'common/js/jsonp'
import { commonParams } from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export const getRecommend = () => {
  // const url = '/api/getTopBanner'
	const url = debug ? '/api/getTopBanner' : 'http://0.0.0.0:8900/api/getTopBanner'
  // const url = debug ? '/api/getTopBanner' : 'http://localhost:9000/api/getTopBanner'

	const data = Object.assign({}, commonParams, {
		format: 'json',
  		platform: 'yqq.json',
  		// sign: 'zzacpnpygpqjov4alff15c4441255ee9ef959d8dacccc3f88',
  		hostUin: 0,
    	needNewCode: 0,
    	inCharset: 'utf8',
    	'-': 'recom' + (Math.random() + '').replace('0.', ''),
    	data: {
	      'comm': { 'ct': 24 },
	      'category': { 'method': 'get_hot_category', 'param': { 'qq': '' }, 'module': 'music.web_category_svr' },
	      'recomPlaylist': {
	        'method': 'get_hot_recommend',
	        'param': { 'async': 1, 'cmd': 2 },
	        'module': 'playlist.HotRecommendServer'
	      },
	      'playlist': {
	        'method': 'get_playlist_by_category',
	        'param': { 'id': 8, 'curPage': 1, 'size': 40, 'order': 5, 'titleid': 8 },
	        'module': 'playlist.PlayListPlazaServer'
	      },
	      'new_song': { 'module': 'newsong.NewSongServer', 'method': 'get_new_song_info', 'param': { 'type': 5 } },
	      'new_album': {
	        'module': 'newalbum.NewAlbumServer',
	        'method': 'get_new_album_info',
	        'param': { 'area': 1, 'sin': 0, 'num': 10 }
	      },
	      'new_album_tag': { 'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_area', 'param': {} },
	      'toplist': { 'module': 'musicToplist.ToplistInfoServer', 'method': 'GetAll', 'param': {} },
	      'focus': { 'module': 'QQMusic.MusichallServer', 'method': 'GetFocus', 'param': {} }
	    }
	})
	 return axios.get(url, {
	    params: data
	 }).then((res) => {
	    return res.data
	 })
}

export function getDiscList () {
  // 线上环境地址，同学们根据自己的需要配置修改
  const url = debug ? '/api/getDiscList' : 'http://http://104.167.98.201/music-vue/api/getDiscList'
  // const url = debug ? '/api/getDiscList' : 'http://localhost:9000/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList (disstid) {
  const url = debug ? '/api/getCdInfo' : 'http://http://104.167.98.201/music-vue/api/getCdInfo'
  // const url = debug ? '/api/getCdInfo' : 'http://localhost:9000/api/getCdInfo'
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
