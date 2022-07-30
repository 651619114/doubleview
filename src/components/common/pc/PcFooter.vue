<template>
     <!-- footer -->
    <div class="footer-bg">
        <div class="footer clearfix">
            <div class="footer-item footer-item-product">
                <div class="footer-title">产品服务</div>
                <a target="_blank" href="https://www.jiuyeqiao.cn/recruit/job/index/1" class="item-line">高校招聘</a>
                <a target="_blank" href="https://www.jiuyeqiao.cn/recruit/job/index/11" class="item-line">企业招聘</a>
                <a target="_blank" href="https://www.jiuyeqiao.cn/recruit/job/index/3" class="item-line">公务员/事业单位</a>
                <a target="_blank" href="https://www.jiuyeqiao.cn/recruit/job/index/9" class="item-line">科研院所</a>
                <a target="_blank" href="https://www.jiuyeqiao.cn/recruit/job/index/12" class="item-line">高端人才</a>
            </div>
            <div class="footer-item footer-item-business">
                <div class="footer-title">商务合作</div>
                <p class="item-line">联系人：马老师</p>
                <p class="item-line">电话：13910230008</p>
                <p class="item-line">邮箱：majie@eol.cn</p>
            </div>
            <div class="footer-item footer-item-content">
                <div class="footer-title">内容合作</div>
                <p class="item-line">联系人：尚老师</p>
                <p class="item-line">电话：13401173871</p>
                <p class="item-line">邮箱：shanggl@eol.cn</p>
            </div>
            <div class="footer-item footer-item-code">
                <img src="@/assets/common/img/pc/code.png" alt="就业桥公众号" class="footer-code">
                <p class="item-line">就业桥公众号</p>
            </div>
            <div class="footer-item footer-item-code" style="margin-left: 50px;">
                <img src="@/assets/common/img/pc/code-dingyue.jpg" alt="就业桥订阅号" class="footer-code">
                <p class="item-line">就业桥订阅号</p>
            </div>
        </div>
        <div class="footer-bottom" style="text-align: center;">
            <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">京ICP备2020046552号-4</a>&nbsp;&nbsp;
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802038637" target="_blank">
                <img src="@/assets/common/img/pc/beian.png" alt="京公网安备1101082038637号">京公网安备1101082038637号
            </a>
            &nbsp;&nbsp;版权所有&copy;中教智网（北京）信息技术有限公司
        </div>
    </div>
</template>

<script>
import '@/assets/common/css/pc/public.css'
import '@/assets/common/css/pc/reset.css'
export default{
       name:'PcFooter',
        props:{
            banners:Array,
            default(){
                return []
            }
        }
    }
// 百度统计代码
var _hmt = _hmt || [];
window._hmt = _hmt; // 修改为window 全局变量
(function() {
    var hm = document.createElement("script");
    hm.src = "https://v1.cnzz.com/z_stat.php?id=1280693657&web_id=1280693657";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
})();
</script>
