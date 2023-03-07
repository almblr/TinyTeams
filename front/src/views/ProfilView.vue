<template>
  <TheHeaderComponent />
  <main>
    <ProfilHeaderComponent
      :backgroundUrl="userData.backgroundPicture"
      :profilPictureUrl="userData.profilPicture"
    />
    <PostComponent />
  </main>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useUserStore } from "../stores";
import { useRoute } from "vue-router";
import TheHeaderComponent from "../components/layout/TheHeaderComponent.vue";
import ProfilHeaderComponent from "../components/user/ProfilHeaderComponent.vue";
import PostComponent from "../components/posts/PostComponent.vue";
const userStore = useUserStore();
const username = useRoute().params.username;
const userData = ref({});

onBeforeMount(async () => {
  const user = await userStore.getOne(username);
  userData.value = user;
  console.log(userData.value);
});
</script>

<style lang="scss" scoped>
main {
  @include fdCol-aiCt;
  @include width-height_max;
  row-gap: 20px;
  background-color: rgb(240, 240, 240);
  overflow-y: scroll;
}
// .posts {
//   @include fdCol-jcCt-aiCt;
//   max-width: 1000px;
//   width: 100%;
//   overflow: auto;
// }
</style>
