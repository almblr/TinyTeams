<template>
  <main class="main">
    <p
      class="main__text"
      v-if="post.content !== null && editingMode === false"
      ref="postContent"
    >
      {{ displayedContent }}
      <router-link :to="`/post/${props.post.id}`" v-if="showMoreButton">
        Voir plus
      </router-link>
    </p>
    <TextareaEditing
      v-else
      :postId="post.id"
      :content="post.content"
      v-model:show="editingMode"
      textareaType="post"
    />
    <div class="main__image">
      <img :src="post.imageUrl" v-if="post.imageUrl !== null" />
    </div>
    <div class="main__stats">
      <span>{{ post.reactions.length }}</span>
      <span class="likeBtn"> ❤ </span>
      <span class="main__stats__coms"
        >{{ post.comments.length }} commentaire(s)</span
      >
    </div>
    <div
      class="main__reactBtn"
      @click="updateLike(post.id, post.author, userLS.id)"
    >
      <ion-icon name="thumbs-up"></ion-icon>
      <span>J'aime</span>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { socket, state } from "../../socket.js";
import router from "@/router/index.js";
import useUserStore from "@/stores/userStore";
import usePostStore from "@/stores/postStore.js";
import TextareaEditing from "@/components/posts/TextareaEditing.vue";

const emit = defineEmits(["update:postToEdit"]);
const props = defineProps({
  post: { type: Object, required: true },
  postToEdit: Number,
});

const route = useRoute();
const postStore = usePostStore();
const userStore = useUserStore();
const userLS = JSON.parse(sessionStorage.getItem(`user`));
const editingMode = ref(false);
const showMoreButton = ref(false);
const thumbColor = ref(null);
const postContent = ref(null);
const doesUserLike = ref(null);

const displayedContent = computed(() => {
  if (
    props.post.content.length > 500 &&
    (route.name === "Feed" || route.name === "UserProfile")
  ) {
    showMoreButton.value = true;
    return props.post.content.substring(0, 500) + "...";
  }
  showMoreButton.value = false;
  return props.post.content;
});

/* Met à jour le like d'un post et l'affichage des posts */
const updateLike = async () => {
  if (!doesUserLike.value) {
    const like = await postStore.likePost(props.post.id);
    socket.emit("newLike", {
      senderId: userLS.id,
      senderUsername: `${userLS.firstname} ${userLS.lastname}`,
      senderProfilePicture: userLS.profilePicture,
      type: "newLike",
      notifiableId: like.id,
      postId: props.post.id,
      receiver: props.post.author,
      token: userStore.token,
    });
    doesUserLike.value = true;
  } else {
    await postStore.likePost(props.post.id);
    doesUserLike.value = false;
  }
};

watch(
  () => props.postToEdit,
  async (newVar) => {
    if (newVar === props.post.id) {
      editingMode.value = true;
    }
  }
);

watch(
  () => doesUserLike.value,
  (newValue) => {
    newValue
      ? (thumbColor.value = "#2374e1")
      : (thumbColor.value = "#85858580");
  }
);

watch(editingMode, () => {
  emit("update:postToEdit", null);
});

onBeforeMount(() => {
  const thisPost = postStore.posts.find((post) => post.id === props.post.id);
  const postReactions = thisPost.reactions;
  doesUserLike.value = postReactions.find((like) => like.userId === userLS.id)
    ? true
    : false;
  doesUserLike.value ? "#2374e1" : "#85858580";
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
    & > a {
      border: none;
      background: none;
      text-decoration: none;
      font-size: 0.9rem;
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
