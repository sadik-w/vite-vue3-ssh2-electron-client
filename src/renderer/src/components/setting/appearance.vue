<template>
  <div class="full_page">
    <el-form ref="formRef" :model="form" label-width="120px">
      <el-form-item label="字体">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: '',
  props: {
  },
  setup(props, ctx: SetupContext) {
    const data = reactive({
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      }
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