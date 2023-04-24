<template>
  <section class="chatbox" v-if="conversation">
    <div class="chatbox__header">
      <img :src="conversation.otherUser.profilePicture" alt="" />
      <h3>
        {{ conversation.otherUser.firstname }}
        {{ conversation.otherUser.lastname }}
      </h3>
      <router-link :to="`/users/${conversation.otherUser.id}`"
        >Voir profil</router-link
      >
    </div>
    <div class="chatbox__messagesList" ref="messagesList">
      <div v-for="(message, index) in sortedMessageArray">
        <div class="myMessages message" v-if="message.author === userLS.id">
          <p :title="dayjs(message.createdAt).format('DD/MM/YY à HH[h]mm')">
            {{ message.content }}
          </p>
        </div>
        <div class="othersMessages message" v-else>
          <img
            v-if="showProfilePicture(index)"
            :src="conversation.otherUser.profilePicture"
            alt="profilePicture"
          />
          <div v-else class="noImg"></div>
          <p :title="dayjs(message.createdAt).format('DD/MM/YY à HH[h]mm')">
            {{ message.content }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useInfiniteScroll } from "@vueuse/core";
import useChatStore from "@/stores/chatStore.js";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const route = useRoute();
const chatStore = useChatStore();
const userLS = JSON.parse(sessionStorage.getItem("user"));
const conversation = ref(null);
const messagesList = ref(null);

const sortedMessageArray = computed(() => {
  return chatStore.messages.sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
});

useInfiniteScroll(
  messagesList,
  async () => {
    const oldScrollHeight = messagesList.value.scrollHeight;
    const lastMessage = chatStore.messages[0];
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

const showProfilePicture = (index) => {
  const nextUserIdx = index + 1;
  if (nextUserIdx === chatStore.messages.length) {
    return true;
  } else if (
    chatStore.messages[index].author === chatStore.messages[nextUserIdx].author
  ) {
    return false;
  } else {
    return true;
  }
};

const getConversation = async (routeParams) => {
  if ("conversationId" in routeParams) {
    const conversationId = parseInt(routeParams.conversationId);
    conversation.value = chatStore.conversations.find(
      (conv) => conv.id === conversationId
    );
    await chatStore.getConversationMessages(conversationId);
    for (const message of chatStore.messages) {
      if (
        message.isRead === false &&
        message.conversationId === conversationId
      ) {
        await chatStore.markAsRead(message.conversationId, message.id);
      }
    }
  }
};

watch(
  // On observe le dernier message
  () => chatStore.messages[chatStore.messages.length - 1],
  (newValue, oldValue) => {
    // S'il y a un nouveau message, on scroll en bas
    if (newValue !== oldValue) {
      nextTick(() => {
        messagesList.value.scrollTop = messagesList.value.scrollHeight;
      });
      if (newValue.conversationId === parseInt(route.params.conversationId)) {
        const conversation = chatStore.conversations.find(
          (conv) => conv.id === newValue.conversationId
        );
        conversation.lastMessage.isRead = true;
      }
    }
  }
);

watch(
  () => route.params,
  async (newValue) => {
    await getConversation(newValue);
  }
);

onMounted(async () => {
  await getConversation(route.params);
  nextTick(() => {
    messagesList.value.scrollTop = messagesList.value.scrollHeight;
  });
});
</script>

<style lang="scss" scoped>
.chatbox {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  max-height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
  & * {
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
    gap: 5px;
    padding: 0 10px;
    padding-top: 10px;
    overflow-y: auto;
    padding-bottom: 10px;
    &::-webkit-scrollbar {
      display: none;
    }
    & .message {
      max-width: 60%;
      width: fit-content;
      border-radius: 10px;
      word-break: break-all;
      & p {
        padding: 10px;
        border-radius: 10px;
      }
    }
    & .myMessages {
      background-color: #0084ff;
      margin-left: auto;
    }
    & .othersMessages {
      display: flex;
      align-items: flex-end;
      margin-right: auto;
      gap: 5px;
      & p {
        background-color: var(--messageBg);
      }
      & img {
        width: 35px;
        height: 35px;
        object-fit: cover;
        border-radius: 50%;
      }
      & .noImg {
        min-width: 35px;
        min-height: 35px;
        border-radius: 50%;
      }
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
