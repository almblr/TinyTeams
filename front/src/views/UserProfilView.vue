<template>
  <div id="container" ref="posts">
    <TheHeader />
    <main v-if="!isLoading">
      <UserCardProfil />
      <PostContainer />
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount, nextTick } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { useRoute } from "vue-router";
import useUserStore from "@/stores/userStore.js";
import usePostStore from "@/stores/postStore.js";
import TheHeader from "@//components/layout/TheHeader.vue";
import UserCardProfil from "@/components/users/UserCardProfil.vue";
import PostContainer from "@/components/posts/PostContainer.vue";

const userStore = useUserStore();
const postStore = usePostStore();
const route = useRoute();
const posts = ref(null);
const isLoading = ref(true);

const getUser = async (id) => {
  await userStore.getOne(id);
  nextTick(() => {
    isLoading.value = false;
  });
};

watch(() => route.params.userId, getUser);
onBeforeMount(() => getUser(route.params.userId));

useInfiniteScroll(
  posts,
  async () => {
    if (postStore.posts.length !== 0) {
      const user = await userStore.getOne(route.params.userId);
      const lastPostId = postStore.posts[postStore.posts.length - 1].id;
      await postStore.getAll(user.id, lastPostId);
    }
  },
  {
    distance: 10,
  }
);
</script>

<style lang="scss" scoped>
#container {
  height: 100vh;
  overflow-y: auto;
  background-color: var(--backgroundMain);
}
main {
  @include fdCol-aiCt;
  width: 100%;
  row-gap: 20px;
  transition: 200ms;
}
</style>
