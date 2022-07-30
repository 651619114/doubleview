//微信聊天可视化组件
//依赖scrollLoader组件, 依赖指令v-emotion（实现请查看main.js）

//参数：
// width               组件宽度，默认450
// wrapBg              外层父元素背景颜色，默认#efefef
// maxHeight           展示窗口最高高度, 默认900
// contactAvatarUrl    好友头像url
// ownerAvatarUrl      微信主人头像url
// ownerNickname       微信主人昵称
// getUpperData        （必需）当滚动到上方时加载数据的方法，返回值要为Promise对象，resolve的结构同data
// getUnderData        （必需）当滚动到下方时加载数据的方法，返回值同上
// data                （必需）传入初始化数据， 结构如下：
// [{
//     direction: 2, //为2表示微信主人发出的消息，1表示联系人
//     id: 1, //根据这个来排序消息
//     content: '你好!!', //当type为1时这里是文本消息，当type2为2时这里要存放图片地址；后续会支持语音的显示
//     time: new Date().toLocaleString() //显示当前消息的发送时间
// }]


<style scoped>
.wxchat-container {
  width: 100%;
  height: 100%;
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
}
.shadow {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.2;
}
.window {
  box-shadow: 1px 1px 20px -5px #000; /*max-width: 450px;*/
  min-width: 300px;
  background: #f5f5f5;
  margin: 0 auto;
  overflow: hidden;
  padding: 0;
  height: 100%;
  position: relative;
  z-index: 101;
}
button {
  border: 0;
  background: none;
  border-radius: 0;
  text-align: center;
}
button {
  outline: none;
}
.w100 {
  width: 100%;
}
.mt5 {
  margin-top: 5px;
}
.mt10 {
  margin-top: 10px;
}
.mt20 {
  margin-top: 20px;
}
.mb10 {
  margin-bottom: 10px;
}
.mb20 {
  margin-bottom: 20px;
}
.fs0 {
  font-size: 0;
}
.title {
  background: #000;
  text-align: center;
  color: #fff;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
}
.loading,
.no-more {
  text-align: center;
  color: #b0b0b0;
  line-height: 100px;
}
.no-more {
  line-height: 60px;
}
.pull-right {
  float: right;
}
.link-line {
  text-decoration: underline;
}
.message {
  /*height: 100%;*/
  padding: 10px 15px;
  /*overflow-y: scroll;*/
  background-color: #f5f5f5;
}
.message li {
  margin-bottom: 15px;
  left: 0;
  position: relative;
  display: block;
}
.message .time {
  margin: 10px 0;
  text-align: center;
}
.message .text {
  display: inline-block;
  position: relative;
  padding: 0 10px;
  max-width: calc(100% - 75px);
  min-height: 35px;
  line-height: 2.1;
  font-size: 15px;
  padding: 6px 10px;
  text-align: left;
  word-break: break-all;
  background-color: #fff;
  color: #000;
  border-radius: 4px;
  box-shadow: 0px 1px 7px -5px #000;
}
.message .avatar {
  float: left;
  margin: 0 10px 0 0;
  border-radius: 3px;
  background: #fff;
}
.message .time > span {
  display: inline-block;
  padding: 0 5px;
  font-size: 12px;
  color: #fff;
  border-radius: 2px;
  background-color: #dadada;
}
.message .system > span {
  padding: 4px 9px;
  text-align: left;
}
.message .text:before {
  content: " ";
  position: absolute;
  top: 9px;
  right: 100%;
  border: 6px solid transparent;
  border-right-color: #fff;
}
.message .self {
  text-align: right;
}
.message .self .avatar {
  float: right;
  margin: 0 0 0 10px;
}
.message .self .text {
  background-color: #9eea6a;
}
.message .self .text:before {
  right: inherit;
  left: 100%;
  border-right-color: transparent;
  border-left-color: #9eea6a;
}

.message {
  text-align: left;
}
.message .avatar {
  float: left;
  margin: 0 10px 0 0;
}
.message .text {
  background-color: #9eea6a;
}
.message .text:before {
  left: inherit;
  border-right-color: #9eea6a;
  border-left-color: transparent;
}

.message .image {
  max-width: 200px;
}
img.static-emotion-gif,
img.static-emotion {
  vertical-align: middle !important;
}
.an-move-left {
  left: 0;
  animation: moveLeft 0.7s ease;
  -webkit-animation: moveLeft 0.7s ease;
}
.an-move-right {
  left: 0;
  animation: moveRight 0.7s ease;
  -webkit-animation: moveRight 0.7s ease;
}
.bgnone {
  background: none;
}
.main {
  width: 100%;
}
@keyframes moveRight {
  0% {
    left: -20px;
    opacity: 0;
  }
  100% {
    left: 0;
    opacity: 1;
  }
}
@-webkit-keyframes moveRight {
  0% {
    left: -20px;
    opacity: 0;
  }
  100% {
    left: 0px;
    opacity: 1;
  }
}
@keyframes moveLeft {
  0% {
    left: 20px;
    opacity: 0;
  }
  100% {
    left: 0px;
    opacity: 1;
  }
}
@-webkit-keyframes moveLeft {
  0% {
    left: 20px;
    opacity: 0;
  }
  100% {
    left: 0px;
    opacity: 1;
  }
}
@media (max-width: 367px) {
  .fzDInfo {
    width: 82%;
  }
}
</style>

<template>
  <div class="wxchat-container" :style="{ backgroundColor: wrapBg }">
    <div
      class="window"
      id="window-view-container"
      :style="{ maxHeight: maxHeight + 'px', width: width + 'px' }"
    >
      <!-- data is empty -->
      <div class="loading" v-if="dataArray && dataArray.length == 0">
        <div style="margin-top: 300px; text-align: center; font-size: 16px">
          <span>未查找到聊天记录</span>
        </div>
      </div>

      <!-- loading -->
      <div class="loading" v-if="dataArray.length == 0">
        <div style="margin-top: 300px">
          <div>加载中...</div>
        </div>
      </div>

      <div class="title" v-if="dataArray && dataArray.length > 0">
      </div>
      <!-- main -->
      <ScrollLoader
        :minHeight="minHeight"
        @scroll-to-top="refresh"
        class="container-main"
        v-if="dataArray && dataArray.length > 0"
        :style="{ maxHeight: maxHeight - 50 + 'px' }"
        ref="child"
      >
        <div class="message">
          <ul class="chat-list">
            <li
              v-for="message in dataArray"
              :key="message.id"
              :class="message.direction == 2 ? 'an-move-right' : 'an-move-left'"
            >
              <p class="time"><span v-text="message.time"></span></p>
              
              <div :class="'main' + (message.direction == 2 ? ' self' : '')">
                <img
                  class="avatar"
                  width="45"
                  height="45"
                  :src="
                    message.direction == 2 ? ownerAvatarUrl : contactAvatarUrl
                  "
                />
                <!-- 文本 -->
                <div class="text"><span v-text="message.content"></span></div>
              </div>
            </li>
          </ul>
        </div>
      </ScrollLoader>
      

    </div>
    <input type="text" v-model="content"/>
      <input type="button" value="发送" @click="send()"/>
  </div>
</template>

<script>
import ScrollLoader from "./scroll.vue";
import { reqGroupHistory } from "../../apis/get_group_history.api.js";
export default {
  name: "wxChat",
  components: {
    ScrollLoader,
  },
  props: {
    width: {
      type: Number,
      default: 450,
    },
    wrapBg: {
      type: String,
      default: "#efefef",
    },
    maxHeight: {
      type: Number,
      default: 700,
    },
    contactAvatarUrl: {
      type: String,
    },
    ownerAvatarUrl: {
      type: String,
    },
    getUpperData: {
      type: Function,
      required: true,
    },
    getUnderData: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isUpperLaoding: false,
      isRefreshedAll: false,
      isLoadedAll: false,
      websock: null,
      reconnectData: null,
      lockReconnect: false, //避免重复连接，因为onerror之后会立即触发 onclose
      timeout: 10000, //10s一次心跳检测
      timeoutObj: null,
      serverTimeoutObj: null,
      minHeight: 700,
      dataArray: [],
      page: 0,
      content:""
    };
  },
  created() {
    this.initWebSocket();
  },
  mounted() {
    //document.getElementsByTagName('body')[0].scrollTop=0;
    this.minHeight = document.getElementById(
      "window-view-container"
    ).offsetHeight;
    // this.maxHeight = document.getElementById('window-view-container').offsetHeight;
  },
  methods: {
    //向上拉刷新
    refresh(done) {
      var me = this;
      if (me.isUpperLaoding) {
        return;
      }
      if (me.isRefreshedAll) {
        done(true);
        me.isUpperLaoding = false;
        return;
      }

      try {
        reqGroupHistory({
          page: me.page,
          ud: 1,
          gd: 1,
          format: "json",
        }).then((d) => {
          if (d.data.data.length == 0) {
            me.isRefreshedAll = true;
            done(true); 
          } else {
            me.dataArray = d.data.data.concat(me.dataArray); //倒序合并
            me.page = d.data.current_page + 1;
            done();
          }
        });
      } catch (error) {
        console.error(
          'wxChat: props "getUpperData" must return a promise object!'
        );
      }
      me.isUpperLaoding = false;
    },

    initWebSocket() {
      let wsurl = "ws://127.0.0.1:9501";
      this.websock = new WebSocket(wsurl);
      this.websock.onopen = this.websocketonopen; //连接成功
      this.websock.onmessage = this.websocketonmessage; //广播成功
      this.websock.onerror = this.websocketonerror; //连接断开，失败
      this.websock.onclose = this.websocketclose; //连接关闭
    }, //初始化weosocket
    websocketonopen() {
      console.log("连接成功");
      this.heatBeat();
      this.websocketsend({
        type: "init",
        gd: 1,
        role: "m",
        is_group: 1,
        ud: 1,
      });

      reqGroupHistory({
        page: this.page,
        ud: 1,
        gd: 1,
        format: "json",
      }).then((d) => {
        this.dataArray = d.data.data.concat(this.dataArray); //倒序合并
        this.page = d.data.current_page + 1;
      });
    }, //连接成功
    websocketonerror(err) {
      console.log("连接失败");
      console.log(err);
      this.reconnect();
    }, //连接失败
    websocketclose() {
      console.log("断开连接");
      this.reconnect();
    }, //各种问题导致的 连接关闭
    websocketonmessage(data) {
      this.heatBeat();
      //收到消息后
      let msgData = JSON.parse(data.data);
      console.log(msgData);
      if (msgData.type == "heartbeat") {
        return;
      }
      let msg = [
        {
          direction: msgData.ud == 1?2:1, //为2表示微信主人发出的消息，1表示联系人
          id: msgData.time, //根据这个来排序消息
          content: msgData.content, //当type为1时这里是文本消息，当type2为2时这里要存放图片地址；后续会支持语音的显示
          ctime: new Date().toLocaleString(), //显示当前消息的发送时间
        },
      ];
      console.log(msg);
      this.dataArray = this.dataArray.concat(msg); //直接合并
      this.$refs.child.scrollToBottom();
    },
    websocketsend(data) {
      this.websock.send(JSON.stringify(data));
    }, //数据发送
    reconnect() {
      if (this.lockReconnect) {
        //这里很关键，因为连接失败之后之后会相继触发 连接关闭，不然会连接上两个 WebSocket
        return;
      }
      this.lockReconnect = true;
      this.reconnectData && clearTimeout(this.reconnectData);
      this.reconnectData = setTimeout(() => {
        this.initWebSocket();
        this.lockReconnect = false;
      }, 5000);
    }, //socket重连
    heatBeat() {
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setTimeout(() => {
        this.websocketsend({ type: "heartbeat" }); //根据后台要求发送
        this.serverTimeoutObj = setTimeout(() => {
          this.websock.close(); //如果  5秒之后我们没有收到 后台返回的心跳检测数据 断开socket，断开后会启动重连机制
        }, 5000);
      }, this.timeout);
    },
    initWidth() {
      var ua = navigator.userAgent;
      var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isMobile = isIphone || isAndroid;
      //非移动端设置400px宽度，移动端是100%
      if (!isMobile) {
        this.width = 400;
      }
    },
    send(){
      this.websocketsend({
        type: "groupPush",
        content:this.content,
        gd: 1,
        is_group: 1,
        ud: 1
      });
    }
  },
};
</script>