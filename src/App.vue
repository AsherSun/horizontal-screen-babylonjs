<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import MainScene from './scene/MainScene';
const myApp = new MainScene();
onMounted(() => {
  myApp.render();
  window.addEventListener('resize', () => {
    myApp.engine.resize();
  })
});
onUnmounted(myApp.removeCanvas);
</script>

<template>
  <div class="wrapper"></div>
</template>
