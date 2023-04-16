<template>
  <div id="chatArea">
    <main>
      <AutoSuggest v-if="chatStore.newMessage === false && width > 768" />
      <section class="preview" v-if="route.name === 'newMessage' && newUser">
        <img :src="newUser.profilePicture" alt="profilePicture" />
        <div>
          <h3>{{ newUser.firstname }} {{ newUser.lastname }}</h3>
          <span>{{ newUser.job }}</span>
        </div>
      </section>
      <div class="header">John Doe</div>
      <section class="messages" v-if="'conversationId' in route.params">
        <div v-for="(message, index) in chatStore.messages">
          <div class="myMessages" v-if="message.author === userLS.id">
            <p>
              {{ message.content }}
            </p>
          </div>
          <div class="othersMessages" v-else>
            <p>
              {{ message.content }}
            </p>
          </div>
        </div>
      </section>
    </main>
    <MessageInput v-if="!contactChatArea && canSendMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import useChatStore from "@/stores/chatStore.js";
import useUserStore from "@/stores/userStore.js";
import { useRoute } from "vue-router";
import relativeTime from "dayjs/plugin/relativeTime";
import MessageInput from "@/components/chat/MessageInput.vue";
import { useWindowSize } from "@vueuse/core";

import AutoSuggest from "@/components/layout/AutoSuggest.vue";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const props = defineProps({
  contactChatArea: {
    type: Boolean,
  },
});

const userLS = JSON.parse(sessionStorage.getItem("user"));
const { width } = useWindowSize();
const newUser = ref(null);
const route = useRoute();
const chatStore = useChatStore();
const userStore = useUserStore();
const canSendMessage = ref(false);

const showProfilePicture = (index) => {
  if (
    chatStore.messages[index].author === chatStore.messages[index + 1].author
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
      chatStore.newMessage = true;
    }
    if ("userId" in newValue || "conversationId" in newValue) {
      canSendMessage.value = true;
    } else {
      canSendMessage.value = false;
    }
    if ("conversationId" in route.params) {
      await chatStore.getConversationMessages(route.params.conversationId);
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
  } else {
    canSendMessage.value = false;
  }
  if ("conversationId" in route.params) {
    await chatStore.getConversationMessages(route.params.conversationId);
  } else {
    chatStore.messages = [];
  }
});
</script>

<style lang="scss" scoped>
#chatArea {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
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
  color: var(--textColorMain);
  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 50%;
  }
}

.header {
  position: absolute;
  z-index: 99;
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 10px;
  font-size: 1.2rem;
  color: var(--textColorMain);
  font-weight: bold;
  border-bottom: 1px solid rgba(128, 128, 128, 0.233);
  box-shadow: 5px 3px 5px rgba(0, 0, 0, 0.11);
  background-color: var(--backgroundMain);
}
.messages {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  color: var(--textColorMain);
  padding: 15px;
  padding-top: 60px;
  min-height: 100%;
  gap: 5px;
  .myMessages {
    width: fit-content;
    margin-left: auto;
    align-self: flex-end;
    background-color: #0084ff;
    color: white;
    padding: 10px;
    border-radius: 10px;
  }
  .othersMessages {
    margin-right: auto;
    width: fit-content;
    align-self: flex-start;
    background-color: var(--messageBg);
    color: var(--textColorMain);
    padding: 10px;
    border-radius: 10px;
  }
}
</style>
