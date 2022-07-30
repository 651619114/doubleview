<template>
  <div style="width: 1200px; margin: 10px auto">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="videolist">
          <router-link to="/PcChat">
            <img :src="videobanner" class="videochat" />
            <div class="top_bg">
              <img :src="play_icon" class="tops-img" />
              <div class="wait"><img src="@/assets/common/img/pc/wait.png" class="wait-img">请耐心等待面试官邀请</div>
            </div>
          </router-link>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chatist">
          <div class="chathu">互动聊天</div>
          <ul class="chatpeoples">
            <li v-for="(chat, key) in chatlist" :key="key">
              <div class="chatone">
                <img :src="chat.chatUrl" />
                <div class="chatonename">{{ chat.name }}</div>
                <span style="margin-left: 10px">{{ chat.time }}</span>
              </div>
              <div class="chattwo">
                {{ chat.idea }}
              </div>
              <div class="chatthree">
                <img :src="jubao" />
                <span style="margin-left: 5px">举报</span>
              </div>
            </li>
          </ul>
          <div class="send-icon">
            <img src="@/assets/img/pc/smile.png" class="smile">
            <img src="@/assets/img/pc/pic.png" class="smile">
            <span class="send">发送</span>
          </div>
          <div class="hd">
            <el-input v-model="textarea" maxlength="300" resize="none" placeholder="发个互动" show-word-limit :autosize="{ minRows: 9, maxRows: 9 }" type="textarea" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import '@/assets/common/css/pc/chats.css'
export default {
  name: 'PcChats',
  data() {
    return {
      videobanner: require('@/assets/common/img/pc/bg.png'),
      play_icon: require('@/assets/common/img/pc/avater.png'),
      jubao: require('@/assets/common/img/pc/jubao.png'),
      chatlist: [
        {
          chatUrl: require('@/assets/common/img/pc/chaturl.png'),
          name: '王*某',
          time: '2022-6-16  16:00',
          idea: '我想去，有什么要求吗？'
        },
        {
          chatUrl: require('@/assets/common/img/pc/chaturl.png'),
          name: '王*某',
          time: '2022-6-16  16:00',
          idea: '我想去，有什么要求吗？'
        }
      ],
      input2: '',
      textarea: ''
    }
  },
  setup() {}
}
</script>
