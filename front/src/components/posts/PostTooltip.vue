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
import { ref } from "vue";
import usePostStore from "@/stores/postStore.js";
import { vOnClickOutside } from "@vueuse/components";

const postStore = usePostStore();
const userLS = JSON.parse(sessionStorage.getItem(`user`));
const userId = userLS.id;
const btn = ref(null);
const spaceUp = ref(null);
const showTooltip = ref(null);
const postToModify = ref({});
const commentToModify = ref({});

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
  showTooltip.value === true ? (showTooltip.value = false) : null;
};

const modify = async (id) => {
  if (props.type === "post") {
    postToModify.value = postStore.posts.find((post) => post.id === id);
    emit("editPost", props.postId);
  }
  if (props.type === "comment") {
    const post = postStore.posts.find((post) => post.id === props.postId);
    commentToModify.value = post.comments.find((comment) => comment.id === id);
    showTooltip.value = false;
    emit("editComment");
  }
  closeTooltip();
};

const remove = async (postId, commentId) => {
  if (props.type === "post") {
    await postStore.deletePost(postId);
  }
  if (props.type === "comment") {
    await postStore.deleteComment(postId, commentId);
  }
};
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  top: v-bind("props.top");
  height: min-content;
  &:hover {
    cursor: pointer;
  }
  & > .icon {
    display: flex;
    align-items: center;
    gap: 1px;
    & > .dot {
      width: v-bind("props.dotSize");
      height: v-bind("props.dotSize");
      background: var(--textColorSecond);
      border-radius: 5px;
    }
  }
  & .tooltip {
    @include fdCol-aiCt;
    position: absolute;
    right: 0;
    z-index: 99;
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
      padding: 5px 0;
      &:hover {
        background: rgb(14, 14, 14);
      }
    }
  }
}
</style>
