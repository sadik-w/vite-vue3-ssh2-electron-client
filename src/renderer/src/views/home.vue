<template>
  <div id="home">
    <Layout></Layout>
  </div>
</template>

<script lang='ts'>
import Layout from "../components/layout/layout.vue"
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: 'layout',
  props: {
  },
  components: {
    Layout
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
#home {
  height: 100%;
  border-radius: 10px;
  background-color: transparent;
  background-color: rgba(250, 250, 250, 0.8);
}
</style>