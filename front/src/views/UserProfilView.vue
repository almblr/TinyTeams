<template>
  <div id="container" ref="posts">
    <TheHeader />
    <main v-if="!isLoading">
      <UserCardProfil :isFollowingYou="isFollowing" />
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
import useFollowStore from "@/stores/followStore.js";
import TheHeader from "@//components/layout/TheHeader.vue";
import UserCardProfil from "@/components/users/UserCardProfil.vue";
import PostContainer from "@/components/posts/PostContainer.vue";

const user = JSON.parse(sessionStorage.getItem(`user`));
const userStore = useUserStore();
const postStore = usePostStore();
const followStore = useFollowStore();
const route = useRoute();
const posts = ref(null);
const isLoading = ref(true);
const isFollowing = ref(false);

const getUser = async (id) => {
  await userStore.getOne(id);
  isFollowing.value = await followStore.getOneFollow(
    userStore.user.id,
    user.id
  );
  nextTick(() => {
    isLoading.value = false;
  });
};

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

watch(
  () => route.params.userId,
  (newValue) => {
    getUser(newValue);
  }
);

onBeforeMount(() => {
  getUser(route.params.userId);
});
</script>

<style lang="scss" scoped>
#container {
  @include container;
}
main {
  @include fdCol-aiCt;
  width: 100%;
  row-gap: 20px;
  transition: 200ms;
}
</style>
