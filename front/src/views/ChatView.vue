<template>
  <div id="container">
    <TheHeader />
    <main id="chat">
      <ConvList
        @openNewContact="changeChatArea"
        v-if="!showChatArea || isDesktop"
      />
      <ChatArea :contactChatArea="openContact" />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useWindowSize } from "@vueuse/core";
import useChatStore from "@/stores/chatStore.js";
import TheHeader from "@/components/layout/TheHeader.vue";
import ConvList from "@/components/chat/ConvList.vue";
import ChatArea from "@/components/chat/ChatArea.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const chatStore = useChatStore();
const showChatArea = ref(false);
const { width } = useWindowSize();
const isDeskop = ref(width.value > 768 ? true : false);
const openContact = ref(false);

const changeChatArea = (n) => {
  console.log(n);
  openContact.value = n;
};
watch(
  () => width.value,
  (newWidth) => {
    if (newWidth > 768) {
      isDeskop.value = true;
    } else {
      isDeskop.value = false;
    }
  }
);

watch(
  () => chatStore.otherUser,
  (newValue, oldValue) => {
    showChatArea.value = newValue !== null;
  }
);
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--backgroundMain);
}

#chat {
  display: flex;
  flex: 1;
  transition: 200ms;
  position: relative;
}

::-webkit-scrollbar {
  display: none;
}
</style>
