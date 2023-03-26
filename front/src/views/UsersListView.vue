<template>
  <div id="container">
    <TheHeader />
    <main id="users">
      <ResearchBarComponent></ResearchBarComponent>
      <ListCardComponent :users="userStore.users" />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/stores/index.js";
import TheHeader from "@/components/layout/TheHeaderComponent.vue";
import ListCardComponent from "@/components/user/ListCardComponent.vue";
import ResearchBarComponent from "../components/layout/ResearchBarComponent.vue";
const userStore = useUserStore();

onMounted(async () => {
  await userStore.getAll();
});
</script>

<style lang="scss" scoped>
#container {
  @include fdCol-jcCt-aiCt;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  gap: 30px;
}
#users {
  @include fdCol-aiCt;
  width: 100%;
  background-color: var(--backgroundMain);
  transition: 200ms;
  min-height: 100%;
  padding-top: 30px;
  gap: 0;
}

input {
  margin-bottom: 30px;
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
