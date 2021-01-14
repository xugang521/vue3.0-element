import {
  // ElAlert,
  ElAside,
  // ElAutocomplete,
  // ElAvatar,
  // ElBacktop,
  // ElBadge,
  // ElBreadcrumb,
  // ElBreadcrumbItem,
  ElButton,
  // ElButtonGroup,
  // ElCalendar,
  // ElCard,
  // ElCarousel,
  // ElCarouselItem,
  // ElCascader,
  // ElCascaderPanel,
  // ElCheckbox,
  // ElCheckboxButton,
  // ElCheckboxGroup,
  // ElCol,
  // ElCollapse,
  // ElCollapseItem,
  // ElCollapseTransition,
  // ElColorPicker,
  ElContainer,
  // ElDatePicker,
  // ElDialog,
  // ElDivider,
  // ElDrawer,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  // ElFooter,
  ElForm,
  ElFormItem,
  ElHeader,
  // ElIcon,
  // ElImage,
  ElInput,
  // ElInputNumber,
  // ElLink,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  // ElOption,
  // ElOptionGroup,
  // ElPageHeader,
  // ElPagination,
  ElPopconfirm,
  // ElPopover,
  ElPopper,
  // ElProgress,
  // ElRadio,
  // ElRadioButton,
  // ElRadioGroup,
  // ElRate,
  // ElRow,
  // ElScrollBar,
  // ElSelect,
  // ElSlider,
  // ElStep,
  // ElSteps,
  ElSubmenu,
  // ElSwitch,
  ElTabPane,
  ElTabs,
  // ElTable,
  // ElTableColumn,
  // ElTimeline,
  // ElTimelineItem,
  ElTooltip,
  // ElTransfer,
  // ElTree,
  // ElUpload,
  // ElInfiniteScroll,
  // ElLoading,
  // ElMessage,
  ElMessageBox,
  ElNotification
} from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'

export default (app) => {
  locale.use(lang)
  app.use(ElButton)
  app.use(ElNotification)
  app.use(ElContainer)
  app.use(ElAside)
  app.use(ElHeader)
  app.use(ElMain)
  app.use(ElDropdown)
  app.use(ElDropdownItem)
  app.use(ElDropdownMenu)
  app.use(ElTabPane)
  app.use(ElTabs)
  app.use(ElMenu)
  app.use(ElMenuItem)
  app.use(ElMenuItemGroup)
  app.use(ElSubmenu)
  app.use(ElTooltip)
  app.use(ElPopper)
  app.use(ElPopconfirm)
  app.use(ElMessageBox)
  app.use(ElInput)
  app.use(ElForm)
  app.use(ElFormItem)
}
