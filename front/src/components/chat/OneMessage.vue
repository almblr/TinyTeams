<template>
  <div
    class="message"
    :class="message.author === user.id ? 'myMessages' : 'othersMessages'"
  >
    <img
      class="profilePicture"
      v-if="showProfilePicture(index) && message.author !== user.id"
      :src="conversation.otherUser.profilePicture"
      alt="profilePicture"
    />
    <div v-else-if="message.author !== user.id" class="noImg"></div>
    <div class="message__divContent">
      <p
        v-if="message.content"
        :title="dayjs(message.createdAt).format('DD/MM/YY à HH[h]mm')"
      >
        {{ message.content }}
      </p>
      <img
        class="imgContent"
        v-if="message.imageUrl"
        :src="message.imageUrl"
        alt="image"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import useChatStore from "@/stores/chatStore.js";
import dayjs from "@/dayjs.js";

const props = defineProps({
  message: Object,
  index: Number,
  conversation: Object,
});
const chatStore = useChatStore();
const user = JSON.parse(sessionStorage.getItem("user"));

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

const defineMarginBottom = computed(() => {
  const nextUserIdx = props.index + 1;
  if (nextUserIdx === chatStore.messages.length) {
    return "10px";
  } else if (
    chatStore.messages[props.index].author ===
    chatStore.messages[nextUserIdx].author
  ) {
    return "2px";
  } else {
    return "10px";
  }
});
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  max-width: 85%;
  width: fit-content;
  word-break: break-all;
  margin-bottom: v-bind("defineMarginBottom");
  & .profilePicture,
  .noImg {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  & .profilePicture {
    object-fit: cover;
    margin-top: 4px;
  }
  &__divContent {
    display: flex;
    flex-direction: column;
    gap: 10px;
    & p {
      width: fit-content;
      padding: 10px;
      border-radius: 10px;
    }
    & .imgContent {
      width: 100%;
      max-width: 480px;
      max-height: 200px;
      object-fit: cover;
      border-radius: 10px;
    }
  }
}
.myMessages {
  margin-left: auto;
  & p {
    background-color: #0084ff;
    margin-left: auto;
    color: white;
  }
}
.othersMessages {
  margin-right: auto;
  gap: 5px;
  & p {
    background-color: var(--messageBg);
  }
}
</style>
