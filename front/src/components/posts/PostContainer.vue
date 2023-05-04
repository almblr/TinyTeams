<template>
  <span v-if="postStore.posts.length === 0 && !isLoading">
    {{ noPostMessage }}</span
  >
  <article
    v-if="!isLoading"
    v-for="post of postStore.posts"
    :key="post.id"
    :id="post.id"
  >
    <PostHeader :post="post" @editPost="modifyPost" />
    <PostMain :post="post" v-model:postToEdit="getPostId" />
    <BlockDivider width="98%" height="1px" />
    <PostFooter :post="post" />
  </article>
</template>

<script setup>
import { ref, onBeforeMount, computed, watch, nextTick } from "vue";
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
const isLoading = ref(true);

const noPostMessage = computed(() => {
  if (route.name === "Feed") {
    return "Il n'y a aucun post à afficher";
  } else {
    return "Cet utilisateur n'a pas encore publié de post";
  }
});

const modifyPost = (postId) => {
  getPostId.value = postId;
};

const getUsersPosts = async () => {
  await userStore.getOne(route.params.userId);
  postStore.posts.length = 0;
  await postStore.getAll(userStore.user.id);
  isLoading.value = false;
};

const getOnePost = async () => {
  const post = await postStore.getOne(route.params.postId);
  if (!post) {
    router.push(`/notfound/post/${route.params.postId}`);
  }
  postStore.posts.length = 0;
  postStore.posts.push(post);
  isLoading.value = false;
};

onBeforeMount(async () => {
  switch (route.name) {
    case "Feed":
      postStore.getAll();
      nextTick(() => {
        isLoading.value = false;
      });
      break;
    case "UserProfile":
      getUsersPosts();
      break;
    case "Post":
      getOnePost();
      break;
    default:
      break;
  }
});

watch(
  () => route.params,
  (newValue) => {
    if (newValue.userId) {
      isLoading.value = true;
      getUsersPosts();
    } else if (newValue.postId) {
      getOnePost();
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
  max-width: 768px;
  min-width: 356px;
  border-radius: 10px;
  background-color: var(--backgroundSecond);
  box-shadow: 5px 0 20px var(--shadowColor);
}

input[type="file"] {
  display: none;
}
</style>
