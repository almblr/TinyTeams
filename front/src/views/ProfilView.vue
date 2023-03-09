<template>
  <TheHeaderComponent />
  <main>
    <ProfilCardComponent
      :userId="userData.id"
      :username="username"
      :profilPictureUrl="userData.profilPicture"
      :connectedUser="isSameUser"
      :isSubscribed="isSubscribed"
    />
    <PostComponent :posts="postStore.posts" />
  </main>
</template>

<script setup>
import { ref, onBeforeMount, computed, watch } from "vue";
import { useUserStore, usePostStore, useFollowStore } from "../stores";
import { useRoute } from "vue-router";
import TheHeaderComponent from "../components/layout/TheHeaderComponent.vue";
import ProfilCardComponent from "../components/user/ProfilCardComponent.vue";
import PostComponent from "../components/posts/PostComponent.vue";
const locStr = JSON.parse(localStorage.getItem(`user`));
const userName = locStr.userName;
const userStore = useUserStore();
const postStore = usePostStore();
const followStore = useFollowStore();
const route = useRoute();
const userData = ref({});
const isSameUser = ref(false);
const isSubscribed = ref(false);

const username = computed(() => {
  return `${userData.value.firstname} ${userData.value.lastname}`;
});

if (username === userName) {
  console.log("same person");
}
onBeforeMount(async () => {
  userData.value = await userStore.getOne(useRoute().params.username);
  await postStore.getAll(userData.value.id);
  if (username.value === userName) {
    isSameUser.value = true;
  }
  const isFollowing = await followStore.getOne(userData.value.id);
  if (isFollowing === true) {
    isSubscribed.value = true;
  }
});

watch(
  () => route.params.username,
  async (newValue) => {
    console.log(newValue);
    userData.value = await userStore.getOne(route.params.username);
    await postStore.getAll(userData.value.id);
    if (username.value === userName) {
      isSameUser.value = true;
      isSubscribed.value = true;
    }
    const isFollowing = await followStore.getOne(userData.value.id);
    if (isFollowing === true) {
      isSubscribed.value = true;
    } else {
      isSubscribed.value = true;
    }
  }
);
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
