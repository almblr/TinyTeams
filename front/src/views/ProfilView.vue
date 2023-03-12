<template>
  <TheHeaderComponent />
  <main>
    <ProfilCardComponent
      :userId="user.id"
      :fullname="`${user.firstname} ${user.lastname}`"
      :username="user.username"
      :profilPictureUrl="user.profilPicture"
      :connectedUser="loggedInUserProfile"
      :v-model:isSubscribed="isSubscribed"
    />
    <PostComponent :posts="postStore.posts" />
  </main>
</template>

<script setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import { useUserStore, usePostStore, useFollowStore } from "../stores";
import { useRoute } from "vue-router";
import TheHeaderComponent from "../components/layout/TheHeaderComponent.vue";
import ProfilCardComponent from "../components/user/ProfilCardComponent.vue";
import PostComponent from "../components/posts/PostComponent.vue";
const locStr = JSON.parse(localStorage.getItem(`user`));
const usernameLS = locStr.username;
const userStore = useUserStore();
const postStore = usePostStore();
const followStore = useFollowStore();
const route = useRoute();
const user = ref({});
const loggedInUserProfile = ref(false);
const isSubscribed = ref(false);

const getUserInfos = async () => {
  user.value = await userStore.getOne(route.params.username);
  await postStore.getAll(user.value.id);
  if (route.params.username === usernameLS) {
    return (loggedInUserProfile.value = true);
  }
  const isFollowing = await followStore.getOne(user.value.id);
  isFollowing ? (isSubscribed.value = true) : null;
};

watch(
  () => isSubscribed.value,
  async (newValue) => {
    console.log(isSubscribed.value);
    await userStore.getOne(user.value.username);
  }
);
onMounted(() => {
  /* Même chose que faire un watch et un onMounted séparemment */
  watchEffect(() => {
    getUserInfos();
  });
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
