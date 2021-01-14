import { moduleRoutes } from '@/router'
export default {
  data () {
    /* eslint-disable */
    return {
      // 设置属性
      mixinViewModuleOptions: {
        activatedIsNeed: true,    // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '',       // 数据列表接口，API地址
        getDataListIsPage: false, // 数据列表接口，是否需要分页？
        deleteURL: '',            // 删除接口，API地址
        deleteIsBatch: false,     // 删除接口，是否需要批量？
        statusURL: '',            // 上架、下架接口，API地址
        statusIsBatch: false,     // 上架、下架接口，是否需要批量？
        statusBatchKey: 'code',   // 上架、下架字段名称
        changeBatchKey: 'id',     // 选中接口，批量状态下由那个key进行标记操作？比如：pid，uid...
        getSkuListURL: '',       // 产品管理列表sku接口，API地址
      },
      // 默认属性
      tableHeight: window.innerHeight - 290 || document.documentElement.clientHeight - 290|| document.body.clientHeight - 290,
      dataForm: {},               // 查询条件
      dataList: [],               // 数据列表
      skuList: [],                //列表中的sku数据
      sortOrder: '',                  // 排序，asc／desc
      sortField: '',             // 排序，字段
      currentPage: 1,                 // 当前页码
      pageSize: 10,                  // 每页数
      totalCount: 0,                   // 总条数
      dataListLoading: false,     // 数据列表，loading状态
      dataListSelections: [],     // 数据列表，多选项
      addOrUpdateVisible: false,   // 新增／更新，弹窗visible状态
      exportPageVisible: false    // 导出，弹窗visible状态
    }
    /* eslint-enable */
  },
  activated () {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getDataList()
    }
  },
  created () {
    const that = this
    window.onresize = () => {
      return (() => {
        window.tableHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        that.tableHeight = window.tableHeight - 290
      })()
    }
  },
  watch: {
    // 这里的定时器是为了优化，如果频繁调用window.onresize方法会造成页面卡顿，增加定时器会避免频繁调用window.onresize方法
    // timer默认值设置为false，这里相当于一个按钮，防止频繁改变时引起卡顿
    tableHeight (val) {
      if (!this.timer) {
        this.tableHeight = val
        this.timer = true
        const that = this
        setTimeout(function () {
          that.timer = false
        }, 400)
      }
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http.post(
        this.mixinViewModuleOptions.getDataListURL,
        {
          sortOrder: this.sortOrder,
          sortField: this.sortField,
          currentPage: this.mixinViewModuleOptions.getDataListIsPage ? this.currentPage : null,
          pageSize: this.mixinViewModuleOptions.getDataListIsPage ? this.pageSize : null,
          ...this.dataForm
        }
      ).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.status.code !== 10000) {
          this.dataList = []
          this.totalCount = 0
          return this.$message.error(res.msg)
        }
        this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.body.data : res.body
        this.totalCount = this.mixinViewModuleOptions.getDataListIsPage ? res.body.totalCount >= 10000 ? 10000 : res.body.totalCount : 0
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle (data) {
      if (!data.order || !data.prop) {
        this.sortOrder = ''
        this.sortField = ''
        return false
      }
      this.sortOrder = data.order.replace(/ending$/, '')
      this.sortField = data.prop
      // this.sortField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.getDataList()
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.currentPage = 1
      this.pageSize = val
      this.getDataList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.currentPage = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.init()
      })
    },
    // 导出弹窗
    exportPageHandle () {
      this.exportPageVisible = true
      this.$nextTick(() => {
        this.$refs.exportPage.init()
      })
    },
    // 删除
    deleteHandle (id) {
      if (this.mixinViewModuleOptions.deleteIsBatch && !id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: '请选择删除项',
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm('你确定删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(
          `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id}`,
          this.mixinViewModuleOptions.deleteIsBatch ? {
            data: id ? [id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.changeBatchKey])
          } : {}
        ).then(({ data: res }) => {
          if (res.status.code !== 10000) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    /**
     * 上下架
     * @param status  0下架  1上架
     * @param id
     * @returns {ElMessageComponent}
     */
    statusHandle (status, id) {
      if (!id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: '请选择批量操作项',
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(`你确定${status === 0 ? '下架' : '上架'}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(
          `${this.mixinViewModuleOptions.statusURL}`,
          {
            [this.mixinViewModuleOptions.statusBatchKey]: id ? [id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.changeBatchKey]),
            status: status
          }
        ).then(({ data: res }) => {
          if (res.status.code !== 10000) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: `${status === 0 ? '下架' : '上架'}成功`,
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 获取sku列表
    getSkuList (id) {
      this.$http.get(this.mixinViewModuleOptions.getSkuListURL + '/' + id).then(({ data: res }) => {
        if (res.status.code !== 10000) {
          return this.$message.error(res.msg)
        }
        this.skuList = res.body
      }).catch(() => {})
    },
    /**
     * 动态新增路由
     * @param path 新增路由
     * @param name 名称
     * @param data 携带参数
     * @returns {Promise<Route>}
     */
    openNewPage (path, name, data = {}) {
      const routeName = `enquiry_/${path}`
      let route = window.SITE_CONFIG.dynamicRoutes.filter(item => item.name === routeName)[0]
      if (route) {
        return this.$router.push({ name: routeName, query: data })
      }
      const title = document.title
      route = {
        path: routeName,
        component: resolve => require([`@/views/modules/${path}`], resolve),
        name: routeName,
        meta: {
          ...window.SITE_CONFIG.contentTabDefault,
          menuId: (Math.random() * 16),
          title: `${title}-${name}`,
          isTab: true
        }
      }
      this.$router.addRoutes([
        {
          ...moduleRoutes,
          name: `main-dynamic__${Math.random() * 16}`,
          children: [route]
        }
      ])
      window.SITE_CONFIG.dynamicRoutes.push(route)
      this.$router.push({ name: routeName, query: data })
    },
    // 时间格式化
    dateFormatter (row, column) {
      const date = new Date(row[column.property])
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
    // 日期范围 一年
    disabledDate (time, currentDate) {
      const startyear = currentDate.getFullYear() - 1
      const endYear = currentDate.getFullYear() + 1
      const endDate = endYear + '-' + (currentDate.getMonth() + 1) + '-' +
            currentDate.getDate()
      const startDate = startyear + '-' + (currentDate.getMonth() + 1) + '-' +
              currentDate.getDate()
      const _endDate = new Date(endDate)
      const _startDate = new Date(startDate)
      return time.getTime() > _endDate.getTime() || time.getTime() < _startDate.getTime()
    }
  }
}
