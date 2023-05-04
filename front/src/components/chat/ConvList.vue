<template>
  <div class="convList">
    <ConvListHeader v-if="chatStore.isDesktop" />
    <div v-if="chatStore.conversations.length === 0" class="nothingToDisplay">
      Il n'y a aucune conversation pour le moment
    </div>
    <ConvListCard v-else />
    <button
      class="newMessage"
      v-if="!chatStore.isDesktop"
      @click="chatStore.showMobileUsersList = true"
    >
      <ion-icon name="add-outline"></ion-icon>
    </button>
  </div>
  <Transition>
    <ContactsList v-if="chatStore.showMobileUsersList" />
  </Transition>
</template>

<script setup>
import useChatStore from "@/stores/chatStore.js";
import ContactsList from "@/components/chat/ContactsList.vue";
import ConvListHeader from "@/components/chat/ConvListHeader.vue";
import ConvListCard from "@/components/chat/ConvListCard.vue";

const chatStore = useChatStore();
</script>
<style lang="scss" scoped>
.convList {
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
  max-height: 100%;
  color: var(--textColorMain);
  padding: 5px;
}

.nothingToDisplay {
  @include fdCol-aiCt;
  flex: 1;
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
  .convList {
    border-right: 1px solid var(--border);
    min-width: 360px;
    width: 360px;
  }
}
</style>
