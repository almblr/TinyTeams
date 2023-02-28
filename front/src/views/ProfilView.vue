<template>
  <TheHeaderComponent />
  <main>
    <ProfilHeaderComponent
      :backgroundUrl="userStore.user.backgroundPicture"
      :profilPictureUrl="userStore.user.profilPicture"
    />
  </main>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useUserStore } from "../stores";
import { useRoute } from "vue-router";
import TheHeaderComponent from "../components/layout/TheHeaderComponent.vue";
import ProfilHeaderComponent from "../components/user/ProfilHeaderComponent.vue";

const userStore = useUserStore();
const locStr = JSON.parse(localStorage.getItem(`userInfo`));
const token = locStr.token;
const username = useRoute().params.username;

onBeforeMount(async () => {
  await userStore.getOne(token, username);
});
</script>

<style lang="scss" scoped>
main {
  display: flex;
  align-items: center;
  position: absolute;
  top: 50px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 20px;
  background-color: rgb(240, 240, 240);
}
.test {
  color: red;
}
</style>
