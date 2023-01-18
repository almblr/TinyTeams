<template>
  <section class="commentsSection">
    <div
      class="commentsSection__myComment"
      v-if="data.myComment"
      v-for="comment in data.myComment"
      :key="comment.id"
      :id="comment.id"
    >
      <ProfilPicture :url="data.user.profilPicture" :width="40" :height="40" />
      <div>
        <h3 class="username">
          {{ data.user.firstName }} {{ data.user.lastName }}
        </h3>
        <p>{{ comment.content }}</p>
      </div>
    </div>
    <!-- <div
      class="commentsSection__othersComments"
      v-if="props.otherUsersComment"
      v-for="comment in props.otherComments"
    >
      <div class="post__profilPicture">
        <img :src="props.otherImages" alt="Photo de profil" />
      </div>
      <p>{{ props.otherContents }}</p>
    </div> -->
  </section>
</template>

<script setup>
import ProfilPicture from "./ProfilPictureComponent.vue";

const props = defineProps({
  postDataComments: Object,
});

const data = props.postDataComments;
</script>

<style lang="scss" scoped>
.commentsSection {
  display: flex;
  flex-direction: column;
  gap: 10px;
  &__myComment {
    display: flex;
    align-items: center;
    gap: 10px;
    & div {
      display: flex;
      flex-direction: column;
      min-width: 100px;
      height: min-content;
      border-radius: 25px;
      background-color: rgb(219, 219, 219);
      padding: 5px 15px;
      & h3 {
        font-size: 15px;
        color: rgba(0, 0, 0, 0.904);
      }
      & p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
