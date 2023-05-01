<template>
  <div id="container" ref="posts">
    <TheHeader />
    <main>
      <UserCardProfil
        v-if="user !== null"
        :user="user"
        :loggedInUserProfile="loggedInUserProfile"
      />
      <PostContainer v-if="user" />
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { useRoute } from "vue-router";
import useUserStore from "@/stores/userStore.js";
import usePostStore from "@/stores/postStore.js";
import TheHeader from "@//components/layout/TheHeader.vue";
import UserCardProfil from "@/components/users/UserCardProfil.vue";
import PostContainer from "@/components/posts/PostContainer.vue";

const userLS = JSON.parse(sessionStorage.getItem(`user`));
const userStore = useUserStore();
const postStore = usePostStore();
const route = useRoute();
const posts = ref(null);
const user = ref(null);
const loggedInUserProfile = ref(false);

const getUser = async (id) => {
  user.value = await userStore.getOne(id);
  loggedInUserProfile.value = parseInt(id) === userLS.id;
};

watch(() => route.params.userId, getUser);
onMounted(() => getUser(route.params.userId));

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
// .posts {
//   @include fdCol-jcCt-aiCt;
//   max-width: 1000px;
//   width: 100%;
//   overflow: auto;
// }
</style>
