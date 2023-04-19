<template>
  <div id="chatView-container">
    <TheHeader />
    <main>
      <ConvList v-if="chatStore.isDesktop || !chatStore.conversationMode" />
      <div
        class="messagerie"
        v-if="chatStore.isDesktop || chatStore.conversationMode"
      >
        <AutoSuggest
          v-if="
            'conversationId' in route.params === false && chatStore.isDesktop
          "
        />
        <ChatArea v-if="chatStore.conversationMode" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { watch, onMounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";
import useChatStore from "@/stores/chatStore.js";
import TheHeader from "@/components/layout/TheHeader.vue";
import ConvList from "@/components/chat/ConvList.vue";
import AutoSuggest from "@/components/layout/AutoSuggest.vue";
import ChatArea from "@/components/chat/ChatArea.vue";

const route = useRoute();
const chatStore = useChatStore();
const { width } = useWindowSize();

watch(
  () => width.value,
  (newWidth) => {
    chatStore.isDesktop = newWidth > 768 ? true : false;
    newWidth > 768 ? (chatStore.showMobileUsersList = false) : null;
  }
);

watch(
  () => route.name,
  (newName) => {
    // Page d'accueil des messages
    if (newName === "Messages" && chatStore.isDesktop) {
      chatStore.showMobileUsersList = false;
    }
    // Page de création de message
    if (newName === "newMessage") {
      chatStore.newMessage = true;
    }
  }
);

watch(
  () => route.params,
  (newValue) => {
    chatStore.conversationMode =
      "userId" in newValue || "conversationId" in newValue;
    chatStore.showMobileUsersList = false;
    if ("conversationId" in newValue) {
      for (const message of chatStore.messages) {
        message.isRead === false ? (message.isRead = true) : null;
      }
    }
  }
);

onMounted(async () => {
  await chatStore.getUserConvs();
  chatStore.conversationMode =
    "conversationId" in route.params || "userId" in route.params;
  width.value > 768
    ? (chatStore.isDesktop = true)
    : (chatStore.isDesktop = false);
  await chatStore.getNonReadMsg();
});
</script>

<style lang="scss" scoped>
#chatView-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--backgroundMain);
  main {
    display: flex;
    height: 100%;
    height: 100%;
    width: 100%;
    overflow-y: hidden;
    & > .messagerie {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
