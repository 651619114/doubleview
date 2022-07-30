<template>
  <div
    id="video"
    :style="{ height: '100%', width: '100%', position: 'absolute' }"
  >
    <div
      class="video-view review-right-video"
      :style="{ height: '100%', width: '100%' }"
    >
      <div id="local_stream" :style="{ height: '50%', width: '50%' }"></div>
      <div id="local_video_info" class="video-profile hide"></div>
      <div id="video_autoplay_local" class="autoplay-fallback hide"></div>
    </div>
    <div
      v-for="item in videoIdList"
      :key="item"
      :id="`remote_video_panel_` + item"
      :class="['video-view review-center-video', imageUrl ? 'active' : '']"
    >
      <div
        :style="{ height: '100%', width: '100%' }"
        :id="`remote_video_` + item"
      ></div>
      <div :id="`remote_video_info_` + item" class="video-profile hide"></div>
      <div :id="`video_autoplay_` + item" class="autoplay-fallback hide"></div>
    </div>
  </div>
</template>
 <script>
import AgoraRTC from "agora-rtc-sdk-ng";
import ElementPlus from "element-plus";

const callQuality = {
  // 通话质量
  0: "质量未知",
  1: "质量极好",
  2: "用户主观感觉和极好差不多，但码率可能略低于极好",
  3: "用户主观感受有瑕疵但不影响沟通",
  4: "勉强能沟通但不顺畅",
  5: "网络质量非常差，基本不能沟通",
  6: "网络连接断开，完全无法沟通",
};

const rtc = {
  client: null,
  joined: false, //是否已经加入频道
  published: false, // 是否已经发布
  localStream: null,
  remoteStreams: [],
  params: {},
};

const option = {
  appID: "8c1cdd1b9cb644a78fb5e3cd5b308d1d",
  channel: "123", // 频道
  uid: "", // 用户id
  token:
    "0068c1cdd1b9cb644a78fb5e3cd5b308d1dIADoF6j0z1lImmJ/A3tAQfMFOFiaFMor/K16ei+Oew3VxtJjSIgAAAAAEACZ/16CR33LYgEAAQBGfcti", // 手机app上用的  没用
};

const leave = function () {
  // 离开频道
  if (!rtc.client) {
    ElementPlus.info("您还没加入频道");
    return;
  }
  if (!rtc.joined) {
    ElementPlus.info("您还没加入频道(2)");
    return;
  }
  rtc.client.leave(
    function () {
      rtc.localStream.stop();
      rtc.localStream.close();
      while (rtc.remoteStreams.length > 0) {
        var stream = rtc.remoteStreams.shift();
        var id = stream.getId();
        stream.stop();
        removeView(id);
      }
      rtc.localStream = null;
      rtc.remoteStreams = [];
      rtc.client = null;
      rtc.published = false;
      rtc.joined = false;
      ElementPlus.info("离开频道成功");
    },
    function (err) {
      ElementPlus.error("离开频道失败");
      console.error(err);
    }
  );
};

function unpublish(rtc) {
  // 取消发布本地流
  if (!rtc.client) {
    ElementPlus.info("您还没加入频道");
    return;
  }
  if (!rtc.published) {
    Toast.error("您已经发布频道");
    return;
  }
  var oldState = rtc.published;
  rtc.client.unpublish(rtc.localStream, function (err) {
    rtc.published = oldState;
    console.error(err);
  });
  ElementPlus.info("取消发布成功");
  rtc.published = false;
}

const createStream = function () {
  //创建本地流
  // 创建本地流
  rtc.localStream = AgoraRTC.createStream({
    streamID: rtc.params.uid,
    audio: true,
    video: true,
    screen: false,
  });
  // 初始化本地流
  rtc.localStream.setVideoProfile("360p_1"); //  640X360  15  400
  rtc.localStream.init(
    function () {
      console.log("本地流-初始化-成功", rtc.localStream);
      // 发布本地流
      rtc.localStream.play("local_stream"); // 插入到这个id中
      publish(); // 发布本地流
    },
    function (err) {
      console.error("本地流-初始化-失败", err);
    }
  );
};

const publish = function () {
  // 发布本地流
  if (!rtc.client) {
    ElementPlus.info("您还没加入频道");
    return;
  }
  if (rtc.published) {
    ElementPlus.info("您已经发布频道");
    return;
  }
  const oldState = rtc.published;

  // publish localStream
  rtc.client.publish(rtc.localStream, function (err) {
    rtc.published = oldState;
    console.log("publish failed");
    Toast.error("publish failed");
    console.error(err);
  });
  ElementPlus.success("发布频道成功");
  rtc.published = true;
};

const Listening = function (thet) {
  // 订阅事件
  // ---- 订阅开始
  rtc.client.on("error", (err) => {
    console.log("===>", err);
  });
  rtc.client.on("peer-leave", function (evt) {
    // 有用户离开时
    var uid = evt.uid;
    var reason = evt.reason; // 离线原因 Quit -- 主动离开  ServerTimeOut -- 超时掉线（也有可能是主动离开）
    if (uid != rtc.params.uid) {
      thet.deleteView(uid);
    }
    ElementPlus.info("用户离开");
    console.log("用户离线", uid, "reason: ", reason);
  });
  rtc.client.on("stream-published", function (evt) {
    // 发布视频流本地触发
    var remoteStream = evt.stream;
    var id = remoteStream.getId();
    thet.myId = id;
  });
  rtc.client.on("stream-added", function (evt) {
    //有远程流加入时
    var remoteStream = evt.stream;
    var id = remoteStream.getId();
    if (id !== rtc.params.uid) {
      rtc.client.subscribe(remoteStream, function (err) {
        // 订阅加入的远程端视频
        console.log("订阅远程端视频失败", err);
      });
    }
    console.log("加入的远程端视频流: ", id);
  });
  rtc.client.on("stream-subscribed", function (evt) {
    //订阅远程流
    var remoteStream = evt.stream;
    var id = remoteStream.getId();
    rtc.remoteStreams.push(remoteStream); // 不知道干啥的
    ElementPlus.success("用户加入" + id);
    thet.addView(id);
    setTimeout(() => {
      // vue创建元素 是异步的   （一会处理）
      remoteStream.play("remote_video_" + id); // 插入到 id为 remote_video_ + id 元素中
    }, 300);
    console.log("接收到的远程端视频: ", id);
  });
  rtc.client.on("stream-removed", function (evt) {
    // 对方取消发布
    var remoteStream = evt.stream;
    var id = remoteStream.getId();
    remoteStream.stop("remote_video_" + id);
    rtc.remoteStreams = rtc.remoteStreams.filter(function (stream) {
      return stream.getId() !== id;
    });
    thet.deleteView(id);
    console.log("stream-removed remote-uid: ", id);
  });
  rtc.client.on("onTokenPrivilegeWillExpire", function () {
    // token过期前30秒调用
    // client.renewToken(token);
    console.log("token即将过期");
  });
  rtc.client.on("onTokenPrivilegeDidExpire", function () {
    // token已经失效
    // client.renewToken(token);
    console.log("token已经失效");
  });
  rtc.client.on("network-quality", function (stats) {
    // 本地用户的网络质量
    console.log("下行", callQuality[stats.downlinkNetworkQuality]);
    console.log("上行", callQuality[stats.uplinkNetworkQuality]);
  });
  rtc.client.on("mute-audio", function (evt) {
    // 对方关闭了语音
    var uid = evt.uid;
    ElementPlus.info("用户" + uid + "已静音");
    console.log("mute audio:" + uid);
    //alert("mute audio:" + uid);
  });
  rtc.client.on("unmute-audio", function (evt) {
    // 对方打开了语音
    var uid = evt.uid;
    ElementPlus.info("用户" + uid + "打来了语音");
    console.log("unmute audio:" + uid);
  });
  rtc.client.on("mute-video", function (evt) {
    // 对方关闭摄像头
    var uid = evt.uid;
    ElementPlus.info("用户" + uid + "关闭了摄像头");
    console.log("mute video" + uid);
    //alert("mute video:" + uid);
  });
  rtc.client.on("unmute-video", function (evt) {
    // 对方打开了摄像头
    var uid = evt.uid;
    ElementPlus.info("用户" + uid + "打开了了摄像头");
    console.log("unmute video:" + uid);
  });
  // ---- 订阅结束
};

// 开始声网
const agoraFunction = function (thet) {
    getDevices()
  // 创建客户端
  if (rtc.joined) {
    ElementPlus.info("您已经加入频道");
    return;
  }
  rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
  rtc.params = { mode: "live", codec: "vp8" }; // 赋值输入框的值
  Listening(thet); // 开始监听
  // 初始化
  rtc.client.init(
    option.appID,
    function () {
      console.log("初始化成功");
      //加入频道
      rtc.client.join(
        option.token ? option.token : null,
        option.channel,
        option.uid ? +option.uid : null,
        function (uid) {
          console.log("成功----频道号码: " + option.channel + "你的id: " + uid);
          rtc.joined = true;
          rtc.params.uid = uid;
          createStream(); // 创建本地流
        },
        function (err) {
          console.error("加入频道失败", err);
        }
      );
    },
    (err) => {
      console.error(err);
    }
  );
};

const getDevices = function (next) {
  // 获取音视频设备信息
  AgoraRTC.getDevices(function (items) {
    items
      .filter(function (item) {
        return ["audioinput", "videoinput"].indexOf(item.kind) !== -1;
      })
      .map(function (item) {
        return {
          name: item.label,
          value: item.deviceId,
          kind: item.kind,
        };
      });
    var videos = [];
    var audios = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if ("videoinput" == item.kind) {
        var name = item.label;
        var value = item.deviceId;
        if (!name) {
          name = "camera-" + videos.length;
        }
        videos.push({
          name: name,
          value: value,
          kind: item.kind,
        });
      }
      if ("audioinput" == item.kind) {
        var name = item.label;
        var value = item.deviceId;
        if (!name) {
          name = "microphone-" + audios.length;
        }
        audios.push({
          name: name,
          value: value,
          kind: item.kind,
        });
      }
    }
    console.log({ videos: videos, audios: audios });
    //   next({videos: videos, audios: audios});
  });
};
export default {
  rtc, // 参数
  option, // 参数
  agoraFunction, // 声网开始的方法
  publish, // 发布本地流
  unpublish, // 停止发布本地流
  leave, // 离开频道
  getDevices, // 获取可用的 摄像头 麦克风
  setup() {
    created: agoraFunction();
  },
};
</script>
 
