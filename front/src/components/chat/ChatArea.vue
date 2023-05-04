<template>
  <div id="chatarea-container">
    <main>
      <NewConvPreview v-if="route.name === 'newMessage'" />
      <MessagesSection v-if="route.params" />
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

const checkParams = (object) => {
  if ("userId" in object || "conversationId" in object) {
    canSendMessage.value = true;
  } else {
    canSendMessage.value = false;
  }
};

watch(() => route.params, checkParams);
onMounted(() => checkParams(route.params));
</script>

<style lang="scss" scoped>
#chatarea-container {
  @include fdCol-jcCt-aiCt;
  @include width-height_max;
  max-height: 100%;
  background-color: var(--backgroundMain);
}

main {
  @include width-height_max;
  max-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
