<template>
  <div class="full_page">
    <!-- <span class="local_connections_title">本地连接</span> -->
    <el-button-group class="ml-4" style="float: right;">
      <el-button :icon="Refresh" title="刷新" @click="initData" :loading="loading"></el-button>
      <el-button :icon="Plus" title="添加新的连接" @click="add"></el-button>
    </el-button-group>
    <el-table :data="tableData" border :max-height="height" size="small" :loading="loading">
      <!-- 展开列表 -->
      <el-table-column type="expand">
        <template #default="props">
          <el-descriptions size="small" :column="3" class="margin-top" border>
            <el-descriptions-item label="端口">{{ props.row.port }}</el-descriptions-item>
            <el-descriptions-item label="密码">
              <el-button :icon="Key" @click="copy_password(props.row.password)">复制密码</el-button>
            </el-descriptions-item>
            <el-descriptions-item label="编码">{{ props.row.unicode }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="连接名" sortable min-width="200"></el-table-column>
      <el-table-column prop="level" label="等级" sortable width="80"></el-table-column>
      <el-table-column prop="host" label="主机" sortable width="120"></el-table-column>
      <el-table-column prop="username" label="用户名" sortable></el-table-column>
      <!-- 搜索/操作 列 -->
      <el-table-column align="center" width="200">
        <template #header>
          <!-- <el-input v-model="search" size="small" placeholder="快速查找"></el-input> -->
          操作
        </template>
        <template #default="scope">
          <el-button
            color="#67c23a"
            style="color: white"
            :icon="Connection"
            circle
            title="连接"
            @click="connect(scope.row)"
          ></el-button>
          <el-button
            color="#409eff"
            style="color: white"
            :icon="Edit"
            circle
            title="编辑"
            @click="edit(scope.row)"
          ></el-button>
          <!-- 确认删除 -->
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            :icon="InfoFilled"
            icon-color="red"
            title="确定要删除这个本地连接吗?"
            @confirm="delete_connection(scope.row.key)"
          >
            <template #reference>
              <el-button color="#f56c6c" style="color: white" :icon="Delete" circle title="删除"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑框 -->
    <el-dialog v-model="dialogVisible" :title="editForm.name" width="50%" center destroy-on-close>
      <!-- 带验证的编辑表单 -->
      <el-form
        ref="ruleFormRef"
        :model="editForm"
        label-width="80px"
        label-position="left"
        size="small"
        :rules="rules"
      >
        <el-form-item label="连接名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="主机" prop="host">
          <el-input v-model="editForm.host"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number v-model="editForm.port" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="重要等级" prop="level">
          <el-select v-model="editForm.level" placeholder="选择编码方式">
            <el-option label="普通" value="low"></el-option>
            <el-option label="中等" value="middle"></el-option>
            <el-option label="重要" value="high"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="编码方式" prop="unicode">
          <el-select v-model="editForm.unicode" placeholder="选择编码方式">
            <el-option label="utf-8" value="utf-8"></el-option>
            <el-option label="gbk" value="gbk"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button color="#409eff" style="color: white" @click="submitForm(ruleFormRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { read_data, write_data } from '../../plugins/electron-store';
import { Delete, Edit, Connection, Key, InfoFilled, Plus, Refresh } from '@element-plus/icons-vue'
import { watch, ref, defineComponent, reactive, toRefs, SetupContext, computed } from 'vue'
import { clipboard } from "electron";
import { ElMessage, ElForm } from 'element-plus'

export default defineComponent({
  name: '',
  props: {
  },
  components: {

  },
  setup(props, ctx: SetupContext) {
    type FormInstance = InstanceType<typeof ElForm>
    const ruleFormRef = ref<FormInstance>()
    let height = document.body.clientHeight - 100;
    const data = reactive({
      Plus, Refresh, Delete, Edit, Connection, Key, InfoFilled, height,
      tableData: [],
      search: '',
      dialogVisible: false,
      loading: false,
      editForm: { name: '新增连接', host: null, level: 'low', port: 22, username: null, password: null, unicode: 'utf-8' },
      rules: {
        name: [{
          required: true,
          message: '名字为必填项',
          trigger: 'blur',
        }],
        host: [{
          required: true,
          message: '主机为必填项',
          trigger: 'blur',
        }],
        port: [{
          required: true,
          message: '端口为必填项',
          trigger: 'blur',
        }],
        username: [{
          required: true,
          message: '用户名为必填项',
          trigger: 'blur',
        }],
        password: [{
          required: true,
          message: '密码为必填项',
          trigger: 'blur',
        }]
      }
    })
    let status = 'add';//add or edit
    let key: any = null;
    const funcList = {
      // 复制密码
      copy_password(pwd: string) {
        clipboard.writeText(pwd);
        ElMessage({
          message: '复制成功',
          type: 'success',
        })
      },
      // 创造连接
      connect(data: any) {
        let timestamp = Date.parse(new Date().toString());
        let tab = {
          title: data.host,
          name: `${data.host}_${timestamp}`,
          closable: true,
          icon: 'ssh',
          type: 'xterm',
          data: data
        }
        ctx.emit("change", 'add', tab)
      },
      // 初始化数据
      initData() {
        data.loading = true;
        data.tableData = read_data("local_connections")
        data.loading = false;
      },
      // 编辑连接
      edit(row: any) {
        key = row.key;
        status = 'edit'
        data.dialogVisible = true;
        data.editForm = Object.assign({}, row)
      },
      // 新增连接
      add() {
        status = 'add'
        data.dialogVisible = true;
        data.editForm = Object.assign({}, { name: '新增连接', host: null, level: 'low', port: 22, username: null, password: null, unicode: 'utf-8' })
      },
      // 提交表单
      submitForm(formEl: FormInstance | undefined) {
        if (!formEl) return
        formEl.validate((valid) => {
          if (valid) {
            if (status == 'add') {
              let timestamp = Date.parse(new Date().toString());
              data.tableData.push(Object.assign(data.editForm, {
                key: timestamp
              }) as never);
              write_data('local_connections', data.tableData);
            } else {
              let index = data.tableData.findIndex((v: any) => {
                return v.key == key
              });
              data.tableData[index] = Object.assign({}, data.editForm) as never
              write_data('local_connections', data.tableData);
            }
            data.dialogVisible = false;
            ElMessage({
              message: '保存成功',
              type: 'success',
            })
          } else {
            return false
          }
        })
      },
      // 删除连接
      delete_connection(key: any) {
        data.tableData = data.tableData.filter((e: any) => {
          return e.key !== key
        });
        write_data('local_connections', data.tableData);
      }
    }
    funcList.initData()//初始化数据
    return {
      ...toRefs(data),
      ...funcList,
      ruleFormRef
    }
  },
})
</script>

<style scoped lang='scss'>
.local_connections_title {
  font-weight: 800;
  font-size: 20px;
  margin: 10px;
  color: rgb(0, 130, 236);
}
</style>