<template>
  <div id="container">
    <main>
      <div v-if="route.name.newMessage"></div>
      <div v-for="(message, index) in messages" v-else>
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
    <TextareaComponent
      type="sendMessage"
      placeholder="Ecrivez un message..."
      :receiver="otherUser.id"
      :conversationId="route.params.conversationId"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useChatStore from "@/stores/chatStore.js";
import TextareaComponent from "@/components/posts/TextareaComponent.vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const route = useRoute();
const chatStore = useChatStore();
const userLS = JSON.parse(localStorage.getItem("user"));
const otherUser = ref(null);

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
  const conversation = chatStore.conversation.find(
    (conv) => conv.id === route.params.conversationId
  );
  otherUser.value = conversation.otherUser;
});
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  height: 100%;
  overflow-y: auto;
  position: relative;
  background-color: var(--backgroundMain);
  position: relative;
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
