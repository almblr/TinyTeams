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

const userStore = useUserStore();
const postStore = usePostStore();
const route = useRoute();
const posts = ref(null);
const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const usernameLS = sesStr.username;
const user = ref(null);
const loggedInUserProfile = ref(false);

const getUser = async (username) => {
  user.value = await userStore.getOne(username);
  loggedInUserProfile.value = username === usernameLS;
};

watch(() => route.params.username, getUser);
onMounted(() => getUser(route.params.username));

useInfiniteScroll(
  posts,
  async () => {
    if (postStore.posts !== []) {
      const user = await userStore.getOne(route.params.username);
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
