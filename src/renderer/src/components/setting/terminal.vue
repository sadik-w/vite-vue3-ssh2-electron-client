<template>
  <div class="setting_terminal scrollbar">
    <el-form
      ref="formRef"
      :model="form"
      label-width="100px"
      style="width: 60%;"
      label-position="left"
    >
      <el-form-item label="字体">
        <el-select
          v-model="form.fontFamily"
          class="m-2"
          placeholder="Select"
          size="large"
          @change="save"
        >
          <el-option v-for="item in fontFamily" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主题">
        <el-select-v2
          v-model="form.theme.name"
          :options="theme_list"
          filterable
          @change="themeChange"
        />
      </el-form-item>
      <el-form-item label="字号">
        <el-input-number
          v-model="form.fontSize"
          :min="10"
          :max="25"
          controls-position="right"
          @change="save"
        />
      </el-form-item>
      <el-form-item label="光标形状">
        <el-radio-group v-model="form.cursorStyle" @change="save">
          <el-radio-button v-for="item in cursorStyle" :key="item" :label="item"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="光标闪烁">
        <el-switch v-model="form.cursorBlink" @change="save"></el-switch>
      </el-form-item>
      <el-form-item label="渲染方式">
        <el-radio-group v-model="form.rendererType" @change="save">
          <el-radio-button label="canvas"></el-radio-button>
          <el-radio-button label="dom"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="字体粗细">
        <el-input-number
          v-model="form.fontWeight"
          :min="100"
          :max="900"
          :step="100"
          controls-position="right"
          @change="save"
        />
      </el-form-item>
      <el-form-item label="行高">
        <el-input-number
          v-model="form.lineHeight"
          :min="1"
          :max="3"
          :step="0.2"
          controls-position="right"
          @change="save"
        />
      </el-form-item>
      <el-form-item label="右键选择">
        <el-switch v-model="form.rightClickSelectsWord"></el-switch>
      </el-form-item>
      <el-form-item label="单词间距">
        <el-input-number
          v-model="form.letterSpacing"
          :min="-3"
          :max="10"
          :step="0.1"
          controls-position="right"
          @change="save"
        />
      </el-form-item>
      <el-form-item label="允许透明">
        <el-switch v-model="form.allowTransparency" @change="switchTransparency"></el-switch>
      </el-form-item>
      <el-form-item label="透明度" v-if="form.allowTransparency">
        <el-input-number
          v-model="form.transparent"
          :min="0"
          :max="95"
          :step="5"
          @change="changeTransparent"
        />
      </el-form-item>
    </el-form>
    <div
      class="setting_terminal_preview"
      :style="{ background: form.theme.background, fontSize: form.fontSize + 'px', fontFamily: form.fontFamily, fontWeight: form.fontWeight, lineHeight: form.lineHeight, letterSpacing: form.letterSpacing + 'px' }"
    >
      <p>
        <span :style="{ color: form.theme.green }">john</span>
        <span :style="{ color: form.theme.cyan }">@</span>
        <span :style="{ color: form.theme.blue }">doe-pc</span>
        <span :style="{ color: form.theme.red }">$</span>
        <span :style="{ color: form.theme.white }">&nbsp;ls</span>
      </p>
      <p>
        <span :style="{ color: form.theme.white }">-rwxr-xr-x 1 root</span>
        <span :style="{ color: form.theme.yellow }">&nbsp;Documents</span>
      </p>
      <p>
        <span :style="{ color: form.theme.white }">-rwxr-xr-x 1 root</span>
        <span :style="{ color: form.theme.magenta }">&nbsp;Downloads</span>
      </p>
      <p>
        <span :style="{ color: form.theme.white }">-rwxr-xr-x 1 root</span>
        <span :style="{ color: form.theme.brightMagenta }">&nbsp;Pictures</span>
      </p>
      <p>
        <span :style="{ color: form.theme.white }">-rwxr-xr-x 1 root</span>
        <span :style="{ color: form.theme.brightBlue }">&nbsp;Music</span>
      </p>
      <p>
        <span :style="{ color: form.theme.white }">-rwxr-xr-x 1 root</span>
        <span :style="{ color: form.theme.brightGreen }">&nbsp;中文字体</span>
      </p>
      <p>
        <span :style="{ color: form.theme.white }">-rwxr-xr-x 1 root</span>
        <span :style="{ color: form.theme.brightCyan }">&nbsp;sym</span>
        <span :style="{ color: form.theme.foreground }">&nbsp;-></span>
        <span :style="{ color: form.theme.brightRed }">&nbsp;link</span>
      </p>
    </div>
  </div>
</template>

<script lang='ts'>
import hexToRgba from 'hex-to-rgba';
import theme from 'xterm-theme';
import { write_data, read_data, has_data } from '../../plugins/electron-store';
import { defineComponent, reactive, toRefs, SetupContext } from 'vue'
export default defineComponent({
  name: '',
  props: {
  },
  components: {

  },
  setup(props, ctx: SetupContext) {
    // 目前有的主题的集合
    let theme_list = ['默认', 'AdventureTime', 'Afterglow', 'AlienBlood', 'Argonaut', 'Arthur', 'AtelierSulphurpool', 'Atom', 'Batman', 'Belafonte_Night', 'BirdsOfParadise', 'Blazer', 'Borland', 'Bright_Lights', 'Broadcast', 'Brogrammer', 'C64', 'Chalk', 'Chalkboard', 'Ciapre', 'Cobalt2', 'Cobalt_Neon', 'CrayonPonyFish', 'Dark_Pastel', 'Darkside', 'Desert', 'DimmedMonokai', 'DotGov', 'Dracula', 'Duotone_Dark', 'ENCOM', 'Earthsong', 'Elemental', 'Elementary', 'Espresso', 'Espresso_Libre', 'Fideloper', 'FirefoxDev', 'Firewatch', 'FishTank', 'Flat', 'Flatland', 'Floraverse', 'ForestBlue', 'FrontEndDelight', 'FunForrest', 'Galaxy', 'Github', 'Glacier', 'Grape', 'Grass', 'Gruvbox_Dark', 'Hardcore', 'Harper', 'Highway', 'Hipster_Green', 'Homebrew', 'Hurtado', 'Hybrid', 'IC_Green_PPL', 'IC_Orange_PPL', 'IR_Black', 'Jackie_Brown', 'Japanesque', 'Jellybeans', 'JetBrains_Darcula', 'Kibble', 'Later_This_Evening', 'Lavandula', 'LiquidCarbon', 'LiquidCarbonTransparent', 'LiquidCarbonTransparentInverse', 'Man_Page', 'Material', 'MaterialDark', 'Mathias', 'Medallion', 'Misterioso', 'Molokai', 'MonaLisa', 'Monokai_Soda', 'Monokai_Vivid', 'N0tch2k', 'Neopolitan', 'Neutron', 'NightLion_v1', 'NightLion_v2', 'Night_3024', 'Novel', 'Obsidian', 'Ocean', 'OceanicMaterial', 'Ollie', 'OneHalfDark', 'OneHalfLight', 'Pandora', 'Paraiso_Dark', 'Parasio_Dark', 'PaulMillr', 'PencilDark', 'PencilLight', 'Piatto_Light', 'Pnevma', 'Pro', 'Red_Alert', 'Red_Sands', 'Rippedcasts', 'Royal', 'Ryuuko', 'SeaShells', 'Seafoam_Pastel', 'Seti', 'Shaman', 'Slate', 'Smyck', 'SoftServer', 'Solarized_Darcula', 'Solarized_Dark', 'Solarized_Dark_Higher_Contrast', 'Solarized_Dark_Patched', 'Solarized_Light', 'SpaceGray', 'SpaceGray_Eighties', 'SpaceGray_Eighties_Dull', 'Spacedust', 'Spiderman', 'Spring', 'Square', 'Sundried', 'Symfonic', 'Teerb', 'Terminal_Basic', 'Thayer_Bright', 'The_Hulk', 'Tomorrow', 'Tomorrow_Night', 'Tomorrow_Night_Blue', 'Tomorrow_Night_Bright', 'Tomorrow_Night_Eighties', 'ToyChest', 'Treehouse', 'Ubuntu', 'UnderTheSea', 'Urple', 'Vaughn', 'VibrantInk', 'Violet_Dark', 'Violet_Light', 'WarmNeon', 'Wez', 'WildCherry', 'Wombat', 'Wryan', 'Zenburn', 'ayu', 'deep', 'idleToes']
    // 转化成虚拟选择器可以读取的形式
    const options = theme_list.map((item, idx) => ({
      value: item,
      label: item,
    }))
    const data = reactive({
      fontFamily: ['Consolas', 'MS Reference Sans Serif', 'Cascadia Code', 'Berlin Sans FB', 'Lucida Sans Typewriter', 'Lucida Sans', 'Malgun Gothic', 'Comic Sans MS', 'Gadugi', 'Lucida Console', 'Segoe UI Emoji', 'Copperplate Gothic Bold', 'Comic Sans MS', 'Tenorite Display', 'Verdana'],
      theme_list: options,
      cursorStyle: ['block', 'underline', 'bar'],
      fontWeight: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      form: {
        fontFamily: 'Consolas',
        fontSize: 10,
        cursorStyle: 'bar', //光标样式
        cursorBlink: true, //光标闪烁
        rendererType: 'canvas',
        fontWeight: 400,
        lineHeight: 1,
        rightClickSelectsWord: true,
        letterSpacing: 1,
        allowTransparency: true,
        transparent: 100,
        theme: {
          name: '默认',
          background: "black",
          black: "black",
          blue: "blue",
          brightBlack: "black",
          brightBlue: "blue",
          brightCyan: "cyan",
          brightGreen: "green",
          brightMagenta: "magenta",
          brightRed: "red",
          brightWhite: "white",
          brightYellow: "yellow",
          cursor: "block",
          cyan: "cyan",
          foreground: "white",
          green: "green",
          magenta: "magenta",
          red: "red",
          white: "white",
          yellow: "yellow",
        }
      },
    })
    const funcList = {
      switchTransparency(val: boolean) {
        if (val) {
          funcList.changeTransparent(data.form.transparent)
        } else {
          funcList.themeChange(data.form.theme.name)
        }
      },
      // 切换透明度
      changeTransparent(val: number) {
        if (data.form.allowTransparency) {
          let color = data.form.theme.background;
          if (color.indexOf("#") !== -1) {
            data.form.theme.background = hexToRgba(color, val / 100)
          } else {
            color = color.slice(0, color.lastIndexOf(',') + 1);
            color += (val / 100);
            color += ")";
            data.form.theme.background = color;
          }
          console.log(data.form.theme.background)
          funcList.save()
        }
      },
      // 切换主题
      themeChange(val: string) {
        let current_theme = null;
        if (val == '默认') {
          current_theme = {
            name: '默认',
            background: "rgba(0,0,0,.7)",
            black: "black",
            blue: "blue",
            brightBlack: "black",
            brightBlue: "blue",
            brightCyan: "cyan",
            brightGreen: "green",
            brightMagenta: "magenta",
            brightRed: "red",
            brightWhite: "white",
            brightYellow: "yellow",
            cursor: "block",
            cyan: "cyan",
            foreground: "white",
            green: "green",
            magenta: "magenta",
            red: "red",
            white: "white",
            yellow: "yellow",
          }
        }
        else {
          current_theme = theme[val]
        }
        current_theme.name = val
        data.form.theme = current_theme;
        // 如果要处理透明度
        if (data.form.allowTransparency) {
          let color = data.form.theme.background;
          if (color.indexOf("#") !== -1) {
            data.form.theme.background = hexToRgba(color, data.form.transparent / 100)
          } else {
            color = color.slice(0, color.lastIndexOf(',') + 1);
            color += (data.form.transparent / 100);
            color += ")";
            data.form.theme.background = color;
          }
        }
        funcList.save();
      },
      // 保存
      save() {
        write_data('setting.terminal', data.form)
      }
    }
    data.form = Object.assign(data.form, read_data('setting.terminal'))
    return {
      ...toRefs(data),
      ...funcList
    }
  },
})
</script>

<style scoped lang='scss'>
.setting_terminal {
  height: 90%;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-left: 30px;
  overflow: auto;
}

.setting_terminal_preview {
  width: 40%;
  height: fit-content;
  margin-left: 15px;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
}
</style>