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
            @click="bindViewTap"
            class="userinfo-avatar"
            :src="userInfo.avatar ? userInfo.avatar : '../../images/avatar.png'"
            mode="cover"
          ></image>
          <text class="userinfo-nickname">{{ userInfo?.username ? userInfo?.username : '微信用户' }}</text>
        </view>
      </block>
    </view>
    <image class="active-img" src="../../images/group_assist.jpeg"  />
  <view class="list-wrapper"  v-if="hasUserInfo">
    <view class="row m32 mt64"  @click="goUserInfo">
      <view class="left-t t34">基本信息</view>
      <view class="right-t">
        <image src="../../images/arrow.svg" />
      </view>
    </view>

    <view class="row m32 mt64"  @click="loginOut">
      <view class="left-t t34">退出登录</view>
      <view class="right-t">
        <image src="../../images/arrow.svg" />
      </view>
    </view>
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
const goUserInfo = async () => {
  Taro.navigateTo({
    url: "/pages/userinfo/index",
  });
};
</script>
