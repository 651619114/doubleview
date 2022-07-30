
<template>
<div class="m-page">
	<Pager
		@changePage="jumpPage"
		:totalCount="coursePage.total"
		:pageNumber="queryParams.p"
		:pageSize="queryParams.pageSize" />
</div>
 </template>
 <script>
import Pager from '@/components/page/Pager'

export default{
    components:{
        Pager,
    },
    props:['coursePage'],
    name:'PageList',
    data(){
        return {
            // totalCount: 20,
            queryParams: {
                pageSize: 15,
                p: 1,
                mod: 'search'
            },
        }
    },  
    methods:{
        jumpPage (e) {
            this.queryParams.p = e.currentPage
            this.queryParams.pageSize = e.currentSize
            this.$emit('getPageData',this.queryParams.p,this.queryParams.pageSize) // 调用接口获取列表数据
        }
    },
}

 </script>
<style>
.m-page {
  margin: 60px auto 10px;
}
</style>

