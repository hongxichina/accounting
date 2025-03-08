<script setup lang="ts">
// 不需要导入HelloWorld组件
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
@import './assets/main.css';

.app-container {
  max-width: 540px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  min-height: 100vh;
}

/* 移动端适配 */
@media (max-width: 540px) {
  .app-container {
    width: 100%;
    box-shadow: none;
  }
}
</style>
