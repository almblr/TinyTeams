<template>
  <header class="post__header" :id="props.postId">
    <div class="post__header__user">
      <router-link :to="`/users/${username}`" class="post__header__user__pic">
        <img :src="props.imageUrl" alt="Photo de profil" />
      </router-link>
      <div class="post__header__user__title">
        <h2>{{ props.firstname }} {{ props.lastname }}</h2>
        <span>Posté {{ dayjs().to(dayjs(props.createdAt)) }}</span>
      </div>
    </div>
    <ToolTipComponent
      :postId="props.postId"
      :author="props.author"
      type="post"
      top="7px"
      dotSize="4px"
      v-if="props.author === userId || userIsAdmin"
      @editPost="edit"
    />
  </header>
</template>

<script setup>
import ToolTipComponent from "./ToolTipComponent.vue";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const emit = defineEmits(["editPost"]);
const props = defineProps({
  author: { type: Number, required: true },
  postId: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  createdAt: { type: String, required: true },
});

const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const userId = sesStr.userId;
const userIsAdmin = sesStr.isAdmin;
const username = (props.firstname + props.lastname).toLowerCase();

const edit = (postId) => {
  emit("editPost", postId);
};
</script>

<style lang="scss" scoped>
.post__header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1% 3%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  &__user {
    display: flex;
    width: 100%;
    gap: 10px;
    overflow: hidden;
    & * {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &__pic {
      width: 50px;
      min-width: 50px;
      height: 50px;
      border-radius: 25px;
      & img {
        width: 100%;
        height: 100%;
        border-radius: 25px;
        object-fit: cover;
      }
    }
    &__title {
      display: flex;
      flex-direction: column;
      & h2 {
        font-size: 1em;
        margin-right: 5px;
      }
      & span {
        font-size: 1em;
      }
    }
  }
}
</style>
