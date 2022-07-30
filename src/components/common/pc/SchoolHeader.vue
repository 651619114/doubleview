<template>
 <!-- 顶部搜索栏 -->
    <div class="bigsearch">
        <div class="sec-search">
            <div class="code fr">
                <div class="code-img fl">
                    <img src="@/assets/common/img/pc/code.png" alt="">
                </div>
                <span class="code-tip red">关注最新就业方式</span><br />
                <span class="code-tip">获取简历投递状态</span>
            </div>
            <img src="@/assets/common/img/pc/logo.png" alt="" class="logo fl">
        </div>
    </div>
    <!-- 内容 -->
    <div class="title-box">
        <div class="tt"><img src="@/assets/common/img/pc/page_left.svg" />返回</div>
    </div>
</template>
<script>
import '@/assets/common/css/pc/schoolheader.css'
export default{
    name:'SchoolHeader',
    props:{
    },
    data(){
        return {
        }
    },
    mounted(){
        
    },
    methods:{
    }
}
</script>