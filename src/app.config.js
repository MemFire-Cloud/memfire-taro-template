export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/me/index',
    'pages/filestorage/index',
    'pages/login/index',
    'pages/phone-login/index',
    'pages/todolist/index',
    'pages/userinfo/index',
    'pages/messages/index'
  ],
  window: {
    backgroundColor: "#FFFFFF",
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#FFF",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    color: "#777777",
    selectedColor: "#f76012",
    borderStyle: "white",
    list: [
      {
        pagePath: 'pages/index/index',
        selectedIconPath: 'images/my-on.png',
        iconPath: 'images/my-off.png',
        text: '首页',
      },
      {
        pagePath: 'pages/me/index',
        selectedIconPath: 'images/index-on.png',
        iconPath: 'images/index-off.png',
        text: '我的',
      },
    ],
  },
})
