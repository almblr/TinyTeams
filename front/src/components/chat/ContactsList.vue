<template>
  <div id="container" ref="usersList">
    <main class="users">
      <div class="header">
        <ion-icon
          name="arrow-back-outline"
          @click="chatStore.openModalContact = false"
        ></ion-icon>
        <input
          type="text"
          v-model="search"
          placeholder="Rechercher"
          @input="searchUser(search)"
        />
      </div>
      <div class="users__list">
        <UserCardList :users="userStore.users" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import useUserStore from "@/stores/userStore.js";
import useChatStore from "@/stores/chatStore.js";
import { useRoute } from "vue-router";
import UserCardList from "@/components/users/UserCardList.vue";
import { useWindowSize } from "@vueuse/core";

const { width } = useWindowSize();
const userStore = useUserStore();
const chatStore = useChatStore();
const usersList = ref(null);
const search = ref(null);

const searchUser = async (string) => {
  await userStore.getAll(string);
};

useInfiniteScroll(
  usersList,
  async () => {
    const lastUser = userStore.users[userStore.users.length - 1];
    const lastUserId = lastUser.id;
    await userStore.getAll(undefined, lastUserId);
  },
  {
    distance: 10,
  }
);

watch(
  () => width.value,
  (newWidth) => {
    if (newWidth > 768) {
      chatStore.openContactModal = false;
    }
  }
);

onMounted(async () => {
  await userStore.getAll();
});
</script>

<style lang="scss" scoped>
#container {
  position: absolute;
  background-color: var(--backgroundMain);
  overflow-y: hidden;
  width: 100%;
  min-height: 100%;
  box-shadow: -20px -10px 5px rgba(0, 0, 0, 0.05);
}
.users {
  @include fdCol-aiCt;
  transition: 200ms;
  min-height: 100%;
  padding-top: 10px;
  max-width: 768px;
  width: 100%;
  &__list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}

.header {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  gap: 20px;
  border-bottom: 1px solid var(--border);
  & ion-icon {
    color: var(--textColorSecond);
    border: none;
    background: transparent;
    font-size: 1.5rem;
    cursor: pointer;
  }
  input {
    flex: 1;
    height: 100%;
    background-color: transparent;
    border: none;
    font-size: 1.1rem;
    color: var(--textColorSecond);
    outline: none;
    margin-bottom: 5px;
  }
}
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

@media all and (min-width: 768px) {
  input {
    margin-bottom: 0;
  }
  #users {
    gap: 30px;
  }
}
</style>
