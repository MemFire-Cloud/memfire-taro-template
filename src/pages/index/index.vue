<template>
  <view>
    <view class="container2" @click="tabLink('todolist')">
      <text class="top-banner">模板集</text>
      <view class="wall-box mt40">
        <view class="banner-box"> ToDoList </view>
      </view>
      <view class="wall-box mt40" @click="tabLink('messages')">
        <view class="banner-box"> 聊天室 </view>
      </view>
      <view class="wall-box mt40" @click="tabLink('filestorage')">
        <view class="banner-box"> 网盘 </view>
      </view>
      <view class="wall-box mt40" @click="tabLink('login')">
        <view class="banner-box"> 登录认证 </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro from "@tarojs/taro";
import { ref, onMounted } from "vue";
import { useStore } from "../../stores";
import { supabase } from "../../lib/supabaseClient";
import "./index.scss";
onMounted(async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (!session || error) {
    Taro.redirectTo({
      url: "/pages/login/index",
    });
  }
});
const tabLink = (tab) => {
  if (tab === "todolist") {
    Taro.navigateTo({
      url: "/pages/todolist/index",
    });
  } else if (tab === "messages") {
    Taro.navigateTo({
      url: "/pages/messages/index",
    });
  } else if (tab === "filestorage") {
    Taro.navigateTo({
      url: "/pages/filestorage/index",
    });
  } else {
    Taro.navigateTo({
      url: "/pages/login/index",
    });
  }
};
</script>
