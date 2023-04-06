<template>
  <main class="main">
    <p class="main__text" v-if="postContent !== null && editingMode === false">
      {{ displayedContent }}
      <button @click="showMore" v-if="showMoreButton">Voir plus</button>
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
      @click="updateLike(postId, props.author, userLS.id)"
    >
      <ion-icon name="thumbs-up"></ion-icon>
      <span>J'aime</span>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import router from "@/router/index.js";
import usePostStore from "@/stores/postStore.js";
import useLikeStore from "@/stores/likeStore.js";
import { socket, state } from "../../socket.js";
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

const route = useRoute();
const postStore = usePostStore();
const likeStore = useLikeStore();
const userLS = JSON.parse(sessionStorage.getItem(`user`));
const token = JSON.parse(sessionStorage.getItem(`token`));
const postContent = ref(props.postContent);
const likeBtn = ref(null);
const editingMode = ref(false);
const thumbColor = ref("null");
const displayedContent = ref("");
const showMoreButton = ref(false);

const showMore = () => {
  if (route.name === "Feed") {
    router.push(`/post/${props.postId}`);
  }
  displayedContent.value = postContent.value;
  showMoreButton.value = false;
};

const doesUserLike = computed(() => {
  const thisPost = postStore.posts.find((post) => post.id === props.postId);
  const postReactions = thisPost.reactions;
  const doesUserLike = postReactions.find(
    (react) => react.userId === userLS.id
  );
  if (doesUserLike === undefined) {
    return true;
  } else {
    return false;
  }
});

/* Met à jour le like d'un post et l'affichage des posts */
const updateLike = async () => {
  if (doesUserLike.value === true) {
    const like = await likeStore.likePost(props.postId);
    socket.emit("newLike", {
      senderId: userLS.id,
      senderUsername: userLS.username,
      senderProfilePicture: userLS.ProfilePicture,
      type: "newLike",
      notifiableId: like.id,
      post: props.postId,
      receiver: props.author,
      token,
    });
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

watch(
  () => state.newLike[0],
  async (newValue) => {
    console.log(newValue);
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

onMounted(() => {
  if (router.options.history.state.back === "/feed") {
    return (displayedContent.value = postContent.value);
  }
  if (postContent.value.length > 500) {
    showMoreButton.value = true;
    return (displayedContent.value = postContent.value.slice(0, 500) + "...");
  }
  displayedContent.value = postContent.value.slice(0, 500);
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
    & > button {
      border: none;
      background: none;
      color: var(--textColorMain);
      font-weight: bold;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
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
