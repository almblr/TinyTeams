<template>
  <div id="container">
    <TheHeader />
    <main id="settings"></main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TheHeader from "@//components/layout/TheHeader.vue";
</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  overflow-y: scroll;
  position: relative;
  background-color: var(--backgroundMain);
}
</style>
