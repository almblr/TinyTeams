<template>
  <div
    class="contactList"
    v-if="
      (!chatStore.openModalContact && route.name !== 'newMessage' && notConv) ||
      isDeskop
    "
  >
    <div class="contactList__header" v-if="isDeskop">
      <h2>Discussions</h2>
      <button class="contactList__header__new">
        <ion-icon name="add-outline" @click="openNewMessage"></ion-icon>
      </button>
    </div>
    <div v-if="chatStore.conversations.length === 0" class="nothingToDisplay">
      Il n'y a aucune conversation pour le moment
    </div>
    <router-link
      :to="`/messages/${conversation.id}`"
      v-else
      v-for="conversation of chatStore.conversations"
    >
      <img :src="conversation.otherUser.profilePicture" alt="profilePicture" />
      <div>
        <h3>
          {{ conversation.otherUser.firstname }}
          {{ conversation.otherUser.lastname }}
        </h3>
        <p>
          <span class="last-message">{{
            conversation.lastMessage.content
              ? conversation.lastMessage.content
              : "Voir pièce jointe"
          }}</span>
          ·
          <span>{{
            dayjs(conversation.lastMessage.createdAt).fromNow(true)
          }}</span>
        </p>
      </div>
    </router-link>
    <button
      class="newMessage"
      v-if="!isDeskop"
      @click="chatStore.openModalContact = true"
    >
      <ion-icon name="add-outline"></ion-icon>
    </button>
  </div>
  <Transition>
    <ContactsList v-if="chatStore.openModalContact" />
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";
import router from "@/router/index.js";
import useChatStore from "@/stores/chatStore.js";
import ContactsList from "@/components/chat/ContactsList.vue";
import relativeTime from "dayjs/plugin/relativeTime";
import UpdateLocale from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);
dayjs.extend(UpdateLocale);
dayjs.updateLocale("fr", {
  // Configuration des unités de temps pour les minutes
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "quelques secondes",
    m: "1 min",
    mm: "%d min",
    h: "une heure",
    hh: "%d heures",
    d: "un jour",
    dd: "%d jours",
    M: "un mois",
    MM: "%d mois",
    y: "une année",
    yy: "%d années",
  },
});

const emit = defineEmits(["openNewContact"]);

const { width } = useWindowSize();
const route = useRoute();
const isDeskop = ref(width.value > 768);
const chatStore = useChatStore();
const notConv = ref(null);

const openNewMessage = () => {
  router.push("/messages/");
  chatStore.newMessage = false;
};
watch(
  () => width.value,
  (newWidth) => {
    if (newWidth > 768) {
      isDeskop.value = true;
      chatStore.openModalContact = false;
    } else {
      isDeskop.value = false;
    }
  }
);

watch(
  () => chatStore.openConversation,
  (newValue) => {
    newValue !== null ? (chatStore.openModalContact.value = false) : null;
  }
);

watch(
  () => route.params,
  (newValue) => {
    if ("conversationId" in newValue) {
      notConv.value = false;
    } else {
      notConv.value = true;
    }
  }
);

onMounted(async () => {
  await chatStore.getUserConversations();
});
</script>
<style lang="scss" scoped>
.contactList {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  color: var(--textColorMain);
  padding: 5px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: var(--textColorSecond);
    padding: 10px 0 0 10px;
    margin-bottom: 20px;
  }
  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--textColorMain);
    max-height: 80px;
    border-radius: 10px;
    padding: 10px;
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
    & span {
      font-size: 0.9rem;
    }
  }
}

p {
  max-width: 200px;
  height: 50px;
  color: red;
  overflow: hidden;
  text-overflow: ellipsis;
  .last-message {
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.nothingToDisplay {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-style: italic;
}

.newMessage {
  @include jcCt-aiCt;
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  font-size: 1.5rem;
  color: white;
  background-color: #1877f2;
  cursor: pointer;
}

@media all and (min-width: 768px) {
  .contactList {
    border-right: 1px solid var(--border);
    width: 360px;
    &__header {
      &__new {
        @include jcCt-aiCt;
        width: 40px;
        height: 40px;
        color: var(--textColorMain);
        border-radius: 50%;
        border: none;
        background-color: transparent;
        font-size: 2rem;
        transition: 200ms;
        background-color: rgba(173, 171, 171, 0.1);
        cursor: pointer;
        &:hover {
          background-color: rgba(173, 171, 171, 0.2);
        }
      }
    }
  }
}
</style>
