<template>
  <div :class="['main-sidebar']">
    <div class="main-sidebar--navbar">
      <h1 class="main-sidebar__brand" @click="$router.push({ name: 'home' })">
        <a class="main-sidebar__brand-lg" href="javascript:;">管理后台模板</a>
        <a class="main-sidebar__brand-mini" href="javascript:;">模板</a>
      </h1>
    </div>
    <!-- 菜单 -->
    <div class="main-sidebar--menu">
      <el-menu
          :default-active="$store.state.sidebarMenuActiveName"
          :collapse="$store.state.sidebarFold"
          :unique-opened="true"
          :collapseTransition="false"
          class="aui-sidebar__menu">
        <sub-menu v-for="menu in $store.state.sidebarMenuList" :key="menu.name +menu.id" :menu="menu"/>
      </el-menu>
    </div>
  </div>
</template>
<script>
import SubMenu from './main-sidebar-sub-menu'
import { useStore } from 'vuex'
export default {
  name: 'Main-sidebar',
  components: {
    SubMenu
  },
  setup () {
    const store = useStore()
    store.state.sidebarMenuList = window.SITE_CONFIG.menuList
  }
}
</script>
