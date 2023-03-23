<template>
  <div id="container">
    <TheHeader />
    <main id="users">
      <ListCardComponent />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/stores/index.js";
import TheHeader from "@/components/layout/TheHeaderComponent.vue";
import ListCardComponent from "@/components/user/ListCardComponent.vue";
const userStore = useUserStore();

onMounted(async () => {
  userStore.users.length = 0;
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
  gap: 30px;
}
</style>
