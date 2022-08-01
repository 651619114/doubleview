<template>
  <!-- 头部 -->
  <div class="baycheck">
    <div class="maincheck">
      <div class="view-process">
        <div class="cont">
          v
          <div class="step2-cont">
            <div class="title_jiance">
              <!-- <img src="@/views/pc/img/cloudDouble/jiance1.png" /> -->
              <div class="title_neirong">检测内容（第一步</div>
            </div>
            <!-- <div class="title">检测内容（第一步）{{ ud }}</div> -->
            <div class="item">
              <div class="left">麦克风列表：</div>
              <el-select
                class="select middle"
                v-model="audioDevice"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in audioDevices"
                  :key="item.deviceId"
                  :label="item.label"
                  :value="item.deviceId"
                  @click.native="changeAudio(item)"
                >
                </el-option>
              </el-select>
              <el-button
                type="success"
                class="right_start"
                @click="agoraDeviceCheck()"
                >开始测试</el-button
              >
            </div>
            <div class="item">
              <div class="left">摄像头列表：</div>
              <el-select
                class="select middle"
                v-model="videoDevice"
                placeholder="请选择"
                @change="changeVideo"
              >
                <el-option
                  v-for="item in videoDevices"
                  :key="item.deviceId"
                  :label="item.label"
                  :value="item.deviceId"
                >
                </el-option>
              </el-select>
            </div>
            <div class="title_jiance">
              <!-- <img src="@/views/pc/img/cloudDouble/jiance2.png" /> -->
              <div class="title_neirong jiancejieguo">检测结果</div>
            </div>
            <!-- <div class="title">检测结果</div> -->
            <div class="item audio">
              <div class="left">声音检测区：</div>
              <div class="right">
                <div
                  class="audio1"
                  :class="audioNum >= 0 ? 'color1' : ''"
                ></div>
                <div
                  class="audio2"
                  :class="audioNum >= 10 ? 'color1' : ''"
                ></div>
                <div
                  class="audio3"
                  :class="audioNum >= 20 ? 'color1' : ''"
                ></div>
                <div
                  class="audio4"
                  :class="audioNum >= 30 ? 'color1' : ''"
                ></div>
                <div
                  class="audio5"
                  :class="audioNum >= 40 ? 'color1' : ''"
                ></div>
                <div
                  class="audio6"
                  :class="audioNum >= 50 ? 'color1' : ''"
                ></div>
                <div
                  class="audio7"
                  :class="audioNum >= 60 ? 'color2' : ''"
                ></div>
                <div
                  class="audio8"
                  :class="audioNum >= 70 ? 'color2' : ''"
                ></div>
                <div
                  class="audio9"
                  :class="audioNum >= 80 ? 'color2' : ''"
                ></div>
                <div
                  class="audio10"
                  :class="audioNum >= 90 ? 'color2' : ''"
                ></div>
              </div>
            </div>
            <div class="item">
              <div class="left">音频播放器：</div>
            </div>
            <div class="item">
              <div class="left">当前浏览器是否支持视频面试系统：请检测</div>
            </div>
            <div class="item tips">
              <div class="left">温馨提示：</div>
            </div>
            <div class="tips-cont">
              <p class="tips-line">
                windows系统请使用windows7及以上，浏览器请使用谷歌浏览器
                58版本及以上或火狐浏览器56版本及以上
              </p>
              <p class="tips-line">
                macOS系统请使用macOS10及以上，浏览器请使用safari浏览器
                11版本及以上
              </p>
            </div>
            <div class="title_jiance">
              <!-- <img src="@/views/pc/img/cloudDouble/jiance3.png" /> -->
              <div class="title_neirong shipjieguo">视频显示结果</div>
            </div>
            <!-- <div class="title">视频显示结果</div> -->
            <div class="img" id="video">
              <p class="video-tip">视频测试区</p>
            </div>
            <el-button
              class="start-btn"
              @click="toWait()"
              :disabled="step2Disabled"
              >开始面试</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk-ng";
export default {
  props: {},
  data() {
    return {
      scene_id: this.$route.params.scene_id,
      exam_id: "",
      room_name: "",
      stu_id: "",
      steps: 0,
      icon1: "success",
      step1time: 1 + " S",
      tonext: false,
      isok: false,
      open: 0,
      audioDevice: "",
      videoDevice: "",
      audioDevices: [],
      videoDevices: [],
      step2Disabled: false,
      audioNum: 0,
      is_double: "",
      imgVideo: true,
      imgAni: "",
      imgSrc: "../../../../../static/pc/chat/img2.png",
      imgBase64: "",
      canvasWidth: "",
      token: localStorage.getItem("token"),
    };
  },
  computed: {},
  created() {},
  mounted() {
    // this.downlinkClient=this.$AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    this.agoraGetDevice();
  },
  methods: {
    toWait() {
      if (this.audioDevice == "" || this.audioDevice == null) {
        this.$message("暂无可用的音频设备");
        return;
      }
      if (this.videoDevice == "" || this.videoDevice == null) {
        this.$message("暂无可用的视频设备");
        return;
      }
      localStorage.setItem("selectedMicrophoneId", this.audioDevice);
      localStorage.setItem("selectedCameraId", this.videoDevice);
      this.$router.push({
        name: "video-wait",
        query: {
          gd: this.$route.query.gd,
          ud: this.$route.query.ud,
          name: this.$route.query.name,
        },
      });
    },

    // 获取所有设备
    async agoraGetDevice() {
      var that = this;
      // 获取所有音视频设备
      AgoraRTC.getDevices(true).then((devices) => {
        that.audioDevices = devices.filter(function (device) {
          return device.kind === "audioinput";
        });
        that.videoDevices = devices.filter(function (device) {
          return device.kind === "videoinput";
        });
        // 默认选中第一项

        that.audioDevice = that.audioDevices[0].deviceId;
        that.videoDevice = that.videoDevices[0].deviceId;

        if (that.audioDevice == "" || that.audioDevice == null) {
          that.$message("暂无可用的音频设备");
        }
        if (that.videoDevice == "" || that.videoDevice == null) {
          that.$message("暂无可用的视频设备");
        }
      });
    },

    // 存储选中值
    changeAudio(item) {
      this.audioDevice = item.deviceId;
    },
    changeVideo(item) {
      this.videoDevice = item.deviceId;
    },

    // 开始检测设备
    async agoraDeviceCheck() {
      var that = this;
      if (that.audioDevice == "" || that.audioDevice == null) {
        that.$message("暂无可用的音频设备");
        return;
      }
      if (that.videoDevice == "" || that.videoDevice == null) {
        that.$message("暂无可用的视频设备");
        return;
      }

      if (that.step2Disabled) {
        that.$message("您正在测试中");
        return false;
      }
      // 禁用所有功能
      that.step2Disabled = true;

      AgoraRTC.getDevices()
        .then((devices) => {
          return Promise.all([
            AgoraRTC.createCameraVideoTrack({
              cameraId: that.videoDevice,
            }),
            AgoraRTC.createMicrophoneAudioTrack({
              microphoneId: that.audioDevice,
            }),
          ]);
        })
        .then((track) => {
          console.log(track);
          track[0].play("video");
          var interval = setInterval(() => {
            const level = track[1].getVolumeLevel();
            console.log("local stream audio level", level);
            that.audioNum = level * 100;
          }, 1000);

          setTimeout(async function () {
            // 启用所有功能
            that.step2Disabled = false;

            // 销毁本地音视频轨道。
            clearInterval(interval);
            track[0].close();
            track[1].close();
          }, 5 * 1000);
        });
    },
  },
};
</script>
<style>
.baycheck {
  background: #f7f6f7;
}
.maincheck {
  width: 1200px;
  margin: 0 auto;
  background: #ffffff;
}
.view-process {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.view-process .jindu {
  height: 450px;
  padding-left: 114px;
  position: relative;
  flex-shrink: 0;
}
.view-process .el-step__line {
  background-color: #999;
}
.view-process .el-step__head.is-finish .el-step__line {
  background-color: #2c93fd;
}
.iconstep {
  background: url(../../../../../static/pc/chat/icon_ok1.png);
}
.view-process .el-step__head.is-success {
  color: #2c93fd;
  border-color: #2c93fd;
}
.view-process .el-step.is-vertical .el-step__head {
  width: 46px;
}
.view-process .el-step.is-vertical .el-step__line {
  left: 22px;
  width: 3px;
}
.view-process .el-step.is-vertical .el-step__icon.is-icon {
  width: 46px;
}
.view-process
  .step1
  .el-step__head.is-finish
  .el-step__icon
  .el-step__icon-inner.success {
  background: url(../../../../../static/pc/chat/icon_ok1.png) no-repeat center
    center/100% 100%;
  width: 47px;
  height: 51px;
}
.view-process
  .step2
  .el-step__head.is-finish
  .el-step__icon
  .el-step__icon-inner.success {
  background: url(../../../../../static/pc/chat/icon_ok1.png) no-repeat center
    center/100% 100%;
  width: 47px;
  height: 51px;
}
.view-process
  .step3
  .el-step__head.is-finish
  .el-step__icon
  .el-step__icon-inner.success {
  background: url(../../../../../static/pc/chat/icon_ok3.png) no-repeat center
    center/100% 100%;
  width: 47px;
  height: 51px;
}
.view-process
  .step1
  .el-step__head.is-process
  .el-step__icon
  .el-step__icon-inner.success {
  background: url(../../../../../static/pc/chat/icon_on1.png) no-repeat center
    center/100% 100%;
  width: 47px;
  height: 51px;
}
.view-process
  .step2
  .el-step__head.is-process
  .el-step__icon
  .el-step__icon-inner.success {
  background: url(../../../../../static/pc/chat/icon_on2.png) no-repeat center
    center/100% 100%;
  width: 47px;
  height: 51px;
}
.view-process
  .step3
  .el-step__head.is-process
  .el-step__icon
  .el-step__icon-inner.success {
  background: url(../../../../../static/pc/chat/icon_on3.png) no-repeat center
    center/100% 100%;
  width: 47px;
  height: 51px;
}
.view-process
  .step2
  .el-step__head.is-wait
  .el-step__icon
  .el-step__icon-inner.success {
  background: url(../../../../../static/pc/chat/icon_off2.png) no-repeat center
    center/100% 100%;
  width: 47px;
  height: 51px;
}
.view-process
  .step3
  .el-step__head.is-wait
  .el-step__icon
  .el-step__icon-inner.success {
  background: url(../../../../../static/pc/chat/icon_off3.png) no-repeat center
    center/100% 100%;
  width: 47px;
  height: 51px;
}

.view-process .cont {
  height: 100%;
  position: relative;
  flex-shrink: 0;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.view-process .step1-cont {
  width: 957px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 90%;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 51px 65px 0;
}
.view-process .step1-cont .title {
  font-size: 27px;
  color: #333;
  font-weight: blod;
}
.view-process .step1-cont .middle {
  font-size: 18px;
  margin-top: 34px;
  text-align: left;
  max-height: 65%;
  overflow: auto;
  word-break: break-all;
}
.view-process .step1-cont .middle .fujian-tit {
  display: block;
  margin-top: 20px;
  font-size: 14px;
}
.view-process .step1-cont .middle .fujian {
  display: block;
  font-size: 14px;
  color: #2898fd;
}
.view-process .step1-cont .bottom {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 149px;
  height: 49px;
  line-height: 49px;
  text-align: center;
  border: 1px solid #2898fd;
  border-radius: 6px;
  font-size: 18px;
  color: #2c93fd;
  cursor: pointer;
}
.view-process .step2-cont {
  text-align: left;
  padding-left: 370px;
  padding-top: 25px;
  padding-bottom: 50px;
  height: 100%;
  overflow: auto;
}
/* 修改样式 */
.view-process .step2-cont .title_jiance {
  margin-top: 20px;
  display: flex;
  font-size: 20px;
  font-weight: 500;
  color: #ffffff;
  line-height: 32px;
  align-items: center;
  margin-left: -70px;
}

.view-process .step2-cont .title_jiance img {
  z-index: 1000;
  width: 52px;
  height: 52px;
}
.view-process .step2-cont .title_jiance .title_neirong {
  margin-left: -25px;
  text-align: center;
  width: 250px;
  height: 40px;
  background: linear-gradient(90deg, #ff4643 0%, #fe6530 100%);
  border-radius: 0px 50px 50px 0px;
  border: 1px solid #ff4643;
}
/* 检测结果 */
.view-process .step2-cont .title_jiance .jiancejieguo {
  width: 158px;
  height: 40px;
}
/* 视频显示结果 */
.view-process .step2-cont .title_jiance .shipjieguo {
  width: 200px;
  height: 40px;
}

.view-process .step2-cont .title {
  font-size: 23px;
  font-weight: 700;
  padding-top: 30px;
}
.view-process .step2-cont .item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
}
.view-process .step2-cont .item .left {
  font-size: 18px;
  font-weight: 500;
}
.view-process .step2-cont .item .middle.select .el-input__inner {
  width: 215px;
  height: 35px;
  border-color: #999;
}
.view-process .step2-cont .item .middle.select .el-input__icon {
  line-height: 35px;
  color: #999;
  font-size: 20px;
}
.view-process
  .step2-cont
  .item
  .middle.select
  .el-input__icon.el-icon-arrow-up:before {
  content: "\e78f";
}
.view-process .step2-cont .item .right {
  padding: 0 22px;
  height: 34px;
  line-height: 34px;
  background-color: #00ae31;
  font-family: Source Han Sans CN;
  color: #fff;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 2px;
  margin-left: 37px;
}

.view-process .step2-cont .item .right_start {
  padding: 0 22px;
  height: 34px;
  line-height: 34px;
  background: linear-gradient(90deg, #ff4643 0%, #fe6530 100%);
  border: 1px solid #ff4643;
  border-radius: 5px;
  color: #fff;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 2px;
  margin-left: 37px;
}

.view-process .step2-cont .item.audio {
  align-items: flex-end;
}
.view-process .step2-cont .item.audio .right {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  background-color: #fff;
  padding: 0;
  margin-left: 20px;
}
.view-process .step2-cont .item.audio .right > div {
  border: 1px solid #999;
  width: 6px;
  margin-right: 8px;
}
.view-process .step2-cont .item.audio .right > div.color1 {
  background-color: #2c93fd;
  border-color: #2c93fd;
}
.view-process .step2-cont .item.audio .right > div.color2 {
  background-color: red;
  border-color: red;
}
.view-process .step2-cont .item.audio .right .audio1 {
  height: 8px;
}
.view-process .step2-cont .item.audio .right .audio2 {
  height: 11px;
}
.view-process .step2-cont .item.audio .right .audio3 {
  height: 14px;
}
.view-process .step2-cont .item.audio .right .audio4 {
  height: 17px;
}
.view-process .step2-cont .item.audio .right .audio5 {
  height: 20px;
}
.view-process .step2-cont .item.audio .right .audio6 {
  height: 23px;
}
.view-process .step2-cont .item.audio .right .audio7 {
  height: 26px;
}
.view-process .step2-cont .item.audio .right .audio8 {
  height: 29px;
}
.view-process .step2-cont .item.audio .right .audio9 {
  height: 32px;
}
.view-process .step2-cont .item.audio .right .audio10 {
  height: 35px;
}
.view-process .step2-cont .item.tips .left {
  color: #e71818;
  font-weight: 700;
}
.view-process .step2-cont .tips-cont .tips-line {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 1px;
  width: 488px;
  margin-top: 5px;
  line-height: 1.7;
}
.view-process .step2-cont .img {
  width: 277px;
  height: 199px;
  margin-top: 11px;
  display: block;
  border-radius: 2px;
}
.view-process .step2-cont .start-btn {
  width: 142px;
  height: 41px;
  text-align: center;
  line-height: 41px;
  background: linear-gradient(90deg, #ff4643 0%, #fe6530 100%);
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  margin: 26px auto 0;
  padding: 0;
  display: block;
}
.view-process .step3-cont {
  width: 615px;
  height: 510px;
  margin-left: 273px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #999;
  border-radius: 4px;
  margin-top: -20px;
  padding: 47px 0 43px 0;
}
.view-process .step3-cont .videobg {
  width: 274px;
  height: 274px;
  border-radius: 50%;
  padding: 3px 0 0 3px;
  position: relative;
}
@keyframes myvideo {
  form {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.view-process .step3-cont .videobg > img {
  width: 274px;
  height: 274px;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.view-process .step3-cont .videobg > img.img-ani {
  animation: myvideo 5s infinite;
  animation-timing-function: linear;
}
.view-process .step3-cont .imgbg {
  width: 268px;
  height: 268px;
  border-radius: 50%;
  padding: 3px 0 0 3px;
  position: relative;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translate3d(0, 0, 0);
}
.view-process .step3-cont .img {
  height: 268px;
  display: block;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}
.view-process .step3-cont .img.video {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 2;
  transform: translateX(-50%);
  width: auto;
}
.view-process .step3-cont .title {
  font-size: 27px;
  font-weight: 700;
  letter-spacing: 3px;
}
.view-process .step3-cont .face-btn {
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 1px;
  width: 142px;
  height: 41px;
  line-height: 41px;
  text-align: center;
  background: linear-gradient(#66abfc, #2797fd);
  border-radius: 4px;
  cursor: pointer;
}
.view-process .step3-cont .openbg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  display: none;
}
.view-process .step3-cont .openbg.active {
  display: block;
  z-index: 10;
}
.view-process .step3-cont .openbg .open {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.view-process .step3-cont .openbg .open1 {
  width: 564px;
  height: 233px;
  padding: 53px 71px;
}
.view-process .step3-cont .openbg .open-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.view-process .step3-cont .openbg .open-btn div {
  width: 142px;
  height: 41px;
  text-align: center;
  line-height: 41px;
  border-radius: 4px;
  border: 1px solid #666;
  color: #666;
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 500;
  cursor: pointer;
}
.view-process .step3-cont .openbg .open2 {
  width: 444px;
  height: 233px;
  padding: 53px 0;
}
.view-process .step3-cont .openbg .open2 .open-btn {
  justify-content: center;
}
.view-process .step3-cont .openbg .open2 .open-btn div {
  border: 0;
  background-color: #08c644;
  color: #fff;
}
.view-process .step2-cont .img {
  width: 450px;
  height: 250px;
  margin-top: 11px;
  display: block;
  border-radius: 2px;
  position: relative;
  border: 1px solid #999;
  background-color: #000;
}
.view-process .step2-cont .img .video-tip {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  transform: translateY(-50%);
  margin: 0;
  font-size: 20px;
  letter-spacing: 2px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
