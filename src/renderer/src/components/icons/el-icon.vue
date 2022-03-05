<template>
  <el-icon :size="size" :color="color">
    <component :is="type"></component>
  </el-icon>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: '',
  props: {
    size: {
      required: false,
      default: 18
    },
    type: {
      required: true
    },
    color: {
      required: false,
      default: null
    }
  },
  components: {
  },
  setup(props, ctx: SetupContext) {

    const data = reactive({
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