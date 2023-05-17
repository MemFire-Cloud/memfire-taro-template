<template>
  <view class="container">
    <view class="login">
      <button class="wechat" @click="login">微信用户一键登录</button>
      <button class="phone" @click="phoneLogin">手机登录/注册</button>
    </view>
  </view>
</template>

<script setup>
import { supabase } from "../../lib/supabaseClient";
import { ref } from "vue";
import Taro from "@tarojs/taro";
import "./index.scss";
import { useStore } from "../../stores";

const login = () => {
  Taro.login({
    success: async (res) => {
      const { data, error } = await supabase.auth.signInWithWechat({
        code: res.code,
      });
      if (error) {
        Taro.showToast({
          title: error?.error || error?.msg,
          icon: "none",
          duration: 2000,
        });
      } else if (data) {
        if (JSON.stringify(data.user.data.user.user_metadata) === "{}") {
          setTimeout(() => {
            Taro.showModal({
              title: "提示",
              content: "登录成功！去填充个人资料吧！",
              success(res) {
                if (res.confirm) {
                  Taro.redirectTo({
                    url: "/pages/userinfo/index",
                  });
                } else if (res.cancel) {
                }
              },
            });
          }, 1000);
        } else {
          const auth = useStore("auth");
          auth.userInfo = data.user.data.user;
          Taro.switchTab({
            url: "/pages/index/index",
          });
        }
      }
    },
    fail(err) {
      Taro.showToast({
        title: err.errMsg,
        icon: "none",
        duration: 2000,
      });
    },
  });
};
const phoneLogin = () => {
  Taro.redirectTo({
    url: "/pages/phone-login/index",
  });
};
</script>
