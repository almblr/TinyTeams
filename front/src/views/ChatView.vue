<template>
  <div id="chatView-container">
    <TheHeader />
    <main v-if="!isLoading">
      <ConvList v-if="chatStore.isDesktop || !chatStore.isConversationMode" />
      <div
        class="messagerie"
        v-if="chatStore.isDesktop || chatStore.isConversationMode"
      >
        <AutoSuggest
          v-if="
            'conversationId' in route.params === false && chatStore.isDesktop
          "
        />
        <ChatArea v-if="chatStore.isConversationMode" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";
import router from "@/router/index.js";
import useChatStore from "@/stores/chatStore.js";
import TheHeader from "@/components/layout/TheHeader.vue";
import ConvList from "@/components/chat/ConvList.vue";
import AutoSuggest from "@/components/layout/AutoSuggest.vue";
import ChatArea from "@/components/chat/ChatArea.vue";

const isLoading = ref(true);
const route = useRoute();
const chatStore = useChatStore();
const { width } = useWindowSize();

watch(
  () => width.value,
  (newWidth) => {
    chatStore.isDesktop = newWidth > 768 ? true : false;
    chatStore.showMobileUsersList = newWidth > 768 ? false : null;
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
    isLoading.value = false;
  }
);

const checkParams = (newValue) => {
  chatStore.isConversationMode =
    "conversationId" in newValue || "userId" in newValue;
  if ("conversationId" in newValue) {
    const convId = parseInt(newValue.conversationId);
    const conversation = chatStore.conversations.find(
      (conv) => conv.id === convId
    );
    if (conversation) {
      conversation.lastMessage
        ? (conversation.lastMessage.isRead = true)
        : null;
    } else {
      router.push(`/notfound/conversation/${route.params.conversationId}`);
    }
    for (const message of chatStore.messages) {
      message.isRead === false ? (message.isRead = true) : null;
    }
  }
  width.value > 768
    ? (chatStore.isDesktop = true)
    : (chatStore.isDesktop = false);
  isLoading.value = false;
};

watch(() => route.params, checkParams);

onMounted(async () => {
  await chatStore.getUserConversations();
  checkParams(route.params);
});

onUnmounted(() => {
  chatStore.isConversationMode = false;
  chatStore.newMessage = false;
  chatStore.showMobileUsersList = false;
});
</script>

<style lang="scss" scoped>
#chatView-container {
  @include width-height_max;
  display: flex;
  flex-direction: column;
  background-color: var(--backgroundMain);
  main {
    @include width-height_max;
    display: flex;
    overflow-y: hidden;
    & > .messagerie {
      @include width-height_max;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
