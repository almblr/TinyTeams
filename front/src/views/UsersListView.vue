<template>
  <div id="container" ref="usersList">
    <TheHeader />
    <main class="users">
      <ResearchBar />
      <div class="users__list">
        <UserCardList :users="userStore.users" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import useUserStore from "@/stores/userStore.js";
import TheHeader from "@//components/layout/TheHeader.vue";
import UserCardList from "@/components/users/UserCardList.vue";
import ResearchBar from "@//components/layout/ResearchBar.vue";

const usersList = ref(null);
const userStore = useUserStore();

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

onMounted(async () => {
  await userStore.getAll();
});
</script>

<style lang="scss" scoped>
#container {
  @include fdCol-jcCt-aiCt;
  background-color: var(--backgroundMain);
  height: 100%;
  overflow-y: auto;
  position: relative;
  gap: 30px;
}
.users {
  @include fdCol-aiCt;
  transition: 200ms;
  min-height: 100%;
  padding-top: 30px;
  max-width: 768px;
  width: 100%;
  gap: 0;
  &__list {
    width: 100%;
    margin-top: 20px;
  }
}

input {
  margin-bottom: 30px;
}

@media all and (min-width: 768px) {
  input {
    margin-bottom: 0;
  }
  .users__list {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
}
</style>
