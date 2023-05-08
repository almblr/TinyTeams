<template>
  <router-link to="/messages" @click="test" class="btn"
    ><ion-icon name="chatbubble-ellipses"></ion-icon>
    <NumberBadge :unread="chatStore.nonReadMessages" />
  </router-link>
</template>

<script setup>
import useChatStore from "@/stores/chatStore.js";
import NumberBadge from "@/components/layout/NumberBadge.vue";
const chatStore = useChatStore();

const test = () => {
  chatStore.isConversationMode = false;
};
</script>

<style lang="scss" scoped>
.btn {
  @include headerBtn;
  text-decoration: none;
}
</style>
