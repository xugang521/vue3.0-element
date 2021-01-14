/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false,
  // outputDir: 'vueDemo',
  devServer: {
    open: true,
    port: 9001,
    proxy: {
      '/proxyApi': {
        target: 'http://113.108.203.69',
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/proxyApi': '' }
      }
    },
    overlay: {
      errors: true,
      warnings: true
    }
  },
  chainWebpack: (config) => {
    // 配置 svg-sprite-loader
    // 第一步：让其他svg loader不要对src/icons进行操作
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons/svg'))// 注意：路径要具体到存放的svg的路径下，不然会报错
      .end()
    // 第二步：使用svg-sprite-loader 对 src/icons下的svg进行操作
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons/svg'))// 注意：路径要具体到存放的svg的路径下，不然会报错
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      // 定义规则 使用时 <svg class="icon"> <use xlink:href="#icon-svg文件名"></use>  </svg>
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
