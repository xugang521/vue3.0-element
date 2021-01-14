<template>
  <div :class="['main' , { 'main--fold': $store.state.sidebarFold }]">
    <main-sidebar v-if="$store.state.layoutType === 'default'" />
    <main-navbar />
    <main-content v-if="!$store.state.contentIsNeedRefresh"/>
  </div>
</template>
<script>
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainContent from './main-content'
import debounce from 'lodash/debounce'
import { onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import { getCurrentInstance } from 'vue'
export default {
  name: 'Main',
  components: {
    MainNavbar,
    MainSidebar,
    MainContent
  },
  setup () {
    const store = useStore()
    const { ctx } = getCurrentInstance()

    // 监听路由变化
    const changRouter = (route) => {
      if (!route.meta.isTab) {
        return false
      }
      let tab = store.state.contentTabs.filter(item => item.name === route.name)[0]
      if (!tab) {
        tab = {
          ...window.SITE_CONFIG.contentTabDefault,
          ...route.meta,
          name: route.name,
          params: { ...route.params },
          query: { ...route.query }
        }
        store.state.contentTabs = store.state.contentTabs.concat(tab)
      }
      store.state.sidebarMenuActiveName = tab.menuId.toString()
      store.state.contentTabsActiveName = tab.name
    }

    // 窗口改变大小
    const windowResizeHandle = () => {
      store.state.sidebarFold = document.documentElement.clientWidth <= 992 || false
      window.addEventListener('resize', debounce(() => {
        store.state.sidebarFold = document.documentElement.clientWidth <= 992 || false
      }, 150))
    }

    // 执行
    windowResizeHandle()
    changRouter(ctx.$router.currentRoute.value)
    onBeforeRouteUpdate(changRouter)
  }
}
</script>
