<template>
  <span v-if="postStore.posts === 0"> {{ noPostMessage }}</span>
  <article v-else v-for="post of postStore.posts" :key="post.id" :id="post.id">
    <PostHeader :post="post" @editPost="modifyPost" />
    <PostMain :post="post" v-model:postToEdit="getPostId" />
    <BlockDivider width="98%" height="1px" />
    <PostFooter :post="post" />
  </article>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index.js";
import usePostStore from "@/stores/postStore.js";
import useUserStore from "@/stores/userStore.js";
import BlockDivider from "@//components/layout/BlockDivider.vue";
import PostHeader from "@/components/posts/PostHeader.vue";
import PostMain from "@/components/posts/PostMain.vue";
import PostFooter from "@/components/posts/PostFooter.vue";

const postStore = usePostStore();
const userStore = useUserStore();
const route = useRoute();
const article = ref(null);
const getPostId = ref(null);

const noPostMessage = computed(() => {
  if (route.name === "Feed") {
    return "Il n'y a aucun post à afficher";
  }
  if (route.name === "UserProfil") {
    return "Cet utilisateur n'a pas encore publié de post";
  }
});

const modifyPost = (postId) => {
  getPostId.value = postId;
};

onMounted(async () => {
  if (route.params.username) {
    const user = await userStore.getOne(route.params.username);
    postStore.posts.length = 0;
    return await postStore.getAll(user.id);
  }
  if (route.params.postId) {
    const post = await postStore.getOne(route.params.postId);
    if (!post) {
      router.push(`/notfound/post/${route.params.postId}`);
    }
    // postStore.posts.length = 0;
    // return postStore.posts.push(post);
  }
  await postStore.getAll();
});

watch(
  () => route.params.username,
  async (newValue) => {
    if (newValue) {
      const user = await userStore.getOne(route.params.username);
      postStore.posts.length = 0;
      return await postStore.getAll(user.id);
    }
  }
);
watch(
  () => route.params.postId,
  async (newValue) => {
    if (newValue) {
      const post = await postStore.getOne(route.params.postId);
      console.log(post);
      // postStore.posts.length = 0;
      // postStore.posts.push(post);
    }
  }
);
</script>

<style lang="scss" scoped>
span {
  color: var(--placeholder);
  font-size: 1.2em;
  font-style: italic;
}
article {
  @include fdCol-jcCt-aiCt;
  position: relative;
  width: 95%;
  max-width: 700px;
  min-width: 260px;
  border-radius: 10px;
  background-color: var(--backgroundSecond);
  box-shadow: 5px 0px 20px var(--shadowColor);
}

input[type="file"] {
  display: none;
}
</style>
