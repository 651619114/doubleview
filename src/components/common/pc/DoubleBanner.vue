<template>
  <div class="banner">
    <div class="cont">
      <div class="banner_title">
        <!-- <img src="@/assets/common/img/pc/Double.png" /> -->
        <img :src="doubleUrl" />
      </div>
      <div class="banner_desc">
        让校园没有难就的业！就业桥线上双选会，更广、更快、更安全
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/common/css/pc/banner.css";
import "@/views/pc/styles/cloudDouble/index.less";
export default {
  name: "DoubleBanner",
  props: {},
  data() {
    return {
      doubleUrl:require('@/assets/common/img/pc/Double.png'),
    };
  },
  mounted() {},
  methods: {},
};
</script>
