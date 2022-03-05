<template>
  <div class="full_page" style="text-align: center;">
    <img src="../../../public/favicon.ico" style="border-radius: 100%;height: 100px;" />
    <p style="font-size: 25px;font-weight: 600;color: rgb(0, 88, 139);">PccShell</p>
    <p style="color: rgb(0, 88, 139);">版本：1.0.1</p>
    <el-button :icon="Eleme">element-plus组件库</el-button>
    <el-button :icon="Chicken">反馈bug</el-button>
    <el-button :icon="Refresh">检查更新</el-button>
  </div>
</template>

<script lang='ts'>
import { Eleme, Refresh, Chicken } from '@element-plus/icons-vue'
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: '',
  props: {
  },
  components: {

  },
  setup(props, ctx: SetupContext) {

    const data = reactive({
      Eleme, Refresh, Chicken
    })
    const funcList = {

    }
    return {
      ...toRefs(data),
      ...funcList
    }
  },
})
</script>

<style scoped lang='scss'>
</style>