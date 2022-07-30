<template>
  <div class="m-pager-wrap" v-if="totalCount">
    <span class="u-text">共{{ totalPage }}页 / {{ totalCount }}条</span>
    <span class="u-item txt" :class="{'disabled': currentPage===1}" @click="changePage(1)">首页</span>
    <span class="u-item txt point" :class="{'disabled': currentPage===1}" @click="changePage(currentPage - 1)"><img src="@/assets/common/img/pc/page_left.svg" alt=""></span>
    <span
      class="u-ellipsis"
      ref="forward"
      v-show="forwardMore"
      @click="onForward"
      @mouseenter="onEnterForward"
      @mouseleave="onLeaveForward">&middot;&middot;&middot;</span>
    <span :class="['u-item', {'active': currentPage===num}]" v-for="num in pageList" :key="num" @click="changePage(num)">{{ num }}</span>
    <span
      class="u-ellipsis"
      ref="backward"
      v-show="backwardMore"
      @click="onBackward"
      @mouseenter="onEnterBackward"
      @mouseleave="onLeaveBackward">&middot;&middot;&middot;</span>
    <span class="u-item txt point" :class="{'disabled': currentPage===totalPage}" @click="changePage(currentPage + 1)"><img src="@/assets/common/img/pc/page_right.svg" alt=""></span>
    <span class="u-item txt" :class="{'disabled': currentPage===totalPage}" @click="changePage(totalPage)">尾页</span>
    <span class="u-jump-page">前往 <input type="text" v-model="jumpNumber"/> 页</span>
    <span class="u-item txt" @click="jumpPage(jumpNumber)">确定</span>
  </div>
</template>
<script>
export default {
  name: 'Pager',
  data () {
    return {
      currentPage: this.pageNumber, // 当前页码
      currentSize: this.pageSize, // 分页数
      jumpNumber: '', // 跳转的页码
      forwardMore: false, // 左箭头展示
      backwardMore: false // 右箭头展示
    }
  },
  props: {
    pageNumber: { // 当前页面
      type: Number,
      default: 1
    },
    pageSize: { // 每页显示数量 [10条/页 20条/页 30条/页 40条/页]
      type: Number,
      default: 10
    },
    totalCount: { // 总条数
      type: Number,
      default: 0
    },
    pageListNum: { // 显示的页码数组长度
      type: Number,
      default: 5
    }
  },
  computed: {
    totalPage () { // 总页数
      return Math.ceil(this.totalCount / this.currentSize) // 向上取整
    },
    pageList () { // 获取显示的页码数组
      return this.dealPageList(this.currentPage)
    }
  },
  watch: {
    currentPage (to, from) {
      // 通过更改当前页码，修改分页数据
      this.$emit('changePage', { currentPage: to, currentSize: this.currentSize })
    }
  },
  created () {
    // 监听键盘Enter按键
    document.onkeydown = (e) => {
      const ev = e || window.event
      if (ev && ev.keyCode === 13 && this.jumpNumber) {
        this.jumpPage(this.jumpNumber)
      }
    }
  },
  methods: {
    dealPageList (curPage) {
      var resList = []
      var offset = Math.floor(this.pageListNum / 2) // 向下取整
      var pager = {
        start: curPage - offset,
        end: curPage + offset
      }
      if (pager.start < 1) {
        pager.end = pager.end + (1 - pager.start)
        pager.start = 1
      }
      if (pager.end > this.totalPage) {
        pager.start = pager.start - (pager.end - this.totalPage)
        pager.end = this.totalPage
      }
      if (pager.start < 1) {
        pager.start = 1
      }
      if (pager.start > 1) {
        this.forwardMore = true
      } else {
        this.forwardMore = false
      }
      if (pager.end < this.totalPage) {
        this.backwardMore = true
      } else {
        this.backwardMore = false
      }
      // 生成要显示的页码数组
      for (let i = pager.start; i <= pager.end; i++) {
        resList.push(i)
      }
      return resList
    },
    onEnterForward () {
      this.$refs.forward.innerHTML = '&laquo;'
    },
    onLeaveForward () {
      this.$refs.forward.innerHTML = '&middot;&middot;&middot;'
    },
    onEnterBackward () {
      this.$refs.backward.innerHTML = '&raquo;'
    },
    onLeaveBackward () {
      this.$refs.backward.innerHTML = '&middot;&middot;&middot;'
    },
    onForward () {
      this.currentPage = this.currentPage - this.pageListNum > 0 ? this.currentPage - this.pageListNum : 1
    },
    onBackward () {
      this.currentPage = this.currentPage + this.pageListNum < this.totalPage ? this.currentPage + this.pageListNum : this.totalPage
    },
    jumpPage (jumpNum) {
      if (Number(jumpNum)) {
        if (Number(jumpNum) < 1) {
          jumpNum = 1
        }
        if (Number(jumpNum) > this.totalPage) {
          jumpNum = this.totalPage
        }
        this.changePage(Number(jumpNum))
      }
      this.jumpNumber = '' // 清空跳转输入框
    },
    changePage (pageNum) {
      if (this.currentPage !== pageNum) { // 点击的页码不是当前页码
        this.currentPage = pageNum
      }
    }
  }
}
</script>
<style lang="less" scoped>
@themeColor: #D93844; // 自定义主题色
.m-pager-wrap { 
  height: 32px;
  line-height: 30px;
  font-size: 16px;
  color: #888;
  text-align: center;
  .u-text {
    margin-right: 5px;
  }
  .u-item {
    margin-right: 10px;
    min-width: 30px;
    display: inline-block;
    user-select: none; // 禁止选取文本
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      .active();
    }
  }
  .active {
    color: #fff;
    background: @themeColor;
    border: 1px solid @themeColor;
  }
  .disabled {
    pointer-events: none;
    color: rgba(0,0,0,.25);
    background: #fff;
    border: 1px solid #d9d9d9;
  }
  .txt {
    padding: 0 6px;
  }
  .point{
    padding: 0 1px;
  }
  .u-ellipsis {
    display: inline-block;
    width: 32px;
    margin-right: 5px;
    cursor: pointer;
    &:hover {
      color: @themeColor;
    }
  }
  .u-jump-page {
    margin: 0 8px 0 3px;
    input {
      width: 55px;
      height: 30px;
      padding: 5px 8px;
      margin: 0 5px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      text-align: center;
    }
  }
}
</style>