<template>
  <div
    class="btn"
    ref="btn"
    v-on-click-outside="closeTooltip"
    @click="calculateAvailableSpace"
  >
    <div class="icon" @click="showTooltip = !showTooltip">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <div class="tooltip" v-show="showTooltip === true">
      <span v-if="props.author === userId" @click="modify(props.postId)"
        >Modifier</span
      >
      <span @click="remove(props.postId, props.commentId)">Supprimer</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePostStore, useCommentStore } from "../../stores";
import { vOnClickOutside } from "@vueuse/components";
import { useRoute } from "vue-router";

const postStore = usePostStore();
const commentStore = useCommentStore();
const locStr = JSON.parse(localStorage.getItem(`user`));
const userId = locStr.userId;
const btn = ref(null);
const spaceUp = ref(null);
const showTooltip = ref(null);
const postToModify = ref({});
const commentToModify = ref({});
const userParams = useRoute().params.username || null;

const emit = defineEmits(["editPost", "editComment"]);
const props = defineProps({
  postId: Number,
  commentId: Number,
  author: Number,
  type: String,
  top: String,
  right: String,
  dotSize: String,
});

const calculateAvailableSpace = () => {
  const clientHeight = document.documentElement.clientHeight;
  const bottomToCenterBtn =
    clientHeight -
    btn.value.getBoundingClientRect().top -
    btn.value.style.width / 2;
  if (bottomToCenterBtn > clientHeight / 2) {
    spaceUp.value = false; // More space down
  } else {
    spaceUp.value = true; // More space up
  }
};

/* La directive du package v-click-outside-element agit quand on clique en dehors de l'élément. Mettre un if permet de ne pas spammer ces instructions */
const closeTooltip = () => {
  if (showTooltip.value === true) {
    showTooltip.value = false;
  }
};

const modify = async (id) => {
  if (props.type === "post") {
    postToModify.value = postStore.posts.find((post) => post.id === id);
    emit("editPost", props.postId);
    closeTooltip();
  }
  if (props.type === "comment") {
    commentToModify.value = commentStore.comments.find(
      (comment) => comment.id === id
    );
    showTooltip.value = false;
    emit("editComment");
  }
};

const remove = async (postId, commentId) => {
  if (props.type === "post") {
    await postStore.delete(postId);
    if (userParams) {
      // Si on est sur la page profil
      await postStore.getAll(props.author);
    } else {
      // Si on est sur la page d'acceuil
      await postStore.getAll();
    }
  }
  if (props.type === "comment") {
    await commentStore.delete(postId, commentId);
    await postStore.getAll();
  }
};
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  min-height: 15px;
  max-height: 15px;
  top: v-bind("props.top");
  &:hover {
    cursor: pointer;
  }
  & > .icon {
    min-height: 15px;
    display: flex;
    align-items: center;
    gap: 1px;
    & > .dot {
      width: v-bind("props.dotSize");
      height: v-bind("props.dotSize");
      background: rgb(39, 36, 36);
      border-radius: 5px;
    }
  }
  & .tooltip {
    @include fdCol-aiCt;
    position: absolute;
    right: 0;
    z-index: 999;
    background: black;
    margin-top: 3px;
    opacity: 0.8;
    border-radius: 5px;
    overflow: hidden; // Permet de ne pas ignorer les bordures au hover
    & > span {
      display: absolute;
      min-width: 100px;
      color: white;
      text-align: center;
      transition: 200ms;
      padding: 5px 0px;
      &:hover {
        background: rgb(14, 14, 14);
      }
    }
  }
}
</style>
