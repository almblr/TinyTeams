<template>
  <section class="commentsSection">
    <div
      class="commentsSection__myComment"
      v-if="comments"
      v-for="comment in comments"
      :key="comment.id"
      :id="comment.id"
    >
      <ProfilPicture
        :url="comment.user.profilPicture"
        width="40px"
        height="40px"
      />
      <CommentComponent
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

const locStr = JSON.parse(localStorage.getItem(`userInfo`));

const props = defineProps({
  comments: Array,
});

const selectedCommentId = ref(null);
const userProfilpicture = locStr.profilPicture;
</script>

<style lang="scss" scoped>
.commentsSection {
  display: flex;
  flex-direction: column;
  gap: 10px;
  &__myComment,
  &__othersComments {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    & div {
      display: flex;
      flex-direction: column;
      min-width: 100px;
      height: min-content;
      border-radius: 10px;
      background-color: rgb(219, 219, 219);
      padding: 5px 10px 5px 10px;
      & header {
        display: flex;
        & h3 {
          font-size: 15px;
          color: rgba(0, 0, 0, 0.904);
          &:hover {
            cursor: pointer;
          }
        }
      }

      & p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      & img {
        margin: 5px 0;
        max-width: 500px;
      }
    }
  }
}
</style>
