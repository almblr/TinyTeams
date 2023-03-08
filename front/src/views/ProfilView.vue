<template>
  <TheHeaderComponent />
  <main>
    <ProfilHeaderComponent
      :username="username"
      :profilPictureUrl="userData.profilPicture"
    />
    <PostComponent :posts="postStore.posts" />
  </main>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useUserStore, usePostStore } from "../stores";
import { useRoute } from "vue-router";
import TheHeaderComponent from "../components/layout/TheHeaderComponent.vue";
import ProfilHeaderComponent from "../components/user/ProfilHeaderComponent.vue";
import PostComponent from "../components/posts/PostComponent.vue";
const userStore = useUserStore();
const postStore = usePostStore();
const userData = ref({});

const username = computed(() => {
  return `${userData.value.firstname} ${userData.value.lastname}`;
});

onBeforeMount(async () => {
  userData.value = await userStore.getOne(useRoute().params.username);
  await postStore.getAll(userData.value.id);
});
</script>

<style lang="scss" scoped>
main {
  @include fdCol-aiCt;
  width: 100%;
  height: 100vh;
  row-gap: 20px;
  padding-top: 50px;
  overflow-y: scroll;
  background-color: rgb(240, 240, 240);
}
// .posts {
//   @include fdCol-jcCt-aiCt;
//   max-width: 1000px;
//   width: 100%;
//   overflow: auto;
// }
</style>
