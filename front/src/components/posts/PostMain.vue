<template>
  <main class="main">
    <p class="main__text" v-if="postContent !== null && editingMode === false">
      {{ postContent }}
    </p>
    <TextareaEditing
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
      <span ref="likeBtn" class="likeBtn"> ❤ </span>
      <span class="main__stats__coms"
        >{{ postComments.length }} commentaire(s)</span
      >
    </div>
    <div
      class="main__reactBtn"
      @click="updateLike(postId, props.author, userId)"
    >
      <ion-icon name="thumbs-up"></ion-icon>
      <span>J'aime</span>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import usePostStore from "@/stores/postStore.js";
import useLikeStore from "@/stores/likeStore.js";
import { socket } from "@/socket.js";
import TextareaEditing from "@/components/posts/TextareaEditing.vue";

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

const postStore = usePostStore();
const likeStore = useLikeStore();
const userLS = JSON.parse(sessionStorage.getItem(`user`));
const userId = userLS.id;
const likeBtn = ref(null);
const editingMode = ref(false);
const thumbColor = ref("null");

const doesUserLike = computed(() => {
  const thisPost = postStore.posts.find((post) => post.id === props.postId);
  const postReactions = thisPost.reactions;
  const doesUserLike = postReactions.find((react) => react.userId === userId);
  if (doesUserLike === undefined) {
    return true;
  } else {
    return false;
  }
});

/* Met à jour le like d'un post et l'affichage des posts */
const updateLike = async () => {
  if (doesUserLike.value === true) {
    await likeStore.likePost(props.postId);
    // socket.emit("sendLike", {
    //   postId: props.postId,
    //   author: props.author,
    //   likerId: userId,
    //   likerName: userLS.userName,
    // });
    thumbColor.value = "#2374e1";
    return true;
  } else {
    thumbColor.value = "rgba(133, 133, 133, 0.5)";
    await likeStore.likePost(props.postId);
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

onMounted(() => {
  doesUserLike.value
    ? (thumbColor.value = "rgba(133, 133, 133, 0.5)")
    : (thumbColor.value = "#2374e1");
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
    color: var(--textColorMain);
  }
  &__image {
    width: 100%;
    max-height: 450px;
    margin-bottom: 5px;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &__stats {
    display: flex;
    align-items: center;
    flex: 1;
    margin-left: 15px;
    gap: 3px;
    color: var(--textColorSecond);
    & span {
      font-size: 16px;
    }
    & .likeBtn {
      font-size: 18px;
      transition: 0.3s;
      color: v-bind("thumbColor");
      transition: 0.3s;
      cursor: pointer;
    }
  }
  &__reactBtn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 5px 9px;
    margin-right: 10px;
    gap: 5px;
    color: var(--textColorSecond);
    border-radius: 5px;
    & .thumbsup {
      color: #2374e1;
    }
    &:hover {
      background-color: rgba(165, 165, 165, 0.192);
      cursor: pointer;
    }
    &:hover + .thumbsup {
      color: #2374e1;
    }
    & > span {
      font-size: 16px;
    }
  }
}
ion-icon {
  fill: v-bind("thumbColor");
}
</style>
