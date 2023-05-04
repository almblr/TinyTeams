<template>
  <header class="post__header" :id="post.id">
    <div class="post__header__user">
      <router-link
        :to="`/users/${post.user.id}`"
        class="post__header__user__pic"
      >
        <img :src="post.user.profilePicture" alt="Photo de profil" />
      </router-link>
      <div class="post__header__user__title">
        <router-link
          :to="`/users/${post.user.id}`"
          class="post__header__user__title__name"
        >
          <h2>{{ post.user.firstname }} {{ post.user.lastname }}</h2>
        </router-link>

        <span>Posté {{ dayjs().to(dayjs(post.createdAt)) }}</span>
      </div>
    </div>
    <PostTooltip
      :postId="post.id"
      :author="post.author"
      type="post"
      top="20px"
      dotSize="4px"
      v-if="post.author === user.id || user.isAdmin"
      @editPost="edit"
    />
  </header>
</template>

<script setup>
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import PostTooltip from "@/components/posts/PostTooltip.vue";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const emit = defineEmits(["editPost"]);
const props = defineProps({
  post: { type: Object, required: true },
});

const user = JSON.parse(sessionStorage.getItem(`user`));

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
  gap: 5px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: var(--headerBackground);
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
      padding-top: 4px;
      display: flex;
      gap: 1px;
      flex-direction: column;
      color: var(--textColorMain);
      &__name {
        text-decoration: none;
        h2 {
          font-size: 0.95rem;
          color: var(--textColorMain);
          &:hover {
            text-decoration: underline;
          }
        }
      }
      & span {
        font-size: 0.93rem;
      }
    }
  }
}
</style>
