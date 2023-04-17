<template>
  <section class="chatbox" ref="chatbox">
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    <!-- <div class="chatbox__header">
      <h3>
        {{ conversation.users[1].firstname }}
        {{ conversation.users[1].lastname }}
      </h3>
      <router-link :to="`/users/${conversation.users[1].id}`"
        >Voir profil</router-link
      >
    </div>
    <div class="chatbox__messagesList" ref="messagesList">
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
    </div> -->
  </section>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
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

// watch(
//   () => chatStore.messages.length,
//   (newValue, oldValue) => {
//     if (newValue > oldValue) {
//       nextTick(() => {
//         messagesList.value.scrollIntoView({
//           behavior: "instant",
//           block: "end",
//         });
//       });
//     }
//   }
// );

if ("conversationId" in route.params) {
  conversation.value = await chatStore.getOneConv(route.params.conversationId);
  await chatStore.getConversationMsg(route.params.conversationId);
} else {
  chatStore.messages = [];
}

onMounted(async () => {
  console.log("test");
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
.chatbox {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  & * {
    color: var(--textColorMain);
  }
  &__header {
    position: sticky;
    top: 0;
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
    padding-top: 10px;
    margin-bottom: 10px;
    overflow: hidden;
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
