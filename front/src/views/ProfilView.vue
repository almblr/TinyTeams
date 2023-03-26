<template>
  <div id="container" ref="posts">
    <TheHeaderComponent />
    <main>
      <ProfilCardComponent
        v-if="userStore.userProfil"
        :user="user"
        :loggedInUserProfile="loggedInUserProfile"
      />
      <PostComponent v-if="user" />
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
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
const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const usernameLS = sesStr.username;
const user = ref(null);
const loggedInUserProfile = ref(false);

const updateUser = async (username) => {
  const userFound = userStore.userProfil;
  userFound
    ? (user.value = userFound)
    : (user.value = await userStore.getOne(username));
  loggedInUserProfile.value = username === usernameLS;
};

watch(() => route.params.username, updateUser);
onMounted(() => updateUser(route.params.username));

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
