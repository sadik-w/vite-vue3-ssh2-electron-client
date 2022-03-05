<template>
  <div class="full_page flex-row" style="padding-left: 170px;">
    <el-menu default-active="Application" class="el-menu-vertical-demo" style="margin-left:-170px;">
      <el-menu-item
        :index="item.page"
        v-for="item in menu"
        :key="item.page"
        @click="goto(item.page)"
      >
        <icon :name="item.icon" size="15" style="margin-right: 10px;"></icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
    <component :is="current_page"></component>
  </div>
</template>

<script lang='ts'>
import application from '../setting/application.vue'
import appearance from '../setting/appearance.vue'
import terminal from '../setting/terminal.vue'
import colorScheme from '../setting/colorScheme.vue'
import configSync from '../setting/configSync.vue'
import editor from '../setting/editor.vue'
import download from '../setting/download.vue'
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: '',
  props: ['data'],
  components: {
    application, appearance, terminal, colorScheme, editor, configSync, download
  },
  setup(props, ctx: SetupContext) {
    const data = reactive({
      current_page: 'application',
      menu: [
        { title: '应用', icon: 'application', page: 'application' },
        { title: '终端', icon: 'terminal', page: 'terminal' },
        { title: '颜色', icon: 'color', page: 'colorScheme' },
        { title: '后台服务器', icon: 'Cloud', page: 'configSync' },
        { title: '编辑器', icon: 'code', page: 'editor' },
        { title: '下载', icon: 'download', page: 'download' },
      ]
    })
    const funcList = {
      goto(page: string) {
        data.current_page = page
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
</style>