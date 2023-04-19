<template>
  <router-link to="/messages" class="btn"
    ><ion-icon name="chatbubble-ellipses"></ion-icon>
    <div v-if="chatStore.nonReadMessages > 0">
      {{ chatStore.nonReadMessages }}
    </div></router-link
  >
</template>

<script setup>
import useChatStore from "@/stores/chatStore.js";

const chatStore = useChatStore();
</script>

<style lang="scss" scoped>
a {
  @include headerBtn;
  text-decoration: none;
}
div {
  @include jcCt-aiCt;
  width: 17px;
  height: 17px;
  position: absolute;
  top: -2px;
  right: -3px;
  font-size: 0.8rem;
  background-color: red;
  border-radius: 99px;
}
</style>
