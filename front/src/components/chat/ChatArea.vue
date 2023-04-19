<template>
  <div id="chatarea-container">
    <main>
      <NewConvPreview v-if="route.name === 'newMessage'" />
      <MessagesSection v-else />
    </main>
    <MessageInput v-if="canSendMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import useChatStore from "@/stores/chatStore";
import MessageInput from "@/components/chat/MessageInput.vue";
import NewConvPreview from "@/components/chat/NewConvPreview.vue";
import MessagesSection from "@/components/chat/MessagesSection.vue";

const route = useRoute();
const chatStore = useChatStore();
const canSendMessage = ref(false);

const checkParams = (object) => {
  if ("userId" in object || "conversationId" in object) {
    canSendMessage.value = true;
  } else {
    canSendMessage.value = false;
  }
};
watch(
  () => route.params,
  async (newValue) => {
    checkParams(newValue);
    console.log(newValue);
    if ("conversationId" in route.params) {
      console.log("test");
      for (const message of chatStore.messages) {
        console.log(message.isRead);
        if (
          message.isRead === false &&
          message.conversationId === parseInt(newValue.conversationId)
        ) {
          console.log("test2");
          await chatStore.markAsRead(message.conversationId, message.id);
        }
      }
    }
  }
);

onMounted(async () => {
  checkParams(route.params);
  console.log(route.params);
  if ("conversationId" in route.params) {
    for (const message of chatStore.messages) {
      if (
        message.isRead === false &&
        message.conversationId === parseInt(route.params.conversationId)
      ) {
        console.log("coucou");
        await chatStore.markAsRead(message.conversationId, message.id);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
#chatarea-container {
  @include fdCol-jcCt-aiCt;
  width: 100%;
  height: 100%;
  max-height: 100%;
  background-color: var(--backgroundMain);
}

main {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  max-height: 100%;
}
</style>
