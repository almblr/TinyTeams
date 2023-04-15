<template>
  <div id="container">
    <main>
      <div v-if="contactChatArea">
        <AutoSuggest />
      </div>
      <div class="preview" v-if="route.name === 'newMessage'">
        <img :src="chatStore.newUser.profilePicture" alt="profilePicture" />
        <div>
          <h3>
            {{ chatStore.newUser.firstname }} {{ chatStore.newUser.lastname }}
          </h3>
        </div>
      </div>
      <div v-else v-for="(message, index) in chatStore.messages">
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
    <MessageInput v-if="!contactChatArea" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useChatStore from "@/stores/chatStore.js";
import useUserStore from "@/stores/userStore.js";
import { useRoute } from "vue-router";
import relativeTime from "dayjs/plugin/relativeTime";
import MessageInput from "@/components/chat/MessageInput.vue";
import AutoSuggest from "@/components/layout/AutoSuggest.vue";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const props = defineProps({
  contactChatArea: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const chatStore = useChatStore();
const userStore = useUserStore();
const userLS = JSON.parse(localStorage.getItem("user"));

const showProfilePicture = (index) => {
  if (
    chatStore.messages[index].author === chatStore.messages[index + 1].author
  ) {
    return false;
  } else {
    return true;
  }
};

onMounted(async () => {
  const conversation = chatStore.conversations.find(
    (conv) => conv.id === route.params.conversationId
  );
  if (conversation) {
    otherUser.value = conversation.otherUser;
  } else if (!conversation && route.name === "newMessage") {
    otherUser.value = await userStore.getOne(chatStore.otherUser.id);
  } else {
    return;
  }
});
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
  height: 100%;
  background-color: var(--backgroundMain);
}

.preview {
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
