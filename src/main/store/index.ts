import Store from 'electron-store'
import os from 'os'
import { default_setting } from "./default_setting"
Store.initRenderer();
// 初始化store
const store = new Store();

// 没有域用户名，开始初始化文件
if (!store.has('username')) {
  let username = os.homedir().slice(os.homedir().lastIndexOf('\\') + 1)
  store.set('username', username);
  store.set('local_connections', [])
  store.set('setting', default_setting.setting)
}
