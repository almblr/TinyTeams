<template>
  <div id="container">
    <TheHeader />
    <main id="chat">
      <div class="contactList">
        <div class="contactList__header">
          <h2>Discussions</h2>
          <button>New msg</button>
        </div>
        <router-link
          :to="`/messages/${conversation.id}`"
          v-for="conversation of conversations"
        >
          <img :src="conversation.otherUser.profilePicture" alt="" />
          <div>
            <h3>
              {{ conversation.otherUser.firstname }}
              {{ conversation.otherUser.lastName }}
            </h3>
            <p>
              <span>{{
                conversation.lastMessage.content
                  ? conversation.lastMessage.content
                  : "Voir pièce jointe"
              }}</span>
              <span>
                {{
                  dayjs().to(dayjs(conversation.lastMessage.createdAt))
                }}</span
              >
            </p>
          </div>
        </router-link>
      </div>
      <div class="conversation" v-if="isDesktop"></div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TheHeader from "@/components/layout/TheHeader.vue";
import useChatStore from "@/stores/chatStore.js";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const chatStore = useChatStore();
</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  overflow-y: auto;
  position: relative;
  background-color: var(--backgroundMain);
}

#chat {
  @include jcCt-aiCt;
}

.contactList {
  width: 360px;
  height: 100%;
  &__header {
    display: flex;
    align-items: center;
    width: 100%;
  }
}

.conversation {
  flex: 1;
}
</style>
