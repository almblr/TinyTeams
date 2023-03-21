<template>
  <div id="container" ref="posts">
    <TheHeaderComponent />
    <main>
      <ProfilCardComponent />
      <PostComponent />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore, usePostStore } from "../stores";
import { useInfiniteScroll } from "@vueuse/core";
import { useRoute } from "vue-router";
import TheHeaderComponent from "@/components/layout/TheHeaderComponent.vue";
import ProfilCardComponent from "@/components/user/ProfilCardComponent.vue";
import PostComponent from "@/components/posts/PostComponent.vue";

const userStore = useUserStore();
const postStore = usePostStore();
const route = useRoute();
const posts = ref(null);

useInfiniteScroll(
  posts,
  async () => {
    const user = await userStore.getOne(route.params.username);
    const lastPost = postStore.posts[postStore.posts.length - 1];
    const lastPostId = lastPost.id;
    await postStore.getAll(user.id, lastPostId);
  },
  {
    distance: 10,
  }
);
</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  overflow-y: scroll;
  position: relative;
}
main {
  @include fdCol-aiCt;
  width: 100%;
  min-height: 100%;
  row-gap: 20px;
  background-color: var(--backgroundMain);
  transition: 200ms;
}
// .posts {
//   @include fdCol-jcCt-aiCt;
//   max-width: 1000px;
//   width: 100%;
//   overflow: auto;
// }
</style>
