<template>
  <view>
    <view class="head head-height">
      <block v-if="!hasUserInfo">
        <view class="userinfo">
          <image
            class="userinfo-avatar"
            src="../../images/avatar.png"
            mode="cover"
          ></image>
          <text class="userinfo-nickname">登录</text>
        </view>
      </block>
      <block v-else>
        <view class="userinfo">
          <image
            bindtap="bindViewTap"
            class="userinfo-avatar"
            :src="userInfo.avatar ? userInfo.avatar : '../../images/avatar.png'"
            mode="cover"
          ></image>
          <text class="userinfo-nickname">{{ userInfo?.username ? userInfo?.username : '微信用户' }}</text>
        </view>
      </block>
    </view>
    <view>
      <nut-cell-group>
        <nut-cell
          title="完善信息"
          is-link
          @click="goUserinfo($event)"
        ></nut-cell>
        <nut-cell title="退出登录" is-link @click="loginOut($event)"></nut-cell>
      </nut-cell-group>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Taro from "@tarojs/taro";
import { useStore } from "../../stores";
import "./index.scss";
import { supabase } from "../../lib/supabaseClient";
import { DownloadImage } from "../../utils/commonApi";
const hasUserInfo = ref(false);
const userInfo = ref({});
const auth = useStore("auth");
onMounted(async () => {
  if (auth.userInfo) {
    hasUserInfo.value = true;
    if (JSON.stringify(auth.userInfo.user_metadata) !== "{}") {
      if (auth.userInfo.user_metadata.avatar) {
        var avatar = await DownloadImage(auth.userInfo.user_metadata.avatar);
      }
      userInfo.value = auth.userInfo.user_metadata;
      console.log(auth.userInfo.user_metadata)
      userInfo.value.avatar = avatar;
    }
  } else {
    Taro.redirectTo({
      url: "/pages/login/index",
    });
  }
});
const loginOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    Taro.showToast({
      title: error.message || error.error_description,
      duration: 1500,
      icon: "none",
    });
  } else {
    auth.setUserInfo(null);
    userInfo.value = null;
    hasUserInfo.value = false;
    Taro.showToast({
      title: "退出成功",
      duration: 1500,
    });
    Taro.redirectTo({
      url: "/pages/login/index",
    });
  }
};
const setUserInfo = async (userInfo) => {
  // console.log(userInfo,'userInfo')
  if (userInfo != null) {
    if (userInfo.avatar) {
      var avatar = await DownloadImage(userInfo.avatar);
      console.log(userInfo.avatar, avatar, "userInfo");
    }
    userInfo.value = { a: "1" };
    userInfo.value.avatar = avatar;
    console.log(userInfo.value, "userInfo.value");
  }
};
const goUserinfo = async () => {
  Taro.redirectTo({
    url: "/pages/userinfo/index",
  });
};
</script>
