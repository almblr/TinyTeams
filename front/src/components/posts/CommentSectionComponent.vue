<template>
  <section class="commentsSection">
    <div
      class="commentsSection__myComment"
      v-if="userComments"
      v-for="comment in userComments"
      :key="comment.id"
      :id="comment.id"
    >
      <ProfilPicture :url="userProfilpicture" width="40px" height="40px" />
      <div>
        <h3 class="username">{{ userName }}</h3>
        <p>{{ comment.content }}</p>
        <img :src="comment.imageUrl" v-if="comment.imageUrl" />
      </div>
    </div>
    <div
      class="commentsSection__othersComments"
      v-if="othersComments"
      v-for="comment in othersComments"
    >
      <ProfilPicture
        :url="comment.user.profilPicture"
        width="40px"
        height="40px"
      />
      <div>
        <h3 class="username">
          {{ comment.user.firstName }} {{ comment.user.lastName }}
        </h3>
        <p>{{ comment.content }}</p>
        <img :src="comment.imageUrl" v-if="comment.imageUrl" />
      </div>
    </div>
  </section>
</template>

<script setup>
import ProfilPicture from "./ProfilPictureComponent.vue";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const locStr = JSON.parse(localStorage.getItem(`userInfo`));
const userName = locStr.userName;
const userProfilpicture = locStr.profilPicture;

const props = defineProps({
  userComments: Array,
  othersComments: Array,
});
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
      & h3 {
        font-size: 15px;
        color: rgba(0, 0, 0, 0.904);
        &:hover {
          cursor: pointer;
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
