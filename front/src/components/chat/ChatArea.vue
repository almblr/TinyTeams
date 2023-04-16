<template>
  <div id="chatArea">
    <main>
      <AutoSuggest v-if="chatStore.newMessage === false && width > 768" />
      <div class="preview" v-if="route.name === 'newMessage' && newUser">
        <img :src="newUser.profilePicture" alt="profilePicture" />
        <div>
          <h3>{{ newUser.firstname }} {{ newUser.lastname }}</h3>
          <span>{{ newUser.job }}</span>
        </div>
      </div>
      <div v-for="(message, index) in chatStore.messages">
        <div class="myMessages" v-if="message.author === userLS.id">
          <div>
            <p>{{ message.content }}</p>
          </div>
        </div>
        <div class="othersMessages" v-else>
          <img
            :src="otherUser.profilepicture"
            alt="otherUserProfilePicture"
            v-if="showProfilePicture(index)"
          />
          <div>
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
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
const { width } = useWindowSize();
const newUser = ref(null);
const route = useRoute();
const chatStore = useChatStore();
const userStore = useUserStore();
const userLS = JSON.parse(localStorage.getItem("user"));
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
});
</script>

<style lang="scss" scoped>
#chatArea {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  background-color: var(--backgroundMain);
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

main {
  flex: 1;
}
.myMessages {
  display: flex;
  position: absolute;
  left: 20px;
  p {
    background-color: #0084ff;
    color: var(--textColorMain);
    padding: 10px;
    border-radius: 10px;
    margin: 0 0 0 10px;
  }
}

.othersMessages {
  display: flex;
  position: absolute;
  right: 20px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0 10px 0 0;
  }
  p {
    background-color: gray;
    color: white;
    padding: 10px;
    border-radius: 10px;
    margin: 0 10px 0 0;
  }
}
</style>
