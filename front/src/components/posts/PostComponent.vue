<template>
  <article v-for="post of props.posts" :key="post.id" :id="post.id">
    <PostHeaderComponent
      :author="post.author"
      :postId="post.id"
      :imageUrl="post.user.profilPicture"
      :firstname="post.user.firstname"
      :lastname="post.user.lastname"
      :createdAt="post.createdAt"
      @editPost="modifyPost"
    />
    <PostMainComponent
      :postId="post.id"
      :author="post.author"
      :postContent="post.content"
      :postImage="post.imageUrl"
      :postReactions="post.reactions"
      :postComments="post.comments"
      v-model:postToEdit="getPostId"
    />
    <DividerComponent width="98%" height="1px" backgroundColor="#c0c2c4" />
    <PostFooterComponent
      :postId="post.id"
      :profilPicture="post.user.profilPicture"
      :postComments="[...post.comments]"
    />
  </article>
</template>

<script setup>
import { ref } from "vue";
import PostHeaderComponent from "./PostHeaderComponent.vue";
import PostMainComponent from "./PostMainComponent.vue";
import DividerComponent from "../layout/DividerComponent.vue";
import PostFooterComponent from "./postFooterComponent.vue";

const props = defineProps({
  posts: Array,
});

const getPostId = ref(null);
const modifyPost = (postId) => {
  getPostId.value = postId;
};
</script>

<style lang="scss" scoped>
article {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  max-width: 700px;
  min-width: 260px;
  border-radius: 10px;
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.2);
}

input[type="file"] {
  display: none;
}
</style>
