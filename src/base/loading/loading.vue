<template>
	<div class="loading">
         <img src="./loading.gif" width="24" height="24">
         <p class="desc">{{title}}</p>
    </div>
</template>
<script>
  export default {
    name: 'loading',
    props: {
    	title: {
    		type: String,
    		default: 'loading...'
    	}
    },
    methods: {
    	setText(value) {
    		this.loadingText = value
    	}
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/mixin"
  .loading
    overflow: hidden
    width: 100%
    text-align: center
    .desc
        line-heigt: 20px
        font-size: $font-size-small
        color: $color-text-l
</style>
