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
import MessageInput from "@/components/chat/MessageInput.vue";
import NewConvPreview from "@/components/chat/NewConvPreview.vue";
import MessagesSection from "@/components/chat/MessagesSection.vue";
const route = useRoute();
const canSendMessage = ref(false);

watch(
  () => route.params,
  async (newValue) => {
    if ("userId" in newValue || "conversationId" in newValue) {
      canSendMessage.value = true;
    } else {
      canSendMessage.value = false;
    }
  }
);

onMounted(async () => {
  if ("userId" in route.params || "conversationId" in route.params) {
    canSendMessage.value = true;
  } else {
    canSendMessage.value = false;
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
