<template>
  <div class="main-content">
    <!-- tab展示内容 -->
    <template v-if="$route.meta.isTab">
      <el-dropdown class="main-content--tabs-tools">
        <i class="el-icon-arrow-down el-icon--right"></i>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="refresh()">刷新当前标签页</el-dropdown-item>
            <el-dropdown-item @click="tabRemoveHandle($store.state.contentTabsActiveName)">关闭当前标签页</el-dropdown-item>
            <el-dropdown-item @click="tabsCloseOtherHandle()">关闭其它标签页</el-dropdown-item>
            <el-dropdown-item @click="tabsCloseAllHandle()">关闭全部标签页</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-tabs v-model="$store.state.contentTabsActiveName"
               @tab-click="tabSelectedHandle"
               @tab-remove="tabRemoveHandle">
        <el-tab-pane
            v-for="item in $store.state.contentTabs"
            :key="item.name"
            :name="item.name"
            :label="item.title"
            :closable="item.name !== 'home'"
            :class="{ 'is-iframe': tabIsIframe(item.iframeURL) }">
          <template v-if="item.name === 'home'" #label>
            <svg class="icon-svg tabs-icon-nav" aria-hidden="true"><use xlink:href="#icon-home"></use></svg>
          </template>
          <iframe v-if="tabIsIframe(item.iframeURL)" :src="item.iframeURL" width="100%" height="100%" frameborder="0" scrolling="yes"></iframe>
          <router-view v-if="item.name === $store.state.contentTabsActiveName" v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-tab-pane>
      </el-tabs>
    </template>
    <!-- 其他方式, 展示内容 -->
    <template v-else>
      <transition name="el-zoom-in-center">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </transition>
    </template>
  </div>
</template>
<script>
import { isURL } from '@/utils/validate'
import { nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'Main-content',
  setup () {
    const store = useStore()
    const router = useRouter()
    // 刷新当前页面
    const refresh = () => {
      store.state.contentIsNeedRefresh = true
      nextTick(() => {
        store.state.contentIsNeedRefresh = false
      })
    }
    // tabs, 是否通过iframe展示
    const tabIsIframe = (url) => {
      return isURL(url)
    }
    // tabs, 选中tab
    const tabSelectedHandle = (tab) => {
      tab = store.state.contentTabs.filter(item => item.name === tab.props.name)[0]
      if (tab) {
        router.push({
          name: tab.name,
          params: { ...tab.params },
          query: { ...tab.query }
        })
      }
    }
    // tabs, 删除tab
    const tabRemoveHandle = (tabName) => {
      if (tabName === 'home') {
        return false
      }
      store.state.contentTabs = store.state.contentTabs.filter(item => item.name !== tabName)
      if (store.state.contentTabs.length <= 0) {
        store.state.sidebarMenuActiveName = store.state.contentTabsActiveName = 'home'
        return false
      }
      // 当前选中tab被删除
      if (tabName === store.state.contentTabsActiveName) {
        router.push({ name: store.state.contentTabs[store.state.contentTabs.length - 1].name })
      }
    }
    // tabs, 关闭其它
    const tabsCloseOtherHandle = () => {
      store.state.contentTabs = store.state.contentTabs.filter(item => {
        return item.name === 'home' || item.name === store.state.contentTabsActiveName
      })
    }
    // tabs, 关闭全部
    const tabsCloseAllHandle = () => {
      store.state.contentTabs = store.state.contentTabs.filter(item => item.name === 'home')
      router.push({ name: 'home' })
    }

    return {
      refresh,
      tabIsIframe,
      tabSelectedHandle,
      tabRemoveHandle,
      tabsCloseOtherHandle,
      tabsCloseAllHandle
    }
  }
}
</script>
