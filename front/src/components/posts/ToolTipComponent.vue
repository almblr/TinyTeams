<template>
  <div
    class="btn"
    ref="btn"
    v-on-click-outside="closeTooltip"
    @click="calculateAvailableSpace"
  >
    <div class="icon" @click="openTooltip">
      <fa icon="fa-solid fa-ellipsis" />
    </div>
    <div class="tooltip" v-show="isTooltipOpen === true">
      <span v-if="props.author === userId" @click="modify(props.postId)"
        >Modifier</span
      >
      <span @click="remove(props.postId, props.commentId, token)"
        >Supprimer</span
      >
    </div>
    <Teleport to="body">
      <post-modal
        :show="showModifyModal"
        @close="closeModifyModal"
        :modalType="'Modify'"
        :post="postToModify"
      >
      </post-modal>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { usePostStore, useCommentStore } from "../../stores";
import { vOnClickOutside } from "@vueuse/components";
import PostModal from "./PostModalComponent.vue";

const postStore = usePostStore();
const commentStore = useCommentStore();
const btn = ref(null);
const spaceUp = ref(null);
const isTooltipOpen = ref(false);
const locStr = JSON.parse(localStorage.getItem(`userInfo`));
const token = locStr.token;
const userId = locStr.userId;
const postToModify = ref({});
const commentToModify = ref({});
const showModifyModal = ref(false);

const emit = defineEmits(["editComment"]);
const props = defineProps({
  postId: Number,
  commentId: Number,
  author: Number,
  type: String,
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

const openTooltip = () => {
  isTooltipOpen.value = !isTooltipOpen.value;
};

/* La directive du package v-click-outside-element agit quand on clique en dehors de l'élément. Mettre un if permet de ne pas spammer ces instructions */
const closeTooltip = () => {
  if (isTooltipOpen.value === true) {
    isTooltipOpen.value = false;
  }
};

const closeModifyModal = async () => {
  showModifyModal.value = false;
  await postStore.getAll(token);
};

const modify = async (id) => {
  if (props.type === "post") {
    postToModify.value = postStore.posts.find((post) => post.id === id);
    showModifyModal.value = true;
    closeTooltip();
    await nextTick();
  }
  if (props.type === "comment") {
    commentToModify.value = commentStore.comments.find(
      (comment) => comment.id === id
    );
    emit("editComment");
    closeTooltip();
    await nextTick();
  }
};

const remove = async (postId, commentId, token) => {
  if (props.type === "post") {
    await postStore.deleteOne(id, token);
    await postStore.getAll(token);
  }
  if (props.type === "comment") {
    await commentStore.deleteOne(postId, commentId, token);
    await postStore.getAll(token);
  }
};
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  height: min-content;
  width: min-content;
  background-color: red;
  top: 5px;
  right: 5px;
  &:hover {
    cursor: pointer;
  }
  & > .icon {
    position: relative;
    font-size: 19px;
  }
}

.tooltip {
  @include fdCol-aiCt;
  position: absolute;
  right: 0px;
  z-index: 999;
  background: rgb(0, 0, 0);
  opacity: 0.8;
  border-radius: 5px !important;
  overflow: hidden; // Permet de ne pas ignorer les bordures au hover
  & > span {
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
</style>
