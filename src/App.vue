<template>
  <div>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component class="view" :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>
