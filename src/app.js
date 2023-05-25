import { createApp } from 'vue'
import './app.scss'
import { createPinia } from 'pinia';
import Taro from "@tarojs/taro";
import { supabase } from './lib/supabaseClient'
import NutUI from "@nutui/nutui-taro" // 在入口文件处引用NutUI
import "@nutui/nutui-taro/dist/style.css";
import { useStore } from './stores'
const pinia = createPinia()
const App = createApp({
  
  async onShow(options) {
    const auth = useStore('auth')
    const { data: { user }, error } = await supabase
      .auth.getUser()
    if (error) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    } else if(!user){
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    } else {
      auth.setUserInfo(user.data)
      Taro.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(NutUI).use(pinia);
export default App
