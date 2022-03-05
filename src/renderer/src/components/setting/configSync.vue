<template>
  <div class="setting_configSync scrollbar">
    <el-form :model="form" label-width="100px" label-position="left">
      <el-form-item label="后台地址">
        <el-input v-model="form.syncPath" @change="save"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { write_data, read_data } from '../../plugins/electron-store'
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: '',
  props: {
  },
  components: {

  },
  setup(props, ctx: SetupContext) {
    const data = reactive({
      form: {
        syncPath: 'http://10.141.60.23:3000'
      }
    })
    data.form = read_data('setting.configSync')
    const funcList = {
      save() {
        write_data('setting.configSync', data.form)
      }
    }
    return {
      ...toRefs(data),
      ...funcList
    }
  },
})
</script>

<style scoped lang='scss'>
.setting_configSync {
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-left: 30px;
  overflow: auto;
}
</style>