<template>
  <RouterView />
  <router-link :to="path" class="notif" v-if="newNotif">{{
    notifContent
  }}</router-link>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { state, socket } from "./socket.js";
import { useRoute } from "vue-router";
import useNotifStore from "@/stores/notificationStore.js";
import useChatStore from "@/stores/chatStore.js";

const user = JSON.parse(sessionStorage.getItem(`user`));
const notifStore = useNotifStore();
const chatStore = useChatStore();
const route = useRoute();
const newNotif = ref(false);
const notifContent = ref(null);
const path = ref(null);

const showNotif = () => {
  newNotif.value = true;
  notifStore.nonViewedNotifs++;
  setTimeout(() => {
    newNotif.value = false;
  }, 4000);
};

watch(state.newPost, async (newValue) => {
  if (newValue) {
    path.value = `post/${newValue[0].postId}`;
    notifContent.value = `${newValue[0].senderUsername} a publié un nouveau post !`;
    showNotif();
  }
});

watch(state.newLike, async (newValue) => {
  if (newValue) {
    path.value = `post/${newValue[0].postId}`;
    notifContent.value = `${newValue[0].senderUsername} a aimé votre post.`;
    showNotif();
  }
});

watch(state.newComment, async (newValue) => {
  if (newValue) {
    path.value = `post/${newValue[0].postId}`;
    notifContent.value = `${newValue[0].senderUsername} a commenté votre post !`;
    showNotif();
  }
});

watch(state.newFollow, async (newValue) => {
  if (newValue) {
    console.log(newValue[0]);
    path.value = `users/${newValue[0].sender}`;
    notifContent.value = `${newValue[0].senderUsername} vous suit !`;
    showNotif();
  }
});

watch(state.newMessage, async (newValue) => {
  if (newValue) {
    const conversationIdParam = parseInt(route.params.conversationId);
    // If the user is on the conversation page, we mark the message as read
    if (
      conversationIdParam &&
      conversationIdParam === newValue[0].conversationId
    ) {
      chatStore.messages.push(newValue[0]);
      await chatStore.markAsRead(conversationIdParam, newValue[0].id);
    }
    const conversationIndex = chatStore.conversations.findIndex(
      (c) => c.id === newValue[0].conversationId
    );
    const conversionUpdated = await chatStore.getOneConversation(
      newValue[0].conversationId
    );
    chatStore.conversations.splice(conversationIndex, 1);
    chatStore.conversations.unshift(conversionUpdated);
    chatStore.nonReadMessages++;
  }
});

onMounted(async () => {
  user ? socket.emit("sendUserId", user.id) : null;
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");
@import "./scss/_var.scss";

#app {
  height: 100vh;
  & > div {
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

*,
::after,
::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Lato", sans-serif;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.notif {
  @include jcCt-aiCt;
  position: absolute;
  bottom: 0;
  text-align: center;
  text-decoration: none;
  left: calc(50% - 150px);
  background-color: var(--backgroundSecond);
  border: 1px solid rgba(206, 205, 205, 0.233);
  border: 1px solid var(--border);
  color: var(--textColorSecond);
  width: 300px;
  height: 75px;
  border-radius: 5px;
  box-shadow: 5px 0 20px var(--shadowColor);
  animation: notifAnimation 4s ease-in-out forwards;
  cursor: pointer;
}

@keyframes notifAnimation {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  3% {
    transform: translateY(-50px);
    opacity: 1;
  }
  95% {
    transform: translateY(-50px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
}
/* SCROLLBAR */

::-webkit-scrollbar {
  width: 13px;
}

/* Track */
::-webkit-scrollbar-track {
  background: var(--backgroundMain);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--colorDivider);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: var(--addMediaBackground);
}

@media screen and (min-width: 768px) {
  #app {
    & > div::-webkit-scrollbar {
      display: block;
    }
  }
}
</style>
