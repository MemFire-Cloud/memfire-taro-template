<template>
  <view class="container">
    <view class="category">
      <view class="title">文件分类</view>
      <view class="list">
        <view
          :class="activeItem === item.id ? 'selected item-st' : 'item-st'"
          @click="handertab(item.id)"
          v-for="(item, index) in btnList"
          :key="index"
        >
          {{ item.name }}
        </view>
      </view>
    </view>

    <nut-table
      class="table-container"
      :columns="columns"
      :data="fileList"
      :striped="true"
    >
      <template #nodata>
        <div class="no-data">暂无数据</div>
      </template>
    </nut-table>

    <view class="upload-section">
      <view class="title">上传文件</view>
      <view class="input-group">
        <button class="upload-btn" type="primary" @click="onUpload">选择文件</button>
				<view class="file-info">{{ fileName ? fileName : '未选择图片' }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import Taro from "@tarojs/taro";
import { supabase } from "../../lib/supabaseClient";
import { DownloadImage } from "../../utils/commonApi";
import "./index.scss";
import {
  UploadFile,
  DownloadFile,
  RemoveFile,
  ListFile,
  ListProfixFile,
} from "./api";
const fileName = ref("");
const fileList = ref([]);
const btnList = ref([
  { name: "全部", id: 0 },
  { name: "图片", id: 1 },
  { name: "文档", id: 2 },
  { name: "视频", id: 3 },
]);
const activeItem = ref(0);
const imageValue = ref("");
const columns = ref([
  {
    title: "文件名",
    key: "name",
    render: (record) => {
      return h("span",{class:'cell'}, record.name);
    },
  },
  {
    title: "大小",
    key: "size",
    render: (record) => {
      return h(
        "span",
        record.size
      );
    },
  },  {
    title: "上传时间",
    key: "created_at",
    render: (record) => {
      return h(
        "span",
        record.created_at
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
            onClick: () => removeFile(record.name),
          },
          "删除"
        ),
        h(
          "button",
          { type: "default", class: "btn-s-size", onClick: () => downloadFile(record.name) },
          "下载"
        ),
      ]);
    },
  },
]);
onMounted(()=>{
  getListFile();
})
const downloadFile = async (name) => {
  const { data, error } = await supabase.storage
    .from("files")
    .createSignedUrl(name, 60);
  Taro.downloadFile({
    url: data.signedUrl,
    success(res) {
      if (
        name.slice(name.lastIndexOf(".") + 1) === "png" ||
        name.slice(name.lastIndexOf(".") + 1) === "jpg" ||
        name.slice(name.lastIndexOf(".") + 1) === "mp4"
      ) {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath, //图片文件路径
          success: function (data) {
            Taro.hideLoading(); //隐藏 loading 提示框
            Taro.showModal({
              title: "提示",
              content: "保存成功",
              modalType: false,
            });
          },
          // 接口调用失败的回调函数
          fail: function (err) {
            if (
              err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" ||
              err.errMsg === "saveImageToPhotosAlbum:fail auth deny" ||
              err.errMsg === "saveImageToPhotosAlbum:fail authorize no response"
            ) {
              Taro.showModal({
                title: "提示",
                content: "需要您授权保存相册",
                modalType: false,
                success: (modalSuccess) => {
                  Taro.openSetting({
                    success(settingdata) {
                      console.log("settingdata", settingdata);

                      if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                        Taro.showModal({
                          title: "提示",
                          content: "获取权限成功,再次点击图片即可保存",
                          modalType: false,
                        });
                      } else {
                        Taro.showModal({
                          title: "提示",
                          content: "获取权限失败，将无法保存到相册哦~",
                          modalType: false,
                        });
                      }
                    },
                    fail(failData) {
                      console.log("failData", failData);
                    },
                    complete(finishData) {
                      console.log("finishData", finishData);
                    },
                  });
                },
              });
            }
          },
          complete(res) {
            Taro.hideLoading(); //隐藏 loading 提示框
          },
        });
      } else {
        Taro.openDocument({
          filePath: res.tempFilePath,
          showMenu: true, //关键点
          success: function (res) {
            console.log("打开文档成功");
          },
          fail: function (err) {
            Taro.showToast({
              title: err.errMsg,
              icon: "none",
              duration: 2000,
            });
          },
        });
      }
    },
  });
};
const getListFile = () => {
  ListFile()
    .then((res) => {
      fileList.value = res;
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 2000,
      });
    });
};
const handertab = (id) => {
  activeItem.value = id;
  ListProfixFile(btnList.value[activeItem.value].name)
    .then((res) => {
      fileList.value = res;
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 2000,
      });
    });
};
const removeFile = async (name) => {
  RemoveFile(name)
    .then((res) => {
      Taro.showToast({
        title: "删除成功",
        icon: "none",
        duration: 2000,
      });
      getListFile();
    })
    .catch((err) => {
      Taro.showToast({
        title: err,
        icon: "none",
        duration: 2000,
      });
    });
};
const onUpload = () => {
  Taro.chooseMessageFile({
    count: 1,
    type: "all",
    async success(res) {
      res.tempFiles[0].tempFilePath = res.tempFiles[0].path;
      delete res.tempFiles[0].path;
      const file = res.tempFiles[0];
      const filePath = res.tempFiles[0].name;

      fileName.value = filePath;
      const { data, error } = await supabase.storage
        .from("files")
        .upload(filePath, file, {
          cacheControl: "3600",
        });

      if (error) {
        Taro.showToast({
          title: error.data.message || error.data.error_description,
          icon: "none",
          duration: 2000,
        });
      } else {
        Taro.showToast({
          title: "上传成功",
          icon: "none",
          duration: 2000,
        });

        ListFile();
      }
    },
  });
};
</script>
