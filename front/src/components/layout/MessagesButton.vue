<template>
  <router-link to="/messages" class="btn"
    ><ion-icon name="chatbubble-ellipses"></ion-icon>
    <NumberBadge :unread="chatStore.nonReadMessages.length" />
  </router-link>
</template>

<script setup>
import useChatStore from "@/stores/chatStore.js";
import NumberBadge from "@/components/layout/NumberBadge.vue";
const chatStore = useChatStore();
</script>

<style lang="scss" scoped>
.btn {
  @include headerBtn;
  text-decoration: none;
}
</style>
