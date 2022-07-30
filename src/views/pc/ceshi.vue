<template>



    <el-button
          class="start-btn"
          @click="toWait()"
          >开始面试</el-button
        >



</template>
<script>
// import "../../styles/cloudTalk/index.less";
export default {
  data() {
    return {
      dialogVisible:false,
    }
  },
  name: "Index",
  methods:{
    toWait() {
        this.$router.push({
          name: "video-check",
          query: {
            gd: '1',
            ud: 1,
            name:'测试'
          },
        });
    }
  },
  setup() {  
    return {  
    }
  }
};
</script>
<style></style>
