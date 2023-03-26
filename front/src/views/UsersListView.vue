<template>
  <div id="container">
    <TheHeader />
    <main id="users">
      <input
        type="text"
        v-model="search"
        placeholder="Rechercher un membre"
        @input="searchUser(search)"
      />
      <ListCardComponent :users="userStore.users" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/index.js";
import TheHeader from "@/components/layout/TheHeaderComponent.vue";
import ListCardComponent from "@/components/user/ListCardComponent.vue";
const userStore = useUserStore();
const search = ref(null);

const searchUser = async (string) => {
  await userStore.getAll(string);
};

onMounted(async () => {
  await userStore.getAll();
});
</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  overflow-y: scroll;
  position: relative;
}
#users {
  @include fdCol-aiCt;
  background-color: var(--backgroundMain);
  transition: 200ms;
  min-height: 100%;
  padding-top: 30px;
  gap: 0;
}
</style>
