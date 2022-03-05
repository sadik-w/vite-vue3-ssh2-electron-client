<template>
  <div
    style="width: 100%;height: 100%; padding-top: 30px; box-sizing: border-box;"
    @contextmenu="showMenu"
    @click="hideMenu"
  >
    <div
      class="xterm-context-menu"
      tabindex="0"
      v-show="menu.display"
      :style="{ left: menu.x + 'px', top: menu.y + 100 + 'px' }"
    >
      <div class="xterm-context-menu-item" @click="copyText">
        复制
        &nbsp;
        <code>ctrl+shift+c</code>
      </div>
      <div class="xterm-context-menu-item" @click="pasteText">
        粘粘&nbsp;
        <code>ctrl+shift+c</code>
      </div>
      <div class="xterm-context-menu-item" @click="clear">清空</div>
      <div class="xterm-context-menu-item" @click="selectAll">全选</div>
      <div class="xterm-context-menu-item" @click="backToTop">回到顶部</div>
      <div class="xterm-context-menu-item" @click="backToBottom">回到底部</div>
      <div class="xterm-context-menu-item" @click="refresh(); initTerm()">重新连接</div>
      <div class="xterm-context-menu-item" @click="copy">在新标签页打开连接</div>
      <div class="xterm-context-menu-item" @click="drawer = true;">SFTP</div>
    </div>
    <div class="xterm-config">
      <div class="xterm-status" :style="{ backgroundColor: status ? 'green' : 'red' }"></div>
      <div class="xterm-title">{{ data.data.username }}@{{ data.data.host }}:{{ data.data.port }}</div>
      <div class="xterm-edit">
        <el-button size="small" type="success" :icon="Refresh" @click="refresh(); initTerm()">重连</el-button>
        <el-button size="small" type="primary" :icon="FolderOpened" @click="drawer = true;">SFTP</el-button>
        <el-button size="small" type="warning" :icon="CopyDocument" @click="copy">复制连接</el-button>
      </div>
    </div>
    <div class="xterm" :id="data.name" style="width: 100%;height: 100%;"></div>
    <el-drawer v-model="drawer" direction="btt" size="80%" :show-close="false">
      <sftp :data="data" v-if="drawer"></sftp>
    </el-drawer>
  </div>
</template>

<script lang='ts'>
import sftp from './sftp.vue'
import { read_data } from '../../plugins/electron-store';
import { Refresh, FolderOpened, CopyDocument } from '@element-plus/icons-vue'
import { defineComponent, reactive, toRefs, SetupContext, onMounted, onBeforeUnmount } from 'vue'
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit"
import { WebglAddon } from 'xterm-addon-webgl';
import ssh2 from "electron-ssh2"
import "xterm/css/xterm.css"
import { clipboard } from 'electron';
export default defineComponent({
  name: 'xterm',
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
  components: { sftp },
  setup(props, ctx: SetupContext) {
    // 设置配置项
    let option = read_data('setting.terminal') as Object;
    var term = new Terminal(option);
    var fitAddon = new FitAddon();
    let conn = new ssh2.Client();
    const data = reactive({
      status: false, drawer: false,
      menu: {
        display: false,
        x: 0,
        y: 0
      }
    })
    const funcList = {
      copyText() {
        clipboard.writeText(term.getSelection())
      },
      pasteText() {
        term.paste(clipboard.readText())
        term.focus()
      },
      selectAll() {
        term.selectAll()
      },
      backToTop() {
        term.scrollToTop()
      },
      backToBottom() {
        term.scrollToBottom()
      },
      clear() {
        term.clear()
      },
      // 显示右键菜单
      showMenu(ev: any) {
        data.menu = { display: true, x: ev.offsetX, y: ev.offsetY }
      },
      hideMenu() {
        data.menu.display = false;
      },
      // 创造连接
      copy() {
        let data = Object.assign({}, props.data)
        let timestamp = Date.parse(new Date().toString());
        data.name = timestamp
        ctx.emit("change", 'add', data)
      },
      // 重连前的初始化
      refresh() {
        conn.end();
        term.dispose();
        term = new Terminal(option);
        fitAddon = new FitAddon();
        conn = new ssh2.Client();
      },
      // 初始化/连接
      initTerm() {
        // 初始化xterm
        term.loadAddon(fitAddon);
        const ele = document.getElementById(props.data.name) as HTMLElement
        term.open(ele);
        fitAddon.fit();
        term.loadAddon(new WebglAddon());
        term.focus();
        term.writeln('Hello from \x1B[1;32;32mPccShell\x1B[0m ')
        term.writeln('\x1B[30;47m SSH \x1B[0m Connecting to ' + props.data.data.host)
        // 添加窗口监听
        window.addEventListener('resize', () => {
          if (sessionStorage.getItem('currentTab') == props.data.name) {
            fitAddon.fit()
          }
        });
        //连接
        conn.on('ready', () => {
          data.status = true;
          conn.shell((err: any, stream: any) => {
            term.onData(data => {
              stream.write(data)
            })
            stream.on('data', (data: string) => {
              term.write(data);
            }).on('exit', (code: string, signal: any) => {
              data.status = false;
              console.log('关闭socket')
              conn.end();
            }).stderr.on('data', (data: string) => {
              term.write(data)
            })
          })
        })
          //键盘交互式，防止服务器设置authorizationpassword：no
          .on('keyboard-interactive', function (name: any, descr: any, lang: any, prompts: any, finish: any) {
            return finish([props.data.data.password]);
          })
          // 处理连接错误
          .on('error', (err: Error) => {
            console.error(err.message)
            term.writeln(`\x1b[30;41m X \x1b[0m\x1b[31m ${err.message} \x1b[0m`)
            term.writeln(`\x1b[31m 连接出错，请查看用户名密码是否正确 \x1b[0m`)
            conn.end()
          })
          // 打开允许键盘交互
          .connect(Object.assign(props.data.data, { tryKeyboard: true }))
      }
    }
    onMounted(() => {
      funcList.initTerm();
      // 监听复制事件ctrl+shift+c
      window.addEventListener("keyup", (e) => {
        if (e.shiftKey && e.ctrlKey && e.key == 'C') {
          funcList.copyText();
          e.preventDefault();
          return false;
        }
      })
    });
    onBeforeUnmount(() => {
      conn.end();
      term.dispose();
    })
    return {
      ...toRefs(data),
      ...funcList,
      Refresh, FolderOpened, CopyDocument
    }
  },
})
</script>
<style lang="scss">
// 右键菜单
.xterm-context-menu {
  border-radius: 10px;
  font-size: 13px;
  width: 170px;
  background-color: rgb(255, 255, 255, 0.9);
  position: fixed;
  z-index: 9999;
}

// 菜单选项
.xterm-context-menu-item {
  border-radius: 10px;
  width: 170px;
  height: 30px;
  padding: 5px;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  background: transparent;
  &:hover {
    background-color: rgba(0, 140, 255, 0.7);
  }
}
// 操作栏
.xterm-config {
  height: 30px;
  margin-top: -30px;
}
// 连接状态
.xterm-status {
  display: block;
  margin: 10px;
  border-radius: 100%;
  height: 10px;
  width: 10px;
  float: left;
}
// 连接标题
.xterm-title {
  user-select: none;
  position: relative;
  top: 5px;
  display: block;
  font-size: 15px;
  font-weight: 800;
  float: left;
  // font-family:;
}
// 操作栏
.xterm-edit {
  position: relative;
  top: 2px;
  display: block;
  float: right;
}

.xterm-viewport {
  overflow-y: auto;
  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 14px; /*对垂直流动条有效*/
  }

  /*定义滚动条的轨道颜色、内阴影及圆角*/
  &::-webkit-scrollbar-track {
    width: 10px;
    background-color: transparent;
    border-radius: 10px;
  }

  /*定义滑块颜色、内阴影及圆角*/
  &::-webkit-scrollbar-thumb {
    border: 5px solid transparent;
    background-color: aliceblue;
    border-radius: 10px;
    background-clip: padding-box;
    min-height: 30px;
  }
}

.el-drawer__body {
  overflow-y: auto;
  /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 14px; /*对垂直流动条有效*/
  }

  /*定义滚动条的轨道颜色、内阴影及圆角*/
  &::-webkit-scrollbar-track {
    width: 10px;
    background-color: transparent;
    border-radius: 10px;
  }

  /*定义滑块颜色、内阴影及圆角*/
  &::-webkit-scrollbar-thumb {
    border: 5px solid transparent;
    background-color: rgb(170, 170, 170);
    border-radius: 10px;
    background-clip: padding-box;
    min-height: 30px;
  }
}
</style>