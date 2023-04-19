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
  }
);

onMounted(async () => {
  checkParams(route.params);
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
