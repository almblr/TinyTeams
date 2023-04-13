<template>
  <div id="container">
    <TheHeader />
    <main id="chat">
      <ConvList />
      <ChatArea v-if="route.params.conversationId" />
      <NewMessage v-else />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import useChatStore from "@/stores/chatStore.js";
import TheHeader from "@/components/layout/TheHeader.vue";
import ConvList from "@/components/chat/ConvList.vue";
import ChatArea from "@/components/chat/ChatArea.vue";
import NewMessage from "@/components/chat/NewMessage.vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const route = useRoute();
const chatStore = useChatStore();
</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  overflow-y: auto;
  position: relative;
  background-color: var(--backgroundMain);
}

#chat {
  @include jcCt-aiCt;
}

.contactList {
  width: 360px;
  height: 100%;
  &__header {
    display: flex;
    align-items: center;
    width: 100%;
  }
}

.conversation {
  flex: 1;
}
</style>
