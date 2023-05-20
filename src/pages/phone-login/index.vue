<template>
  <view class="container">
    <form class="from-content">
      <view class="inputView">
        <input
          class="inputText"
          placeholder="请输入手机号"
          name="phone"
          v-model="phone"
        />
      </view>
      <view class="inputView">
        <input
          class="inputText"
          v-model="code"
          placeholder="请输入验证码"
          name="code"
        />
        <button
          :class="disabled ? 'disabled line' : 'line'"
          :type="disabled ? 'defalut' : 'primary'"
          :disabled="disabled"
          size="mini"
          @click="sendcode"
        >
          {{ codebtn }}
        </button>
      </view>
      <view class="loginBtnView">
        <button class="loginBtn" type="primary" @click="submit">登录</button>
      </view>
    </form>
  </view>
</template>

<script setup>
import { ref } from "vue";
import Taro from "@tarojs/taro";
import { supabase } from '../../lib/supabaseClient'
import "./index.scss";
import { useStore } from "../../stores";

const phone = ref("");
const code = ref("");
const codebtn = ref("发送验证码");
const disabled = ref(false);

const sendcode = async () => {
  let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!reg.test(phone.value)) {
    Taro.showToast({
      title: "手机号码格式不正确",
      icon: "none",
      duration: 2000,
    });
    return false;
  }
  disabled.value = true;
  let { data, error } = await supabase.auth.signInWithOtp({
    phone: phone.value,
  });
  if (error) {
    Taro.showToast({
      title: error.message || error.error_description,
      duration: 1500,
      icon: "none",
    });
    disabled.value = false;
  } else {
    setTimeout(() => {
      disabled.value = false;
    }, 60000);
  }
};
// 登录处理
const submit = async () => {
  const auth = useStore('auth')
  if (!code.value) {
    Taro.showToast({
      title: "请输入验证码",
      duration: 1500,
      icon: "none",
    });
    return false;
  }
  let { data, error } = await supabase.auth.verifyOtp({
    phone: phone.value,
    token: code.value,
    type: "sms",
  });
  if (error) {
    Taro.showToast({
      title: error.message || error.error_description,
      duration: 1500,
      icon: "none",
    });
  } else {
    auth.userInfo = data.session.user;
    if (JSON.stringify(data.session.user.user_metadata) === "{}") {
      Taro.showToast({
        title: "登录成功,前往修改个人信息页面",
        duration: 1500,
      });
      Taro.redirectTo({
        url: "/pages/userinfo/index",
      });
    } else {
      Taro.showToast({
        title: "登录成功",
        duration: 1500,
      });
      Taro.switchTab({
        url: "/pages/index/index",
      });
    }
  }
};
</script>
