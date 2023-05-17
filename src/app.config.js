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
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#7A7E83',
    selectedColor: '#007AFF',
    backgroundColor: '#F8F8F8',
    list: [
      {
        pagePath: 'pages/index/index',
        selectedIconPath: 'images/index_on.png',
        iconPath: 'images/index_off.png',
        text: '首页',
      },
      {
        pagePath: 'pages/me/index',
        selectedIconPath: 'images/mine_on.png',
        iconPath: 'images/mine_off.png',
        text: '我的',
      },
    ],
  },
})
