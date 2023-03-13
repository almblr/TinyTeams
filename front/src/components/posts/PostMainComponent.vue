<template>
  <main class="main">
    <p class="main__text" v-if="postContent !== null && editingMode === false">
      {{ postContent }}
    </p>
    <TextareaEditingComponent
      v-else
      :postId="props.postId"
      :content="props.postContent"
      v-model:show="editingMode"
      textareaType="post"
    />
    <div class="main__image">
      <img :src="postImage" v-if="postImage !== null" />
    </div>
    <div class="main__stats">
      <span>{{ postReactions.length }}</span>
      <span
        ref="likeBtn"
        :class="{
          emptyHeart: checkLikeState(postId) === true,
          coloredHeart: checkLikeState(postId) === false,
        }"
      >
        ❤
      </span>
      <span class="main__stats__coms"
        >{{ postComments.length }} commentaire(s)</span
      >
    </div>
    <div
      class="main__reactBtn"
      @click="updateLike(postId, props.author, userId)"
    >
      <fa
        icon="fa-solid fa-thumbs-up"
        :class="{
          emptylikeBtn: checkLikeState(postId) === true,
          coloredLikeBtn: checkLikeState(postId) === false,
        }"
      />
      <span>J'aime</span>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from "vue";
import { usePostStore, useLikeStore } from "../../stores/index.js";
import TextareaEditingComponent from "./TextareaEditingComponent.vue";
import socket from "../../services/socketio.js";

const postStore = usePostStore();
const likeStore = useLikeStore();
const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const userId = sesStr.userId;
const likeBtn = ref(null);
const editingMode = ref(false);

const emit = defineEmits(["update:postToEdit"]);
const props = defineProps({
  postId: Number,
  author: Number,
  postContent: String,
  postImage: String,
  postReactions: Array,
  postComments: Array,
  postToEdit: Number,
});

/* Permet de vérifier l'état du like (exploiter dans le changement de style de l'icone like) */
const checkLikeState = (postId) => {
  const thisPost = postStore.posts.find((post) => post.id === postId);
  const postReactions = thisPost.reactions;
  const doesUserLike = postReactions.find((react) => react.userId === userId);
  if (doesUserLike === undefined) {
    return true;
  } else {
    return false;
  }
};

/* Met à jour le like d'un post et l'affichage des posts */
const updateLike = async (postId, author, liker) => {
  const thisPost = postStore.posts.find((post) => post.id === postId);
  const postReactions = thisPost.reactions;
  const doesUserLike = postReactions.find((react) => react.userId === userId);
  if (doesUserLike === undefined) {
    await likeStore.likePost(postId);
    await postStore.getOne(postId);
    if (liker !== author) {
      socket.emit("sendLike", {
        postId: postId,
        author: author,
        likerId: userId,
        likerName: sesStr.userName,
      });
    }

    return true;
  } else {
    await likeStore.likePost(postId);
    await postStore.getOne(postId);
    return false;
  }
};

watch(
  () => props.postToEdit,
  async (newVar) => {
    if (newVar === props.postId) {
      editingMode.value = true;
    }
  }
);

watch(editingMode, () => {
  emit("update:postToEdit", null);
});
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5px;
  &__text {
    font-size: 18px;
    min-width: 100%;
    overflow-wrap: break-word;
    padding: 10px 15px;
  }
  &__image {
    width: 100%;
    max-height: 450px;
    background-color: rgb(0, 0, 0);
    margin-bottom: 5px;
    & img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  &__stats {
    display: flex;
    align-items: center;
    flex: 1;
    margin-left: 15px;
    gap: 3px;
    & span {
      font-size: 16px;
    }
  }
  &__reactBtn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 2px 7px;
    gap: 5px;
    border-radius: 5px;
    & .thumbsup {
      color: rgb(207, 49, 49);
    }
    &:hover {
      background-color: rgba(165, 165, 165, 0.192);
      cursor: pointer;
    }
    &:hover + .thumbsup {
      color: rgb(207, 49, 49);
    }
    & > span {
      font-size: 16px;
    }
  }
}

.emptylikeBtn,
.emptyHeart {
  font-size: 18px;
  transition: 0.3s;
  color: rgba(133, 133, 133, 0.507);
  &:hover {
    transition: 0.3s;
    cursor: pointer;
  }
}
.coloredLikeBtn,
.coloredHeart {
  font-size: 18px;
  transition: 0.3s;
  color: rgba(230, 54, 0, 0.95);
  &:hover {
    transition: 0.3s;
    cursor: pointer;
  }
}

.emptyHeart,
.coloredHeart {
  &:hover {
    cursor: initial !important;
  }
}
</style>
