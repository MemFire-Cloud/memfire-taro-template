<template>
  <view>
    <nut-cell-group title="菜单页">
      <nut-cell title="todolist" @click="tabLink('todolist')" is-link></nut-cell>
      <nut-cell title="聊天室" @click="tabLink('messages')" is-link></nut-cell>
      <nut-cell title="网盘" @click="tabLink('filestorage')" is-link></nut-cell>
    </nut-cell-group>
  </view>
</template>

<script setup>
import Taro from "@tarojs/taro";
import { ref } from "vue";
import "./index.scss";
    const tabLink = ((tab) => {
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
      }
    })
</script>
