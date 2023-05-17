<template>
  <view class="container">
    <view class="user-info">
      <button
        class="avatar-wrapper"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
      >
        <text v-if="!avatar">点我获取头像</text>
        <image v-else class="avatar" :src="avatar"></image>
      </button>
      <input class="username" placeholder="请输入用户名" v-model="username" />
    </view>
    <view class="user-intro">
      <textarea
        class="intro-text"
        placeholder="请输入个人简介"
        v-model="introduction"
      />
    </view>
    <button class="submit" @click="submit">提交</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "./index.scss";
import { supabase } from "../../lib/supabaseClient";
import { DownloadImage } from "../../utils/commonApi";
import Taro from "@tarojs/taro";
import { useStore } from "../../stores";
const username = ref("");
const introduction = ref("");
const filePath = ref("");
const avatar = ref("");
const auth = useStore("auth");
onMounted(async () => {
  if (auth.userInfo) {
    if (JSON.stringify(auth.userInfo.user_metadata) !== "{}") {
      if (auth.userInfo.user_metadata.avatar) {
        avatar.value = auth.userInfo.user_metadata.avatar;
      }
    }
    username.value = auth.userInfo?.user_metadata.username
      ? auth.userInfo.user_metadata.username
      : "";
    introduction.value = auth.userInfo?.user_metadata.introduction
      ? auth.userInfo.user_metadata.introduction
      : "";
  }
});

const submit = async () => {
  let path = "";
  if (filePath.value) {
    path = filePath.value;
  } else {
    path = auth.userInfo.user_metadata.avatar;
  }
  const { data, error } = await supabase.auth.updateUser({
    data: {
      avatar: path,
      username: username.value,
      introduction: introduction.value,
    },
  });
  if (error) {
    Taro.showToast({
      title: error.message || error.error_description,
      duration: 1500,
      icon: "none",
    });
  } else {
    auth.userInfo = data.user.data;
    Taro.showToast({
      title: "修改成功",
      duration: 1500,
      icon: "none",
    });
    Taro.switchTab({
      url: "/pages/me/index",
    });
  }
};
const onChooseAvatar = async (e) => {
  let { avatarUrl } = e.detail;
  Taro.getImageInfo({
    src: avatarUrl, // 图片路径，必须是本地路径，可以相对路径或绝对路径
    success: async function (res) {
      const file = {
        fileType: "image",
        width: res.width,
        height: res.height,
        tempFilePath: avatarUrl,
      };
      const fileExt = avatarUrl.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePathname = `${fileName}`;
      filePath.value = filePathname;
      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePathname, file);
      if (uploadError) {
        throw uploadError;
      }
      avatar.value = await DownloadImage(filePathname);
    },
  });
};
</script>
