<template>
  <view class="container">
    <view class="search">
      <input
        class="input"
        @confirm="handerSearch"
        v-model="searchVal"
        type="text"
        maxlength="20"
        placeholder="搜索"
      />
    </view>
    <view>
      <nut-table
        class="table-container"
        :columns="columns"
        :data="todoList"
        :striped="true"
        :fixed-header="true"
      >
        <template #nodata>
          <div class="no-data">暂无数据</div>
        </template>
      </nut-table>
    </view>

    <view class="uni-pagination-box">
      <nut-pagination
        v-model="pageCurrent"
        :total-items="total"
        :items-per-page="pageSize"
        @change="change"
    /></view>

    <button class="add-btn" @click="addItem">添加</button>
    <nut-dialog
      :title="todo_id ? '修改' : '添加'"
      v-model:visible="visible"
      @cancel="close"
      @ok="confirm"
    >
      <view class="">
        <nut-form :modelValue="formData" label-position="top">
          <nut-form-item required label="待办事项" name="todo">
            <input
              type="text"
              v-model="formData.todo"
              placeholder="请输待办事项"
            />
          </nut-form-item>
          <nut-form-item required name="completed" label="是否完成">
            <switch :checked="formData.completed" @change="handerComplete" />
          </nut-form-item>
        </nut-form>
      </view>
    </nut-dialog>
  </view>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import Taro from "@tarojs/taro";
import { supabase } from "../../lib/supabaseClient";
import { DownloadImage } from "../../utils/commonApi";
import "./index.scss";
import { useStore } from "../../stores";
import {
  FetchTodo,
  FetchPage,
  SearchText,
  UpdateTodo,
  AddTodo,
  DeleteTodo,
} from "./api";
const auth = useStore("auth");
const searchVal = ref("");
const pageSize = ref(10);
const loading = ref(false);
const aa = ref(true);
const todo_id = ref(null);
const todoList = ref([]);
const showModal = ref(false);
const searchInput = ref("");
const pageCurrent = ref(1);
const completeCheck = ref(false);
const total = ref(0);
const start = ref(0);
const end = ref(9);
const user_id = ref(null);
const formData = ref({});
const visible = ref(false);
const columns = ref([
  {
    title: "待办事项",
    key: "todo",
    render: (record) => {
      return h("span", record.todo);
    },
  },
  {
    title: "是否完成",
    key: "completed",
    render: (record) => {
      return h(
        "span",
        {
          style: {
            color: record.completed ? "green" : "red",
          },
        },
        record.completed ? "完成" : "未完成"
      );
    },
  },
  {
    title: "操作",
    key: "action",
    render: (record) => {
      return h("div", { class: "flex" }, [
        h(
          "button",
          {
            class: "btn-s-size",
            type: "warn",
            onClick: () => deleteItem(record.id),
          },
          "删除"
        ),
        h(
          "button",
          { type: "default", class: "btn-s-size", onClick: () => updateItem(record) },
          "编辑"
        ),
      ]);
    },
  },
]);

onMounted(() => {
  getTodoList(start.value, end.value);
  allCount();
});
const deleteItem = (id) => {
  DeleteTodo(id)
    .then((res) => {
      getTodoList(start.value, end.value);
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
const updateItem = (item) => {
  formData.value.todo = item.todo;
  formData.value.completed = item.completed;
  todo_id.value = item.id;
  visible.value = true;
};
const close = () => {
  // TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
  // ...
  visible.value = false;
};
const confirm = () => {
  if (!todo_id.value) {
    AddTodo({
      user_id: auth.userInfo.id,
      ...formData.value,
    })
      .then((res) => {
        getTodoList(start.value, end.value);
        visible.value = false;
        Taro.showToast({
          title: "添加成功！",
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
  } else if (todo_id.value) {
    UpdateTodo(formData.value, todo_id.value)
      .then((res) => {
        getTodoList(start.value, end.value);
        visible.value = false;
        Taro.showToast({
          title: "修改成功！",
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
  }
};
const handerComplete = (e) => {
  formData.value.completed = e.detail.value;
};
// 分页触发
const change = (e) => {
  start.value = e * 10 - 10;
  end.value = e * 10 - 1;
  getTodoList(e * 10 - 10, e * 10 - 1);
};
const addItem = () => {
  formData.value = {};
  todo_id.value = null;
  visible.value = true;
};
// 获取数据
const getTodoList = (start, end) => {
  FetchPage(start, end)
    .then((res) => {
      todoList.value = res;
      allCount();
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 2000,
      });
    });
};
const allCount = () => {
  FetchTodo()
    .then((res) => {
      total.value = res;
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
