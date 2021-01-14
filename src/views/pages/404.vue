<template>
  <div class="aui-page__not-found">
    <div class="aui-content__wrapper">
      <div class="aui-content bg_img">
        <p class="desc" v-html="title"></p>
        <div class="btn-bar">
          <el-button @click="$router.go(-1)">返回</el-button>
          <el-button type="primary" @click="$router.push({ name: 'home' })">返回首页</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '抱歉！您访问的页面<em>失联</em>啦...'
    }
  }
}
</script>
<style lang="scss" scoped>
  .bg_img{
    background: url("../../assets/img/404.png") no-repeat center;
    background-size: auto;
    .desc{
      margin-top: 450px;
    }
  }
</style>
