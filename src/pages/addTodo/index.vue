<template>
  <view class="section">
    <textarea placeholder="请输入内容" v-model="todoInfo.todo" auto-focus />

    <button class="add-btn" @click="addItem">确定</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Taro from "@tarojs/taro";
import "./index.scss";
import { useStore } from "../../stores";

import {
  UpdateTodo,
  AddTodo,
  fetchOneTodo
} from "./api";
const auth = useStore("auth");
const id = ref(null);
const todoInfo = ref({});
const user_id = ref(null);

onMounted(() => {
  user_id.value = auth.userInfo.id;
  if (Taro.getCurrentInstance().router.params.id) {
    id.value = Taro.getCurrentInstance().router.params.id;
    fetchOneTodo(id.value)
      .then((res) => {
        todoInfo.value = res[0]
      })
      .catch((err) => {
        Taro.showToast({
          title: err,
          icon: "none",
          duration: 2000,
        });
      });
  }
});
const addItem = async () => {
  if (!id.value) {

    AddTodo({
      todo: todoInfo.value.todo,
      completed: false,
      user_id: user_id.value
    })
      .then((res) => {
        Taro.showToast({
          title: '新增成功',
          icon: "none",
          duration: 2000
        });
        Taro.navigateTo({
          url: '/pages/todolist/index',
        })
      })
      .catch((err) => {
        Taro.showToast({
          title: err,
          icon: "none",
          duration: 2000,
        });
      });
  } else {
    UpdateTodo({
      todo: todoInfo.value.todo,
      completed: todoInfo.value.completeCheck
    }, id.value)
      .then((res) => {
        Taro.showToast({
          title: '修改成功',
          icon: "none",
          duration: 2000
        });
        Taro.navigateTo({
          url: '/pages/todolist/index',
        })
      })
      .catch((err) => {
        Taro.showToast({
          title: err,
          icon: "none",
          duration: 2000,
        });
      });
  }
};
</script>
