<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="login-body">
          <h2 class="login-brand">管理后台模板</h2>
          <h3 class="login-title">登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter="dataFormSubmitHandle()" status-icon>
            <el-form-item prop="loginname">
              <el-input v-model="dataForm.loginname" placeholder="账户">
                <template #prefix class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-user"></use></svg>
                </template >
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码">
                <template #prefix class="el-input__icon">
                  <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-password"></use></svg>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dataFormSubmitHandle()" class="w-percent-100">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="login-footer">
          <p><a href="JavaScript:;" target="_blank">模板平台</a>2020 © Gy.io</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  data () {
    return {
      captchaPath: '',
      dataForm: {
        loginname: '',
        password: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        loginname: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ]
      }
    }
  },
  setup () {
    const router = useRouter()
    // 表单提交
    const dataFormSubmitHandle = () => {
      router.replace({ name: 'home' })
    }

    return {
      dataFormSubmitHandle
    }
  }
}
</script>
