<template>
  <div id="container">
    <main>
      <section class="preview" v-if="route.name === 'newMessage' && newUser">
        <img :src="newUser.profilePicture" alt="profilePicture" />
        <div>
          <h3>{{ newUser.firstname }} {{ newUser.lastname }}</h3>
          <span>{{ newUser.job }}</span>
        </div>
      </section>
      <section
        class="chatbox"
        v-if="'conversationId' in route.params && conversation"
        ref="chatbox"
      >
        <div class="chatbox__header">
          <h3>
            {{ conversation.users[1].firstname }}
            {{ conversation.users[1].lastname }}
          </h3>
          <router-link :to="`/users/${conversation.users[1].id}`"
            >Voir profil</router-link
          >
        </div>
        <div class="chatbox__messagesList">
          <div v-for="(message, index) in chatStore.messages">
            <div class="myMessages message" v-if="message.author === userLS.id">
              <p :title="dayjs(message.createdAt).format('DD/MM/YY à HH[h]mm')">
                {{ message.content }}
              </p>
            </div>
            <div class="othersMessages message" v-else>
              <img
                v-if="showProfilePicture(index)"
                :src="conversation.users[1].profilePicture"
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
    </main>
    <MessageInput v-if="canSendMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useWindowSize } from "@vueuse/core";
import useChatStore from "@/stores/chatStore.js";
import useUserStore from "@/stores/userStore.js";
import MessageInput from "@/components/chat/MessageInput.vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const userLS = JSON.parse(sessionStorage.getItem("user"));
const { width } = useWindowSize();
const newUser = ref(null);
const route = useRoute();
const chatStore = useChatStore();
const userStore = useUserStore();
const canSendMessage = ref(false);
const conversation = ref(null);
const chatbox = ref(null);

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

watch(
  () => route.params,
  async (newValue) => {
    if ("userId" in newValue) {
      newUser.value = await userStore.getOne(newValue.userId);
      chatStore.newMessage = false;
      chatStore.onversationMode = true;
    }
    if ("userId" in newValue || "conversationId" in newValue) {
      canSendMessage.value = false;
      chatStore.onversationMode = true;
    } else {
      canSendMessage.value = false;
      chatStore.onversationMode = false;
    }
    if ("conversationId" in route.params) {
      conversation.value = await chatStore.getOneConv(
        route.params.conversationId
      );
      await chatStore.getConversationMsg(route.params.conversationId);
    } else {
      chatStore.messages = [];
    }
  }
);
onMounted(async () => {
  if ("userId" in route.params) {
    newUser.value = await userStore.getOne(route.params.userId);
  }
  if ("userId" in route.params || "conversationId" in route.params) {
    canSendMessage.value = true;
    chatStore.onversationMode = true;
  } else {
    canSendMessage.value = false;
    chatStore.onversationMode = false;
  }
  if ("conversationId" in route.params) {
    conversation.value = await chatStore.getOneConv(
      route.params.conversationId
    );
    await chatStore.getConversationMsg(route.params.conversationId);
  } else {
    chatStore.messages = [];
  }
  chatbox.value.scrollIntoView({ behavior: "instant", block: "end" });
});
</script>

<style lang="scss" scoped>
#container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--backgroundMain);
}

main {
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.preview {
  @include fdCol-jcCt-aiCt;
  padding-top: 100px;
  flex: 1;
  text-align: center;
  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 50%;
  }
}

.chatbox {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding-bottom: 70px;
  & * {
    color: var(--textColorMain);
  }
  &__header {
    display: flex;
    align-items: center;
    position: absolute;
    z-index: 99;
    width: 100%;
    min-height: 50px;
    padding: 0 10px;
    font-size: 1.2rem;
    font-weight: bold;
    border-bottom: 1px solid rgba(128, 128, 128, 0.233);
    box-shadow: 5px 3px 5px rgba(0, 0, 0, 0.11);
    background-color: var(--backgroundMain);
    & > h3 {
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
    flex: 1;
    height: 100%;
    gap: 5px;
    padding: 0 10px;
    padding-top: 60px;
    & .message {
      display: flex;
      align-items: flex-end;
      max-width: 60%;
      width: fit-content;
      border-radius: 10px;
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
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
    }
  }
}
</style>
