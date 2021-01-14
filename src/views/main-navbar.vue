<template>
  <div class="main-navbar">
    <div :class="['left-btn' , { 'main-navbar--fold': $store.state.sidebarFold }]"
         @click="$store.state.sidebarFold = !$store.state.sidebarFold">
      <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-open-menu"></use></svg>
    </div>
    <div class="right-btn">
      <el-dropdown>
        <span class="el-dropdown-link">
          <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-userImg"></use></svg>
          admin<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item divided @click="logoutHandle">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
export default {
  name: 'Main-navbar',
  setup () {
    const router = useRouter()
    const { ctx } = getCurrentInstance()

    // 退出
    const logoutHandle = () => {
      ctx.$confirm('退出登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除登录信息
        router.push({ name: 'login' })
      }).catch(() => {
      })
    }
    return {
      logoutHandle
    }
  }
}
</script>
