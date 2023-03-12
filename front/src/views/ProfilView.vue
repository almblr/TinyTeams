<template>
  <TheHeaderComponent />
  <main>
    <ProfilCardComponent />
    <PostComponent :posts="postStore.posts" />
  </main>
</template>

<script setup>
import { onMounted } from "vue";
import { usePostStore } from "@/stores/index.js";
import { useRoute } from "vue-router";
import TheHeaderComponent from "@/components/layout/TheHeaderComponent.vue";
import ProfilCardComponent from "@/components/user/ProfilCardComponent.vue";
import PostComponent from "@/components/posts/PostComponent.vue";

const postStore = usePostStore();
const route = useRoute();

onMounted(async () => {
  await postStore.getAll(route.params.username);
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
