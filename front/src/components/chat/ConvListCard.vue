<template>
  <a
    @click="openConversation(conversation.id)"
    v-for="conversation in chatStore.conversations"
    :key="conversation.id"
    :id="conversation.id"
    class="card"
  >
    <img :src="conversation.otherUser.profilePicture" alt="profilePicture" />
    <div class="card__infos">
      <h3>
        {{ conversation.otherUser.firstname }}
        {{ conversation.otherUser.lastname }}
      </h3>
      <div class="card__infos__content">
        <p
          v-if="conversation.lastMessage"
          :class="{
            nonReadMessage:
              !conversation.lastMessage.isRead &&
              conversation.lastMessage.author !== userLS.id,
          }"
        >
          {{
            conversation.lastMessage.content
              ? conversation.lastMessage.content
              : "Voir pièce jointe"
          }}
        </p>
        <p class="messageDeleted" v-else>Message supprimé</p>
        <span>
          {{
            "&nbsp;· " +
              dayjs(conversation.lastMessage?.createdAt).fromNow(true) || ""
          }}
        </span>
      </div>
      <div
        v-if="
          !conversation.lastMessage.isRead &&
          conversation.lastMessage.author !== userLS.id
        "
        class="conversationBadge"
      ></div>
    </div>
  </a>
</template>

<script setup>
import router from "@/router/index.js";
import useChatStore from "@/stores/chatStore.js";
import relativeTime from "dayjs/plugin/relativeTime";
import UpdateLocale from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);
dayjs.extend(UpdateLocale);
dayjs.updateLocale("fr", {
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "1min",
    m: "1min",
    mm: "%dmin",
    h: "1h",
    hh: "%dh",
    d: "1j",
    dd: "%d jrs",
    M: "1 mois",
    MM: "%d mois",
    y: "1 an",
    yy: "%d ans",
  },
});

const chatStore = useChatStore();
const userLS = JSON.parse(sessionStorage.getItem("user"));

const openConversation = (conversationId) => {
  chatStore.newMessage = false;
  const conversation = chatStore.conversations.find(
    (conv) => conv.id === conversationId
  );
  router.push(`/messages/${conversationId}`);
  if (conversation.lastMessage) {
    conversation.lastMessage.isRead = true;
  }
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 100%;
  max-height: 80px;
  color: var(--textColorMain);
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: var(--hover);
  }
  & img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
  }
  &__infos {
    width: 100%;
    overflow: hidden;
    & h3 {
      text-align: start;
      font-weight: 500;
    }
    &__content {
      display: flex;
      align-items: center;
      & p {
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      & .nonReadMessage {
        font-weight: bold;
      }
      & .messageDeleted {
        font-style: italic;
      }
      span {
        min-width: 75px;
      }
    }
  }
  & .conversationBadge {
    position: absolute;
    top: 50%;
    right: 16px;
    width: 10px;
    height: 10px;
    border-radius: 99px;
    background-color: #2e89ff;
  }
}
</style>
