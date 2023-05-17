<template>
  <view class="container-chat">
    <view class="main-chat">
      <view class="msg-items" style="display: flex; flex-direction: column">
        <!-- 每条信息 -->
        <view
          :class="item.user_id == userInfo.id ? 'r-re msg-box' : 'msg-box'"
          v-for="(item, index) in messages"
          :key="index"
        >
          <image
            :class="item.user_id == userInfo.id ? 'sj' : 'osj'"
            :src="item.imgUrl"
          />
          <view
            :class="item.user_id == userInfo.id ? 'me chat-item' : 'chat-item'"
          >
            <view class="clearfix">
              <view class="user-name">
                {{ item.user_name }}
              </view>
              <view class="msg-bubble-box">
                <view class="msg-bubble-area clearfix">
                  <view
                    :class="
                      item.user_id == userInfo.id
                        ? 'msg-bubble'
                        : 'other-bubble msg-bubble'
                    "
                  >
                    <view class="text">{{ item.message }}</view>
                  </view>
                </view>
                <view class="time">{{ item.created_at }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="send-msg-box-wrapper">
        <view class="send-msg-box">
          <view class="input-area">
            <input
              type="text"
              class="msg-content"
              @confirm="send"
              v-model="inputTxt"
            />
          </view>
          <view class="btn-area">
            <image
              src="../../images/send.png"
              @click="send"
              class="plus-icon"
              alt=""
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Taro from "@tarojs/taro";
import { supabase } from "../../lib/supabaseClient";
import { DownloadImage } from "../../utils/commonApi";
import "./index.scss";
import { useStore } from "../../stores";

const userInfo = ref({});
const totalPeoples = ref([]);
const messages = ref(null);
const inputTxt = ref(null);

onMounted(() => {
    const auth = useStore('auth')
  supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        getInitialMessages()
          .then((res) => {
            messages.value = res;
          })
          .catch((err) => {
            Taro.showToast({
              title: err,
              duration: 1500,
              icon: "none",
            });
          });
      }
    )
    .subscribe();
  //查询个人信息
  if (auth.userInfo.id) {
    userInfo.value = auth.userInfo;
  } else {
    Taro.showToast({
      title: "请先登录",
      duration: 1500,
      icon: "none",
    });
  }
  //获取聊天数据
  getInitialMessages()
    .then((res) => {
      messages.value = res;
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        duration: 1500,
        icon: "none",
      });
    });
});

const send = async () => {
  const { error } = await supabase.from("messages").insert([
    {
      user_id: userInfo.value.id,
      message: inputTxt.value,
      avatar: userInfo.value.user_metadata.avatar
        ? userInfo.value.user_metadata.avatar
        : "",
      user_name: userInfo.value.user_metadata.username
        ? userInfo.value.user_metadata.username
        : "微信用户",
    },
  ]);
  inputTxt.value = "";
};

const getInitialMessages = async () => {
  const {
    data: { data },
    error,
  } = await supabase.from("messages").select();
  if (error) {
    throw error.message || error.error_description;
  } else {
    if (data.length > 0) {
      const responses = [];
      for (const item of data) {
        item.imgUrl = await DownloadImage(item.avatar);
        responses.push(item);
      }
    }
    return data;
  }
};
</script>
