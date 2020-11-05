<template>
    <div class="header_container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index' }"></el-breadcrumb-item>
        <el-breadcrumb-item >{{$route.meta.pageTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>

<script>
    export default {
    	data(){
    		return {
    		}
			},
			created() {
				// console.log(this.$route.meta)
			}
    }
</script>

<style lang="scss">
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
</style>
