<template>
  <div>editor</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: '',
  props: {
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