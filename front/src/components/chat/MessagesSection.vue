<template>
  <section class="chatbox" v-if="conversation">
    <div class="chatbox__header">
      <img :src="conversation.otherUser.profilePicture" alt="profilePicture" />
      <h3>
        {{ conversation.otherUser.firstname }}
        {{ conversation.otherUser.lastname }}
      </h3>
      <router-link :to="`/users/${conversation.otherUser.id}`"
        >Voir profil</router-link
      >
    </div>
    <div class="chatbox__messagesList" ref="messagesList">
      <div v-for="(message, index) in sortedMessageArray" v-if="!isLoading">
        <h6 class="date" v-if="showDate(message, index)">
          {{ date(message.createdAt) }}
        </h6>
        <OneMessage
          :message="message"
          :index="index"
          :conversation="conversation"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useInfiniteScroll } from "@vueuse/core";
import useChatStore from "@/stores/chatStore.js";
import OneMessage from "@/components/chat/OneMessage.vue";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const route = useRoute();
const chatStore = useChatStore();
const conversation = ref(null);
const messagesList = ref(null);
const isLoading = ref(true);

const sortedMessageArray = computed(() => {
  return chatStore.messages.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
});

const showDate = (message, index) => {
  const previousMessage = sortedMessageArray.value[index - 1];
  if (!previousMessage) return true;
  const messageDate = dayjs(message.createdAt);
  const previousMessageDate = dayjs(previousMessage.createdAt);
  const diff = messageDate.diff(previousMessageDate, "hour");
  if (diff >= 1) {
    return true;
  }
};

const date = (messageDate) => {
  const messageDatejs = dayjs(messageDate);
  const today = dayjs().format("DD/MM/YY");
  if (today === messageDatejs.format("DD/MM/YY")) {
    return messageDatejs.format("HH[h]mm");
  }
  return messageDatejs.format("DD/MM/YY à HH[h]mm");
};

const scrollToLastMessage = () => {
  nextTick(() => {
    messagesList.value.scrollTop = messagesList.value.scrollHeight;
  });
};

const getConversation = async (conversationId) => {
  conversation.value = chatStore.conversations.find(
    (conv) => conv.id === conversationId
  );
  await chatStore.getConversationMessages(conversationId);
  for (const message of chatStore.messages) {
    if (message.isRead === false && message.conversationId === conversationId) {
      await chatStore.markAsRead(message.conversationId, message.id);
    }
  }
};

const waitForImages = () => {
  const images = messagesList.value.getElementsByTagName("img");
  let loadedImages = 0;
  Array.from(images).forEach((img) => {
    if (img.complete) {
      loadedImages++;
    } else {
      img.addEventListener("load", () => {
        loadedImages++;
        if (loadedImages === images.length) {
          scrollToLastMessage();
        }
      });
    }
  });
  isLoading.value = false;
  if (loadedImages === images.length) {
    scrollToLastMessage();
  }
};

useInfiniteScroll(
  messagesList,
  async () => {
    const oldScrollHeight = messagesList.value.scrollHeight;
    const lastMessage = chatStore.messages[0];
    if (!lastMessage) return;
    const lastMessageId = lastMessage.id;
    await chatStore.getConversationMessages(
      lastMessage.conversationId,
      lastMessageId
    );
    messagesList.value.scrollTop =
      messagesList.value.scrollHeight - oldScrollHeight;
    return;
  },
  {
    distance: 100,
    direction: "top",
  }
);

watch(
  // On observe le dernier message
  () => chatStore.messages[chatStore.messages.length - 1],
  (newValue, oldValue) => {
    // S'il y a un nouveau message, on scroll en bas
    if (newValue !== oldValue && messagesList.value) {
      if (
        newValue &&
        newValue.conversationId === parseInt(route.params.conversationId)
      ) {
        const conversation = chatStore.conversations.find(
          (conv) => conv.id === newValue.conversationId
        );
        conversation.lastMessage.isRead = true;
      }
      waitForImages();
    }
  }
);

watch(
  () => route.params.conversationId,
  async (newId) => {
    if (newId) {
      const conversationId = parseInt(newId);
      await getConversation(conversationId);
      chatStore.isConversationMode = true;
      scrollToLastMessage();
    }
  }
);

onMounted(async () => {
  const conversationId = parseInt(route.params.conversationId);
  await getConversation(conversationId);
  chatStore.isConversationMode = true;
  // On attend que les images soient chargées pour scroller en bas
  waitForImages();
});
</script>

<style lang="scss" scoped>
.chatbox {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  max-height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
  & *:not(p) {
    color: var(--textColorMain);
  }
  &__header {
    position: sticky;
    display: flex;
    align-items: center;
    z-index: 99;
    width: 100%;
    min-height: 50px;
    padding: 0 10px;
    font-size: 1.2rem;
    font-weight: bold;
    border-bottom: 1px solid rgba(128, 128, 128, 0.233);
    box-shadow: 5px 3px 5px rgba(0, 0, 0, 0.11);
    background-color: var(--backgroundMain);
    & > img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
      object-fit: cover;
    }
    & > h3 {
      font-size: 1.2rem;
      flex: 1;
    }
    & > a {
      border: none;
      text-decoration: none;
      padding: 10px;
      background-color: transparent;
      transition: 0.2s;
      border-radius: 5px;
      font-size: 1.15rem;
      font-weight: bold;
      color: rgba(152, 143, 229, 0.712);
      color: var(--textColorSecond);
      cursor: pointer;
      &:hover {
        background-color: var(--hover);
      }
    }
  }
  &__messagesList {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 0 10px;
    padding-top: 10px;
    overflow-y: auto;
    padding-bottom: 10px;
    &::-webkit-scrollbar {
      display: none;
    }
    & .date {
      font-weight: 300;
      font-size: 0.8rem;
      font-style: italic;
      text-align: center;
      margin: 20px 0;
      width: 100%;
      color: var(--textColorSecond);
    }
  }
}

@media screen and (min-width: 768px) {
  .chatbox__messagesList::-webkit-scrollbar {
    display: block;
    width: 10px;
    &-thumb {
      border-radius: 20px;
    }
  }
}
</style>
