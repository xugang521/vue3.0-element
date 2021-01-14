import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { isURL } from '@/utils/validate'

// 页面路由(独立页面)
export const pageRoutes = [
  {
    path: '/404',
    component: () => import('@/views/pages/404'),
    name: '404',
    meta: { title: '404未找到' },
    beforeEnter (to, from, next) {
      // 拦截处理特殊业务场景
      // 如果, 重定向路由包含__双下划线, 为临时添加路由
      if (/__.*/.test(to.redirectedFrom)) {
        return next(to.redirectedFrom.replace(/__.*/, ''))
      }
      next()
    }
  },
  { path: '/login', component: () => import('@/views/pages/login'), name: 'login', meta: { title: '登录' } }
]

// 模块路由(基于主入口布局页面)
export const moduleRoutes = {
  path: '/',
  component: () => import('@/views/main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口布局' },
  children: [
    { path: '/home', component: () => import('@/views/modules/home'), name: 'home', meta: { title: '首页', isTab: true } }
  ]
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior: () => ({ y: 0 }),
  routes: pageRoutes.concat(moduleRoutes)
})

router.beforeEach((to, from, next) => {
  // 修改标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 已添加或者当前路由为页面路由, 可直接访问
  if (window.SITE_CONFIG.dynamicMenuRoutesHasAdded || fnCurrentRouteIsPageRoute(to, pageRoutes)) {
    return next()
  }

  // 使用本地菜单
  window.SITE_CONFIG.activeIndex = store.state.menu.menuList[0].id.toString()
  window.SITE_CONFIG.topmenuList = store.state.menu.menuList
  window.SITE_CONFIG.menuList = store.state.menu.menuList
  fnAddDynamicMenuRoutes(window.SITE_CONFIG.menuList)

  next({ ...to, replace: true })
})

/**
 * 判断当前路由是否为页面路由
 * @param {*} route 当前路由
 * @param {*} pageRoutes 页面路由
 */
function fnCurrentRouteIsPageRoute (route, pageRoutes = []) {
  let temp = []
  for (let i = 0; i < pageRoutes.length; i++) {
    if (route.path === pageRoutes[i].path) {
      return true
    }
    if (pageRoutes[i].children && pageRoutes[i].children.length >= 1) {
      temp = temp.concat(pageRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteIsPageRoute(route, temp) : false
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  let temp = []
  for (let i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
      continue
    }

    // 组装路由
    const route = {
      path: '',
      component: null,
      name: '',
      meta: {
        ...window.SITE_CONFIG.contentTabDefault,
        menuId: menuList[i].id,
        title: menuList[i].name,
        permissions: menuList[i].permissions,
        isTab: true
      }
    }
    // eslint-disable-next-line
    let URL = (menuList[i].url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      route.path = route.name = `i-${menuList[i].id}`
      route.meta.iframeURL = URL
    } else {
      URL = URL.replace(/^\//, '').replace(/_/g, '-')
      const path = URL.replace(/\//g, '-')
      route.path = '/' + path
      route.name = path
      route.component = () => import('@/views/modules/' + URL)
    }
    routes.push(route)
  }
  if (temp.length >= 1) {
    return fnAddDynamicMenuRoutes(temp, routes)
  }
  // 添加路由
  routes.forEach(item => {
    router.addRoute('main', item)
  })
  window.SITE_CONFIG.dynamicMenuRoutes = routes
  window.SITE_CONFIG.dynamicMenuRoutesHasAdded = true
}

export default router
