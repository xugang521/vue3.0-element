<template>
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="menu.id.toString()" :popper-append-to-body="false">
    <template #title>
      <svg class="icon-svg aui-sidebar__menu-icon" aria-hidden="true"><use :xlink:href="`#${menu.icon}`"></use></svg>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu v-for="item in menu.children" :key="item.name + item.id" :menu="item"></sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.id.toString()" @click="gotoRouteHandle(menu.id)">
    <svg class="icon-svg aui-sidebar__menu-icon" aria-hidden="true"><use :xlink:href="`#${menu.icon}`"></use></svg>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
import { useRouter } from 'vue-router'
export default {
  name: 'sub-menu',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  components: {
    SubMenu
  },
  setup () {
    const router = useRouter()

    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    const gotoRouteHandle = (menuId) => {
      const route = window.SITE_CONFIG.dynamicMenuRoutes.filter(item => item.meta.menuId === menuId)[0]
      if (route) {
        router.push({ name: route.name })
      }
    }

    return {
      gotoRouteHandle
    }
  }
}
</script>
