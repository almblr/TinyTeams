<template>
  <div
    class="div"
    @mouseover="showTooltip = true"
    @mouseleave="showTooltip = false"
    ref="comment"
  >
    <header>
      <router-link :to="`/user/${usernameParam}`" class="title"
        >{{ props.firstname }} {{ props.lastname }}</router-link
      >
      <ToolTipComponent
        :commentId="props.commentId"
        :author="props.author"
        type="comment"
        top="3px"
        dotSize="4px"
        @editComment="modify"
        v-show="(props.author === userId || isAdmin) && editingMode === false"
      />
    </header>
    <p v-if="!editingMode">{{ props.content }}</p>
    <TextareaEditingComponent
      v-else
      :postId="props.postId"
      :commentId="props.commentId"
      :content="props.content"
      v-model:show="editingMode"
      textareaType="comment"
    />
    <span v-if="editingMode" @click="editingMode = false">Annuler</span>
    <img :src="props.imageUrl" v-if="props.imageUrl" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

import { useUserStore } from "../../stores";
import TextareaEditingComponent from "./TextareaEditingComponent.vue";
import ToolTipComponent from "./ToolTipComponent.vue";

const emit = defineEmits(["update:selectedCommentId"]);
const props = defineProps({
  author: Number,
  postId: Number,
  commentId: Number,
  content: String,
  imageUrl: String,
  selectedCommentId: Number,
  firstname: String,
  lastname: String,
});

const userStore = useUserStore();
const locStr = JSON.parse(localStorage.getItem(`user`));
const userId = locStr.userId;
const isAdmin = locStr.isAdmin;

const comment = ref(null);
const showTooltip = ref(false);
const editingMode = ref(false);
const username = props.firstname + props.lastname;
const usernameParam = username.split(" ").join("").toLowerCase();

const modify = () => {
  emit("update:selectedCommentId", props.commentId);
  editingMode.value = true;
  comment.value.style.flex = 1;
};

watch(
  () => props.selectedCommentId,
  (newValue) => {
    editingMode.value = newValue === props.commentId;
  }
);

watch(
  () => editingMode.value,
  (newValue) => {
    if (newValue === false) {
      comment.value.style.flex = "initial";
    }
  }
);
</script>

<style lang="scss" scoped>
.div {
  display: flex;
  flex-direction: column;
  min-width: 100px;
  height: min-content;
  border-radius: 10px;
  background-color: rgb(219, 219, 219);
  padding: 5px 10px 5px 10px;
  & > header {
    align-items: center;
    display: flex;
    position: relative;
    min-width: 100%;
    & > .title {
      font-size: 15px;
      font-weight: bold;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      margin-right: 10px;
      text-decoration: none;
      color: rgb(0, 0, 0);
      &:hover {
        cursor: pointer;
      }
    }
  }
  & p {
    overflow: hidden;
    height: 100%;
    word-break: break-all;
  }
  & img {
    margin: 5px 0;
    max-width: 500px;
  }
  & span {
    font-size: 11px;
    color: rgb(71, 71, 189);
    &:hover {
      cursor: pointer;
      color: rgb(33, 33, 224);
    }
  }
}
</style>
