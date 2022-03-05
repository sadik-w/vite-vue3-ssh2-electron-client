<template>
  <span :class="'icon iconfont icon-' + name" :style="{ fontSize: size + 'px' }"></span>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: '',
  props: {
    name: {
      default: "",
      type: String
    },
    size: {
      default: 15
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