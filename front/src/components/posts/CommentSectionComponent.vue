<template>
  <section class="commentsSection">
    <div
      class="commentsSection__comment"
      v-if="comments"
      v-for="comment in comments"
      :key="comment.id"
      :id="comment.id"
    >
      <ProfilPicture
        :url="comment.user.profilPicture"
        width="35px"
        height="35px"
      />
      <CommentComponent
        :author="comment.author"
        :postId="comment.postId"
        :commentId="comment.id"
        :imageUrl="comment.imageUrl"
        :content="comment.content"
        v-model:selectedCommentId="selectedCommentId"
        :firstName="comment.user.firstName"
        :lastName="comment.user.lastName"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import ProfilPicture from "./ProfilPictureComponent.vue";
import CommentComponent from "./CommentComponent.vue";

const props = defineProps({
  comments: Array,
});

const selectedCommentId = ref(null);
</script>

<style lang="scss" scoped>
.commentsSection {
  display: flex;
  flex-direction: column;
  gap: 10px;
  &__comment {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
