import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './icons/font-ant/iconfont.css'
import axios from 'axios'
import icon from './components/icons/icon.vue'
import elicon from './components/icons/el-icon.vue'
import './style/global.css'
import './plugins/icon.js'
import { write_data, read_data, delete_data, has_data } from './plugins/electron-store'


const app = createApp(App)
// axios全局导入
app.config.globalProperties.$axios = axios
// electron-store写数据
app.config.globalProperties.$write_data = write_data
// electron-store读数据
app.config.globalProperties.$read_data = read_data
// electron-store删除数据
app.config.globalProperties.$delete_data = delete_data
// electron-store检测路径
app.config.globalProperties.$has_data = has_data

// 挂载根元素，加载插件
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app').$nextTick(window.removeLoading)

// 注册自定义组件
app.component('icon', icon)
app.component('elicon', elicon)

