<template>
  <view>
    <view class="container2">
      <text class="top-banner">ToDoList</text>
      <view class="search">
        <nut-searchbar
          v-model="searchVal"
          @search="handerSearch"
        ></nut-searchbar>
      </view>
      <view class="left-title">未完成</view>
    </view>
    <template v-for="(item, index) in todoList" :key="index">
      <nut-swipe v-if="!item.completed" @click="onOpenTodo(item.id)">
        <nut-cell round-radius="0" is-link>
          <radio-group  @change="radioChange(item.id,'completed')">
            <view @click.stop="">
              <radio :checked="item.completed" />{{item.todo}}
            </view>
          </radio-group>
        </nut-cell>
        <template #right @click.capture.prevent>
          <nut-button
            shape="square"
            @click.stop="deleteItem(item.id)"
            style="height: 100%"
            type="danger"
            >删除</nut-button
          >
        </template>
      </nut-swipe>
    </template>
    <view class="container2">
      <view class="left-title">已完成</view>
    </view>
 
    <template v-for="(item, index) in todoList" :key="index">
      <nut-swipe v-if="item.completed" @click="onOpenTodo(item.id)">
        <nut-cell round-radius="0" class="line-through" is-link>
          <radio-group @click.stop="">
            <view @click.stop="radioChange(item.id,'noCompleted')">
              <radio :checked="item.completed" />{{item.todo}} 
            </view>
            </radio-group
        ></nut-cell>
        <template #right @click.capture.prevent>
          <nut-button
            shape="square"
            @click.stop="deleteItem(item.id)"
            style="height: 100%"
            type="danger"
            >删除</nut-button
          >
        </template>
      </nut-swipe>
    </template>

    <view class="container2">
        <button class="add-btn" @click="addItem">新建</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import Taro from "@tarojs/taro";
import "./index.scss";
import {
  FetchPage,
  SearchText,
  DeleteTodo,
  UpdateTodo
} from "./api";
const searchVal = ref("");
const todoList = ref([]);

onMounted(() => {
  getTodoList();
});
const deleteItem = (id) => {
  DeleteTodo(id)
    .then((res) => {
      getTodoList();
      Taro.showToast({
        title: "删除成功！",
        icon: "none",
        duration: 2000,
      });
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 2000,
      });
    });
};
const addItem = () => {
  Taro.navigateTo({
      url: '/pages/addTodo/index',
    })
};
const onOpenTodo = (id) =>{
  Taro.navigateTo({
      url: '/pages/addTodo/index?id='+id,
    })
}
const radioChange = (id,type) =>{
  if(type === 'completed'){
    UpdateTodo({
        completed: true
      },id)
    .then((res) => {
      getTodoList()
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 2000,
      });
    });
  }else if(type === 'noCompleted'){
    UpdateTodo({
        completed: false
      },id)
    .then((res) => {
      getTodoList()
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 2000,
      });
    });
  }

}
// 获取数据
const getTodoList = () => {
  FetchPage()
    .then((res) => {
      todoList.value = res;
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 2000,
      });
    });
};
const handerSearch = () => {
  SearchText(searchVal.value)
    .then((res) => {
      todoList.value = res;
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 2000,
      });
    });
};
</script>
