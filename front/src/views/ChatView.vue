<template>
  <div id="chatView-container">
    <TheHeader />
    <main>
      <ConvList
        v-if="
          width > 768 ||
          (!chatStore.showMobileUsersList && !chatStore.onversationMode)
        "
      />
      <div>
        <AutoSuggest
          v-if="chatStore.newMessage && !chatStore.onversationMode"
        />
        <ChatArea
          v-if="
            !chatStore.showMobileUsersList &&
            !chatStore.newMessage &&
            chatStore.onversationMode
          "
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { watch, onMounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import useChatStore from "@/stores/chatStore.js";
import TheHeader from "@/components/layout/TheHeader.vue";
import ConvList from "@/components/chat/ConvList.vue";
import AutoSuggest from "@/components/layout/AutoSuggest.vue";
import ChatArea from "@/components/chat/ChatArea.vue";
import { useRoute } from "vue-router";

const chatStore = useChatStore();
const { width } = useWindowSize();
const route = useRoute();

watch(
  () => route.params,
  (newValue) => {
    if ("userId" in newValue || "conversationId" in newValue) {
      chatStore.onversationMode = true;
    } else {
      chatStore.onversationMode = false;
    }
  }
);

onMounted(async () => {
  await chatStore.getUserConvs();
  "conversationId" in route.params
    ? (chatStore.onversationMode = true)
    : (chatStore.onversationMode = false);
});
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
    & > div {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
