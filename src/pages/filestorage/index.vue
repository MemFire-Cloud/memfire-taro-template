<template>
  <view>
    <nut-tabs swipeable v-model="activeItem" @change="onChangeTab">
      <nut-tabpane title="全部" pane-key="0">
        <view class="f-ab border-bottom" v-for="(item, index) in fileList" :key="index" @click="onOpenPop(item.name)">
          <view class="item-box">
            <image src="../../images/file.svg"></image>
            <view class="content-box">
              <text class="cell">{{ item.name }}</text>
              <text class="t-s mt-10">{{ item.size }}</text>
            </view>
          </view>
          <view class="t-s">
            {{ item.created_at }}
          </view>
        </view>
      </nut-tabpane>
      <nut-tabpane title="图片" pane-key="1">
        <view class="f-ab border-bottom" v-for="(item, index) in fileList" :key="index" @click="onOpenPop(item.name)">
          <view class="item-box">
            <image src="../../images/image.svg"></image>
            <view class="content-box">
              <text class="cell">{{ item.name }}</text>
              <text class="t-s mt-10">{{ item.size }}</text>
            </view>
          </view>
          <view class="t-s">
            {{ item.created_at }}
          </view>
        </view>
      </nut-tabpane>
      <nut-tabpane title="文档" pane-key="2">
        <view class="f-ab border-bottom" v-for="(item, index) in fileList" :key="index" @click="onOpenPop(item.name)">
          <view class="item-box">
            <image src="../../images/file.svg"></image>
            <view class="content-box">
              <text class="cell">{{ item.name }}</text>
              <text class="t-s mt-10">{{ item.size }}</text>
            </view>
          </view>
          <view class="t-s">
            {{ item.created_at }}
          </view>
        </view>
      </nut-tabpane>
      <nut-tabpane title="视频" pane-key="3">
        <view class="f-ab border-bottom" v-for="(item, index) in fileList" :key="index" @click="onOpenPop(item.name)">
          <view class="item-box">
            <image src="../../images/vadio.svg"></image>
            <view class="content-box">
              <text class="cell">{{ item.name }}</text>
              <text class="t-s mt-10">{{ item.size }}</text>
            </view>
          </view>
          <view class="t-s">
            {{ item.created_at }}
          </view>
        </view>
      </nut-tabpane>
    </nut-tabs>

    <view class="container2">
      <button class="add-btn" @click="onUpload">上传</button>
    </view>
    <nut-popup v-model:visible="show" position="bottom" custom-style="height: 30%;">
      <view class="pop-btn" @click="downloadFile">下载</view>
      <view class="pop-btn err-color" @click="removeFile">删除</view>
      <view class="pop-cansel" @click="onClosePop">取消</view>
    </nut-popup>
  </view>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import Taro from "@tarojs/taro";
import { supabase } from "../../lib/supabaseClient";
import "./index.scss";
import {
  RemoveFile,
  ListFile,
  ListProfixFile,
} from "./api";
const fileName = ref("");
const show = ref(false);
const fileList = ref([]);
const activeItem = ref(0);
const itemFileName = ref("");

onMounted(() => {
  getListFile();
})
const onClosePop = () => {
  show.value = false
}
const onOpenPop = (name) => {
  show.value = true;
  itemFileName.value = name;
}
const downloadFile = async () => {
  const name = itemFileName.value
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
      show.value = false
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
const onChangeTab = (e) => {
  ListProfixFile(e.title)
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
const removeFile = async () => {
  const name = itemFileName.value
  RemoveFile(name)
    .then((res) => {
      Taro.showToast({
        title: "删除成功",
        icon: "none",
        duration: 2000,
      });
      getListFile();
      show.value = false
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
