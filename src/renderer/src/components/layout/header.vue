<template>
  <div class="window-header">
    <div class="window-logo">
      <img class="window-logo app-logo" src="../../../public/favicon.ico" />
    </div>
    {{ current_route }}
    <!-- 窗口管理器 -->
    <div class="window-manager">
      <!-- 设置 -->
      <div class="window-icon window-normal" title="设置" @click="open_setting">
        <icon name="setting" size="20"></icon>
      </div>
      <!-- 最小化窗口 -->
      <div class="window-icon window-normal" @click="minimizeWin">
        <icon name="minsize"></icon>
      </div>
      <!-- 最大化/还原窗口 -->
      <div class="window-icon window-normal" @click="maximizeWin">
        <icon name="icon iconfont icon-zuidahuaxi"></icon>
      </div>
      <!-- 关闭窗口 -->
      <div class="window-icon window-close" @click="closeWin">
        <icon name="icon iconfont icon-guanbi"></icon>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ipcRenderer } from 'electron'
export default defineComponent({
  setup(props, ctx) {
    const Route = useRoute()
    const data = reactive({
    })
    const current_route = computed(() => {
      return Route.path
    })

    const funcList = {
      // 打开设置
      open_setting() {
        let item = {
          title: '设置',
          name: 'setting',
          closable: true,
          icon: 'setting',
          type: "setting",
          data: null
        }
        ctx.emit('open-setting', item)
      },
      // 最小化窗口
      minimizeWin() {
        ipcRenderer.send('window-min') // 通知主进程我要进行窗口最小化操作
      },
      // 最大化/还原窗口
      maximizeWin() {
        ipcRenderer.send('window-max')
      },
      // 关闭窗口
      closeWin() {
        ipcRenderer.send('window-close')
      }
    }
    return {
      ...toRefs(data),
      ...funcList,
      current_route
    }
  },
})
</script>

<style scoped lang='scss'>
.window-header {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  -webkit-app-region: drag;
  width: 100%;
  background-color: rgba($color: #d4d4d4, $alpha: 0.8);
  color: #5a5a5a;
  height: 100%;

  .window-manager {
    float: right;
    .window-icon {
      -webkit-app-region: no-drag;
      display: inline-block;
      line-height: 30px;
      height: 100%;
      width: 46px;
      font-size: 16px;
      text-decoration: none;
      text-rendering: auto;
      text-align: center;
      cursor: pointer;
    }

    .window-normal {
      &:hover {
        background-color: rgba(138, 138, 138, 0.267);
      }
    }
    .window-close {
      &:hover {
        background-color: rgb(255, 0, 0);
        color: white;
      }
    }
  }

  .window-title {
    float: left;
    text-align: center;
    height: 30px;
    display: flex;
    flex-direction: row;
    // justify-content: center;
    align-items: center;
  }
  .window-logo {
    float: left;
    height: 30px;
    margin: 2px;
    z-index: 999;
  }

  .app-logo {
    height: 28px;
    position: relative;
    bottom: 3px;
    border-radius: 100%;
  }
}
</style>