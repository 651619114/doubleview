<template>
  <div>
    <div class="load" v-if="status == 'loading'">连接服务器中...</div>

    <div v-else-if="status == 'wait'" class="wait-page">
      <div class="left">
        <div v-if="waitstatus == 'shelve'">已拒绝面试</div>
        <div v-else-if="waitstatus == 'end'">面试已结束</div>
        <div v-else>等待老师邀请</div>
      </div>
      <div class="wxchat-container" :style="{ backgroundColor: wrapBg }">
        <div
          class="window"
          id="window-view-container"
          :style="{ maxHeight: maxHeight + 'px', width: width + 'px' }"
        >
          <div class="loading" v-if="dataArray.length == 0">
            <div style="margin-top: 300px">
              <div>加载中...</div>
            </div>
          </div>

          <ScrollLoader
            ref="child"
            :minHeight="minHeight"
            @scroll-to-top="refresh"
            class="container-main"
            :style="{ maxHeight: maxHeight - 50 + 'px' }"
          >
            <div class="message">
              <ul class="chat-list">
                <li
                  v-for="message in dataArray"
                  :key="message.id"
                  :class="
                    message.direction == 2 ? 'an-move-right' : 'an-move-left'
                  "
                >
                  <p class="time"><span v-text="message.time"></span></p>

                  <div
                    :class="'main' + (message.direction == 2 ? ' self' : '')"
                  >
                    <img class="avatar" width="45" height="45" :src="img1" />
                    <!-- 文本 -->
                    <div class="text">
                      <span v-text="message.content"></span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </ScrollLoader>
        </div>
        <input type="text" v-model="content" />
        <input type="button" value="发送" @click="send()" />
      </div>

      <div class="right">
        <div v-if="waitstatus == 'end'">
          PS：面试已结束。如非正常结束面试，请联系老师进行二次面试。
        </div>
        <div v-if="waitstatus == 'shelve'">
          PS：已拒绝面试，如果想继续面试请与面试官联系
        </div>
        <div v-else>
          <div class="line1">
            前面还有<span>{{ position }}</span
            >人等候
          </div>
          <div class="line1">
            预计<span>{{ waitTime }}</span
            >分钟后面试
          </div>
        </div>
      </div>
      <div class="openbg" :class="open ? 'active' : ''">
        <div class="open open1" @click.stop="stopClick($event)">
          <div class="title">进入面试房间</div>
          <div class="desc">
            PS：请在30秒内点击确定，如30秒内未点击确定，可以点击重新进入，点击重新进入后将在面试列表最后一位。点击退出将退出考场。
          </div>
          <div class="open-btn">
            <div class="confirm" @click="tohouse()">
              {{ entertimer }}
            </div>
            <div @click="tohome()">取消</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="status == 'room'" class="test-room">
      <div class="wxchat-container" :style="{ backgroundColor: wrapBg }">
        <div
          class="window"
          id="window-view-container"
          :style="{ maxHeight: maxHeight + 'px', width: width + 'px' }"
        >
          <div class="loading" v-if="dataArray.length == 0">
            <div style="margin-top: 300px">
              <div>加载中...</div>
            </div>
          </div>

          <ScrollLoader
            ref="child"
            :minHeight="minHeight"
            @scroll-to-top="refresh"
            class="container-main"
            :style="{ maxHeight: maxHeight - 50 + 'px' }"
          >
            <div class="message">
              <ul class="chat-list">
                <li
                  v-for="message in dataArray"
                  :key="message.id"
                  :class="
                    message.direction == 2 ? 'an-move-right' : 'an-move-left'
                  "
                >
                  <p class="time"><span v-text="message.time"></span></p>

                  <div
                    :class="'main' + (message.direction == 2 ? ' self' : '')"
                  >
                    <img class="avatar" width="45" height="45" :src="img1" />
                    <!-- 文本 -->
                    <div class="text">
                      <span v-text="message.content"></span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </ScrollLoader>
        </div>
        <input type="text" v-model="content" v-if="isclose" />
        <input type="button" value="发送" @click="send()" v-if="isclose" />
      </div>
      <div class="room-cont">
        <div class="room-cont-left" v-if="role == 'teach'">
          <div v-for="item in stuList" v-bind:key="item.ud">
            <div class="stu_list">
              {{ item.un }}-{{ item.status }}
              <button @click="invite(item.ud, item.gd)">邀请</button>
            </div>
          </div>
        </div>
        <div class="room-cont-cont">
          <div class="lists swiper-container">
            <div class="swiper-wrapper">
              <div
                class="list swiper-slide"
                :class="item.talking ? 'two' : ''"
                v-for="item in teachList"
                v-bind:key="item.user_id"
              >
                <p class="listbg">{{ item.loading }}</p>
                <div class="box">
                  <div class="network-qa">
                    <div
                      class="net net1"
                      :class="
                        item.quality <= 5 && item.quality >= 1
                          ? 'colorgreen'
                          : ''
                      "
                    ></div>
                    <div
                      class="net net2"
                      :class="
                        item.quality <= 4 && item.quality >= 1
                          ? 'colorgreen'
                          : ''
                      "
                    ></div>
                    <div
                      class="net net3"
                      :class="
                        item.quality <= 3 && item.quality >= 1
                          ? 'colorgreen'
                          : ''
                      "
                    ></div>
                    <div
                      class="net net4"
                      :class="
                        item.quality <= 2 && item.quality >= 1
                          ? 'colorgreen'
                          : ''
                      "
                    ></div>
                    <div
                      class="net net5"
                      :class="item.quality == 1 ? 'colorgreen' : ''"
                    ></div>
                  </div>
                  <p>
                    <img
                      v-if="item.mkf == 1"
                      src="../../../../../static/pc/chat/mkf.png"
                      alt=""
                    />
                    <img
                      v-else-if="item.mkf == 2"
                      src="../../../../../static/pc/chat/icon_mkf_on.png"
                      alt=""
                    />
                    <img
                      v-else
                      src="../../../../../static/pc/chat/icon_mkf_off.png"
                      alt=""
                    />
                  </p>
                  <span>面试官</span>
                </div>
                <div class="top-box" :id="'teacher_' + item.user_id"></div>
              </div>
            </div>
          </div>
          <div class="room-cont-middle">
            <div class="box" id="bigbox">
              <div class="network-qa">
                <div
                  class="net net1"
                  :class="
                    main_teachQa <= 5 && main_teachQa >= 1 ? 'colorgreen' : ''
                  "
                ></div>
                <div
                  class="net net2"
                  :class="
                    main_teachQa <= 4 && main_teachQa >= 1 ? 'colorgreen' : ''
                  "
                ></div>
                <div
                  class="net net3"
                  :class="
                    main_teachQa <= 3 && main_teachQa >= 1 ? 'colorgreen' : ''
                  "
                ></div>
                <div
                  class="net net4"
                  :class="
                    main_teachQa <= 2 && main_teachQa >= 1 ? 'colorgreen' : ''
                  "
                ></div>
                <div
                  class="net net5"
                  :class="main_teachQa == 1 ? 'colorgreen' : ''"
                ></div>
              </div>
              <p>
                <img
                  v-if="tea_mkf == 1"
                  src="../../../../../static/pc/chat/icon_mkf.png"
                  alt=""
                />
                <img
                  v-else
                  src="../../../../../static/pc/chat/icon_mkf_off.png"
                  alt=""
                />
              </p>
            </div>
            <p class="listbg">{{ loading.big }}</p>
          </div>
          <div class="btn">
            <div class="btn-left">
              <div class="sxt" @click="agoraCameraSet()">
                <img
                  v-if="sxton"
                  src="../../../../../static/pc/chat/icon_sxt.png"
                  alt=""
                />
                <img
                  v-else
                  src="../../../../../static/pc/chat/icon_sxt_off.png"
                  alt=""
                />
                <p>摄像头</p>
              </div>
              <div class="mkf" @click="agoraMicrophoneSet()">
                <img
                  v-if="mkfon"
                  src="../../../../../static/pc/chat/icon_mkf.png"
                  alt=""
                />
                <img
                  v-else
                  src="../../../../../static/pc/chat/icon_mkf_off.png"
                  alt=""
                />
                <p>麦克风</p>
              </div>
              <!-- <div class="pmgx">
          <img src="../../../../../static/pc/chat/icon_pingmu.png" alt="" />
          <p>共享屏幕</p>
        </div> -->
            </div>
            <div class="phone" @click="stopStu()">
              <div class="kuang">
                <img src="../../../../../static/pc/chat/phone.png" alt="" />
              </div>
              <p>挂断</p>
            </div>
            <div class="time">面试时长：{{ faceTime }}</div>
          </div>
        </div>
        <div class="room-cont-right">
          <div class="item">
            <div class="box" id="box" ref="mydiv">
              <div class="network-qa">
                <div
                  class="net net1"
                  :class="selfQa <= 5 && selfQa >= 1 ? 'colorgreen' : ''"
                ></div>
                <div
                  class="net net2"
                  :class="selfQa <= 4 && selfQa >= 1 ? 'colorgreen' : ''"
                ></div>
                <div
                  class="net net3"
                  :class="selfQa <= 3 && selfQa >= 1 ? 'colorgreen' : ''"
                ></div>
                <div
                  class="net net4"
                  :class="selfQa <= 2 && selfQa >= 1 ? 'colorgreen' : ''"
                ></div>
                <div
                  class="net net5"
                  :class="selfQa == 1 ? 'colorgreen' : ''"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="changeclose()">开关</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "swiper/css/swiper.css";
import "@/assets/pc/video/css/video_chat.css";
import ScrollLoader from "../../../../components/chat/scroll.vue";
import { reqGroupHistory } from "../../../../apis/get_group_history.api";
import { getToken } from "../../../../apis/get_token.api";
import Swiper from "swiper";

export default {
  components: {
    ScrollLoader,
  },
  data() {
    return {
      isLoading: true,
      wait: true,
      gd: this.$route.query.gd.toString(),
      name: this.$route.query.name,
      time: 30,
      entertimer: "确定（ 30 ）",
      open: 0,
      timer: "",
      app_id: "",
      room_token: "",
      sxton: true,
      mkfon: true,
      rtc: {
        client: null,
        localAudioTrack: null,
        localVideoTrack: null,
      },
      teachList: {},
      position: 0,
      waitTime: 0,
      heart: "",
      selfQa: 0,
      ud: this.$route.query.ud,
      g_ud: null,
      teachQa: {},
      main_teachQa: 0,
      tea_mkf: 1,
      faceTime: "00:00:00",
      faceTimer: "",
      loading: { big: "未连接" },
      isUpperLaoding: false,
      isRefreshedAll: false,
      isLoadedAll: false,
      websock: null,
      reconnectData: null,
      lockReconnect: false, //避免重复连接，因为onerror之后会立即触发 onclose
      minHeight: 400,
      dataArray: [],
      page: 0,
      content: "",
      img1: require("../../../../../static/pc/chat/avatar1.png"),
      img2: require("../../../../../static/pc/chat/avatar2.png"),
      timeout: 20 * 1000,
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      role: null,
      stuList: null,
      remoteUsers: {},
      options: {},
      status: "loading",
      waitstatus: null,
      isclose: true,
    };
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
      default: 400,
    },
  },
  created() {
    window.addEventListener("beforeunload", (e) => this.closeWebsocket(e));
  },
  mounted() {
    //先初始化ws 初始化之后调用token 并关闭加载页面
    this.initWebSocket();
    this.initSwiper();
  },
  methods: {
    // 提示
    tips(cont) {
      var that = this;
      this.$alert(cont, "", {
        confirmButtonText: "确定",
        center: true,
        customClass: "scene-dialog",
      }).then(() => {
        that.$router.go(0);
      });
    },

    /**
     * @Description: 聊天逻辑上拉刷新
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
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
          ud: me.ud,
          gd: me.gd,
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
        this.$message("获取记录失败");
      }
      me.isUpperLaoding = false;
    },

    /**
     * @Description: 获取token
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */

    async getAgoraToken() {
      console.log("开始获取token");
      await getToken({
        ud: this.g_ud,
        gd: this.gd,
        format: "json",
      }).then((d) => {
        console.log(d);

        if (d.code == "1000") {
          this.room_token = d.data.token;
          this.app_id = d.data.appid;
        } else {
          this.$alert(d.data.msg, "warning");
        }
      });
    },

    /**
     * @Description: ws初始化
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    initWebSocket() {
      let wsurl = "ws://192.168.0.44:9501";
      this.websock = new WebSocket(wsurl);
      this.websock.onopen = this.websocketonopen; //连接成功
      this.websock.onmessage = this.websocketonmessage; //广播成功
      this.websock.onerror = this.websocketonerror; //连接断开，失败
      this.websock.onclose = this.websocketclose; //连接关闭
    },

    /**
     * @Description: 初始化ws
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    websocketonopen() {
      console.log("连接成功");
      this.heatBeat();
      this.websocketsend({
        type: "interview",
        gd: this.gd,
        ud: this.ud,
        name: this.name,
      });
    },

    /**
     * @Description: 连接失败
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    websocketonerror(err) {
      console.log(err);
      this.reconnect();
      this.lockReconnect = true;
    },

    /**
     * @Description: 关闭链接
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    websocketclose() {
      console.log("断开连接");
      this.reconnect();
    },

    /**
     * @Description: 收到消息
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    websocketonmessage(data) {
      //心跳重置
      this.reset();

      //收到消息后
      let msgData = JSON.parse(data.data);

      console.log(msgData);
      if (msgData.type == "heartbeat") {
        return;
      }

      //如果code不为10000则说明有错误 直接输出弹窗
      if (msgData.code != "10000") {
        this.$alert(msgData.err, "warning");
      }

      if (msgData.type == "teach") {
        //如果是面试官身份 请求token并关闭loading
        //如果是面试官 uid前拼接1001 g_ud是agora用的id
        this.g_ud = parseInt("1001" + this.ud);
        this.role = "teach";
        this.getAgoraToken().then((d) => {
          //此时已经拿到token  通过token 走agora的初始化
          //获取聊天记录
          reqGroupHistory({
            page: this.page,
            ud: this.ud,
            gd: this.gd,
            format: "json",
          }).then((d) => {
            this.dataArray = d.data.data.concat(this.dataArray); //倒序合并
            this.page = d.data.current_page + 1;
            this.status = "room";
            if (this.room_token != "") {
              this.agoraStartCall();
            }
          });
        });
      } else if (msgData.type == "stu") {
        console.log(msgData);
        var that = this;

        //如果是面试官身份 请求token并关闭loading
        //如果是面试官 uid前拼接1001 g_ud是agora用的id
        this.g_ud = parseInt("1002" + this.ud);
        this.role = "stu";
        this.getAgoraToken().then((d) => {
          //此时已经拿到token  通过token 获取历史记录
          //获取聊天记录
          reqGroupHistory({
            page: this.page,
            ud: this.ud,
            gd: this.gd,
            format: "json",
          }).then((d) => {
            this.dataArray = d.data.data.concat(this.dataArray); //倒序合并
            this.page = d.data.current_page + 1;
          });

          //如果之前是正在面试的状态 直接进入面试间
          if (msgData.data.status == "involve") {
            clearInterval(that.timer);
            that.agoraStartCall();
            var timerr = setInterval(function () {
              if (that.ud != "") {
                that.recoder("start");
                clearInterval(timerr);
              }
            }, 200);
          } else {
            this.status = "wait";
          }
        });
      } else if (msgData.type == "invite") {
        this.open = 1;
        this.getTimer();
      } else if (msgData.type == "member") {
        //服务器判定是老师 主动推送 成员列表
        if (this.role == "teach") {
          this.stuList = msgData.data;
        }
      } else if (msgData.type == "end") {
        //服务器判定是老师 主动推送 成员列表
        if (this.role == "stu") {
          this.$alert(msgData.data.msg, "提示", {
            confirmButtonText: "确定",
            callback: (action) => {
              window.location.href = "http://127.0.0.1:8080/";
            },
          });
        }
      } else if (msgData.type == "groupPush") {
        let msg = [
          {
            direction: msgData.ud == this.ud ? 2 : 1, //为2表示微信主人发出的消息，1表示联系人
            id: msgData.time, //根据这个来排序消息
            content: msgData.content, //当type为1时这里是文本消息，当type2为2时这里要存放图片地址；后续会支持语音的显示
            ctime: new Date().toLocaleString(), //显示当前消息的发送时间
          },
        ];
        this.dataArray = this.dataArray.concat(msg); //直接合并
        this.$refs.child.scrollToBottom();
      } else if (msgData.type == "close") {
        this.isclose = msgData.data.close;
      }
    },

    /**
     * @Description: 消息格式化
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    websocketsend(data) {
      this.websock.send(JSON.stringify(data));
    },

    /**
     * @Description: 重连逻辑
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
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
    },

    /**
     * @Description: 心跳
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    heatBeat() {
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
      self.timeoutObj = setTimeout(function () {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websock.readyState == 1) {
          //如果连接正常
          self.websocketsend({ type: "heartbeat", ping: "pong" });
        } else {
          //否则重连
          self.reconnect();
        }
        self.serverTimeoutObj = setTimeout(function () {
          //超时关闭
          self.websock.close();
        }, self.timeout);
      }, self.timeout);
    },

    /**
     * @Description: 重置心跳
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    reset() {
      //重置心跳
      var that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      //重启心跳
      that.heatBeat();
    },

    /**
     * @Description: 发送群聊消息
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    send() {
      this.websocketsend({
        type: "groupPush",
        content: this.content,
        gd: this.gd,
        is_group: 1,
        ud: this.ud,
      });
    },

    initSwiper() {
      new Swiper(".swiper-container", {
        slidesPerView: "auto",
        observer: true,
        observeParents: true,
      });
    },

    /**
     * @Description: 时间格式化
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    getTimer() {
      var that = this;
      if (this.timer) {
        return false;
      }
      let time = this.time;
      that.timer = setInterval(function () {
        time--;
        that.entertimer = "确定（ " + time + " ）";
        if (time <= 0) {
          clearInterval(that.timer);
          that.open = false;
          that.websocketsend({ type: "shelve", ud: that.ud, gd: that.gd });
        }
      }, 1000);
    },

    /**
     * @Description: 返回的逻辑
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    tohome() {
      this.open = false;
      clearInterval(this.timer);
      this.websocketsend({ type: "shelve", ud: this.ud, gd: this.gd });
      this.entertimer = "确定（30）";
    },

    /**
     * @Description: 时间格式化
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    timeFormat(time) {
      var hour = Math.floor(time / (3600 * 1000));
      var min = Math.floor((time % (3600 * 1000)) / (60 * 1000));
      var sec = Math.round(((time % (3600 * 1000)) % (60 * 1000)) / 1000);
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      var t = hour + ":" + min + ":" + sec;
      return t;
    },

    /**
     * @Description: 计算面试时长
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    calFaceTime(uid) {
      var that = this;
      var start_time = localStorage.getItem(that.gd + "_" + uid + "_time");
      var current_time = new Date().getTime();
      var time = current_time - start_time;
      var t = that.timeFormat(time);
      that.faceTime = t;
    },
    stopClick(e) {
      e.stopPropagation();
    },

    /**
     * @Description: 去面试的页面
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    tohouse() {
      var that = this;
      clearInterval(that.timer);
      this.websocketsend({ type: "involve", ud: this.ud, gd: this.gd });
      this.agoraStartCall();
      var timerr = setInterval(function () {
        if (that.ud != "") {
          that.recoder("start");
          clearInterval(timerr);
        }
      }, 200);
    },

    /**
     * @Description: 停止面试
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    stopStu() {
      var that = this;
      that.agoraLeaveCall();
      that.websocketsend({
        type: "end",
        ud: that.ud,
        gd: that.gd,
        role: that.role,
        face_time: that.faceTime,
      });
      if (that.role == "stu") {
        that.recoder("end");
        that.status = "wait";
        that.waitStatus = "end";
      } else {
        window.location.href = "http://127.0.0.1:8080/";
      }
    },

    /**
     * @Description: 声网逻辑
     * @Author: xingmf
     * @Date: 2022-07-06 10:59:05
     * @LastEditors: xingmf
     * @LastEditTime: 2022-07-28 19:49:41
     * @FilePath: /doubleview/src/views/pc/double/video/video_wait.vue
     */
    async agoraStartCall() {
      this.$AgoraRTC.setLogLevel(2);

      var that = this;
      that.status = "room";
      that.open = 0;
      that.options = {
        appId: that.app_id,
        channel: that.gd,
        token: that.room_token,
      };

      //创建声网客户端
      that.rtc.client = that.$AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      if (that.role == "stu") {
        // ,
        var time = localStorage.getItem(that.gd + "_" + that.g_ud + "_time");

        if (time == null) {
          localStorage.setItem(
            that.gd + "_" + that.g_ud + "_time",
            new Date().getTime()
          );
        }

        that.faceTimer = setInterval(function () {
          that.calFaceTime(that.g_ud);
        }, 1000);
      }

      // 订阅远端用户
      that.rtc.client.on("user-published", async (user, mediaType) => {
        // 开始订阅远端用户。
        await that.rtc.client.subscribe(user, mediaType);

        if (that.role == "teach") {
          // ,
          var time = localStorage.getItem(that.gd + "_" + user.uid + "_time");

          if (time == null) {
            localStorage.setItem(
              that.gd + "_" + user.uid + "_time",
              new Date().getTime()
            );
          }

          that.faceTimer = setInterval(function () {
            that.calFaceTime(user.uid);
          }, 1000);
        }

        // 表示本次订阅的是视频。
        if (mediaType === "video") {
          // 订阅完成后，从 `user` 中获取远端视频轨道对象。
          const remoteVideoTrack = user.videoTrack;

          // 订阅完成，播放远端音视频。
          // 传入 DIV 节点，让 在这个节点下创建相应的播放器播放远端视频。
          //对端获取的全部放到大框
          remoteVideoTrack.play("bigbox");
        }

        // 表示本次订阅的是音频。
        if (mediaType === "audio") {
          // 订阅完成后，从 `user` 中获取远端音频轨道对象。
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
        }
      });

      // 监听声音的方法
      this.rtc.client.enableAudioVolumeIndicator();
      this.rtc.client.on("volume-indicator", (volumes) => {
        volumes.forEach((volume, index) => {});
      });

      // 订阅当前网络质量
      that.rtc.client.on("network-quality", (stats) => {
        if (stats.downlinkNetworkQuality <= stats.uplinkNetworkQuality) {
          that.selfQa = stats.uplinkNetworkQuality;
        } else {
          that.selfQa = stats.downlinkNetworkQuality;
        }
      });

      // 加入目标频道
      await that.rtc.client.join(
        that.options.appId,
        that.options.channel,
        that.options.token,
        that.g_ud
      );

      // 创建并发布本地音视频轨道
      //TODO::如果没有获取默认设备  后面加
      const [localAudioTrack, localVideoTrack] =
        await that.$AgoraRTC.createMicrophoneAndCameraTracks(
          {
            cameraId: localStorage.getItem("selectedCameraId"),
            encoderConfig: "360p_1",
          },
          { microphoneId: localStorage.getItem("selectedMicrophoneId") }
        );

      await that.rtc.client.publish([localAudioTrack, localVideoTrack]);
      localVideoTrack.play("box");
      that.rtc.localAudioTrack = localAudioTrack;
      that.rtc.localVideoTrack = localVideoTrack;

      // 判断是否有session
      if (sessionStorage.getItem("mkfon")) {
        that.mkfon = parseInt(sessionStorage.getItem("mkfon")) ? false : true;
        that.agoraMicrophoneSet();
      }
    },

    // 暂时停用启用麦克风采集
    async agoraMicrophoneSet() {
      var that = this;
      if (that.mkfon) {
        that.mkfon = false;
        sessionStorage.setItem("mkfon", 0);
      } else {
        that.mkfon = true;
        sessionStorage.setItem("mkfon", 1);
      }
      await that.rtc.localAudioTrack.setEnabled(that.mkfon);
    },

    // // 暂时停用启用摄像头采集
    async agoraCameraSet() {
      var that = this;
      if (that.sxton) {
        that.sxton = false;
      } else {
        that.sxton = true;
      }
      await that.rtc.localVideoTrack.setEnabled(that.sxton);
    },

    // 离开频道
    async agoraLeaveCall() {
      var that = this;
      // 销毁本地音视频轨道。
      that.rtc.localAudioTrack.close();
      that.rtc.localVideoTrack.close();

      // 遍历远端用户。
      that.rtc.client.remoteUsers.forEach((user) => {
        // 销毁动态创建的 DIV 节点。
        const playerContainer = document.getElementById("box");
        playerContainer && playerContainer.remove();
      });
      await that.rtc.client.leave();

      clearInterval(that.faceTimer);
      that.faceTime = "00:00:00";
      // 清空状态
      // that.mkfon = false;
      // that.sxton = false;

      // 离开频道。
    },

    // 开始录制
    async recoder(status) {
      console.log(status);
      var that = this;
      const url = this.$Config.videoUrl + "/auth/recorder.php";
      const params = {
        act: status,
        channel: that.gd,
        uid: that.ud,
      };
      await axios.get(url, {
        params: params,
      });
    },
    closeWebsocket: (e) => {
      if (this.websock) {
        this.lockReconnect = true;
        this.websock.close();
      }
    },

    invite(ud, gd) {
      this.websocketsend({ type: "invite", ud: ud, gd: gd });
    },
    changeclose() {
      this.websocketsend({
        type: "close",
        close: !this.isclose,
        ud: this.ud,
        gd: this.gd,
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    this.stopWs();
    this.agoraLeaveCall();
    clearInterval(this.heart);
    next();
  },

  beforeDestroy() {
    //卸载事件
    window.removeEventListener("beforeunload", (e) => this.closeWebsocket(e));
  },
};
</script>
