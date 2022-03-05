<template>
  <router-view></router-view>
</template>

<script lang='ts'>
import { ipcRenderer } from 'electron'
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: '',
  props: {},
  components: {},
  setup(props, ctx: SetupContext) {
    let env = process.env.NODE_ENV
    document.addEventListener('keyup', function (e) {
      if (e && e.keyCode == 123 && env == 'development') {
        ipcRenderer.send('open-devtools')
      }
      if (e && e.keyCode == 123 && e.ctrlKey && env == 'production') {
        ipcRenderer.send('open-devtools')
      }
    })
  },
})
</script>

<style lang='scss'>
html,
body,
#app {
  background-color: transparent;
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
  border-radius: 10px;
  overflow: hidden;
}
</style>