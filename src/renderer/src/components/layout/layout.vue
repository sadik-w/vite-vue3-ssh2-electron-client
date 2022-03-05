<template>
  <el-container style="z-index:999">
    <el-header>
      <PHeader @open-setting="addTab"></PHeader>
    </el-header>
    <el-container>
      <el-main>
        <!-- tab页 -->
        <el-tabs
          v-model="editableTabsValue"
          @tab-remove="removeTab"
          style="background: transparent;"
          @tab-click="changeTab"
        >
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            :closable="item.closable"
          >
            <!-- 图标和标题 -->
            <template #label>
              <icon :name="item.icon"></icon>
              <span>{{ item.title }}</span>
            </template>
            <component :ref="item.name" :is="item.type" :data="item" @change="handleChange"></component>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import PHeader from './header.vue'
import homePage from '../page/homePage.vue'
import setting from '../page/setting.vue'
import localConnection from '../page/localConnection.vue'
import remoteGroup from '../page/remoteGroup.vue'
import xterm from '../xterm/xterm.vue';
import { Plus } from '@element-plus/icons-vue'
import { defineComponent, ref, toRefs, SetupContext } from 'vue'
export default defineComponent({
  components: {
    PHeader, homePage, localConnection, remoteGroup, setting, xterm
  },
  setup(props, ctx: SetupContext) {
    const editableTabsValue = ref('home')
    const editableTabs = ref([
      {
        title: '首页',
        name: 'home',
        closable: false,
        icon: 'shouye',
        type: 'homePage',
        data: null
      },
      {
        title: '远端群组',
        name: 'group',
        closable: false,
        icon: 'qunzu',
        type: 'remoteGroup',
        data: null
      },
      {
        title: '本地连接',
        name: 'local_connection',
        closable: false,
        icon: 'bendi',
        type: 'localConnection',
        data: null
      },
    ])
    const funcList = {
      // 复制标签页
      copyConnnection(item: any) {
        let timestamp = Date.parse(new Date().toString());
        let tab = Object.assign({}, item)
        tab.name = tab.data.host + '_' + timestamp;
        editableTabsValue.value = tab.name
        console.log(tab.name)
        console.log(editableTabsValue.value)
        // funcList.addTab(tab)
      },
      // 切换标签页
      changeTab(item: any) {
        sessionStorage.setItem('currentTab', item.paneName)
      },
      // 监听子组件发出的信号，并进行处理
      handleChange(type: String, data: Object) {
        if (type == 'add') {
          funcList.addTab(data)
        }
      },
      addTab(item: any) {
        var result = editableTabs.value.find((v) => {
          return v.name == item.name;
        });
        if (!result) {
          editableTabs.value.push(item)
          editableTabsValue.value = item.name
        }
        else {
          editableTabsValue.value = item.name
        }
        sessionStorage.setItem('currentTab', item.name)
      },
      removeTab: (targetName: string) => {
        const tabs = editableTabs.value
        let activeName = editableTabsValue.value
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        editableTabsValue.value = activeName
        editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
        sessionStorage.setItem('currentTab', activeName)
      }
    }
    return {
      Plus,
      ...funcList,
      editableTabsValue,
      editableTabs
    }
  },
})
</script>