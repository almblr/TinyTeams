<template>
  <section class="commentsSection">
    <div
      class="commentsSection__comment"
      v-if="comments"
      v-for="comment in comments"
      :key="comment.id"
      :id="comment.id"
    >
      <profilePicture
        :url="comment.user.profilePicture"
        width="35px"
        height="35px"
      />
      <CommentPost
        :author="comment.author"
        :postId="comment.postId"
        :commentId="comment.id"
        :imageUrl="comment.imageUrl"
        :content="comment.content"
        v-model:selectedCommentId="selectedCommentId"
        :firstname="comment.user.firstname"
        :lastname="comment.user.lastname"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import profilePicture from "@/components/layout/profilePicture.vue";
import CommentPost from "@/components/posts/CommentPost.vue";

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
