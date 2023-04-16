<template>
  <div id="chatView-container">
    <TheHeader />
    <main>
      <ConvList />
      <ChatArea v-if="width > 768 || route.name === 'newMessage'" />
    </main>
  </div>
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import TheHeader from "@/components/layout/TheHeader.vue";
import ConvList from "@/components/chat/ConvList.vue";
import ChatArea from "@/components/chat/ChatArea.vue";
import { useRoute } from "vue-router";

const { width } = useWindowSize();
const route = useRoute();
</script>

<style lang="scss" scoped>
#chatView-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--backgroundMain);
  main {
    display: flex;
    height: 100%;
    transition: 200ms;
    position: relative;
  }
}
</style>
