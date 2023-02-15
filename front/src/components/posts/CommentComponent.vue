<template>
  <div>
    <header>
      <h3>{{ props.firstName }} {{ props.lastName }}</h3>
      <ToolTipComponent
        :commentId="props.commentId"
        type="comment"
        :author="props.author"
        @editComment="modify"
      />
    </header>
    <p v-if="!editingMode">{{ props.content }}</p>
    <TextareaEditingComponent
      v-else
      :postId="props.postId"
      :commentId="props.commentId"
      :content="props.content"
      v-model:show="editingMode"
    />
    <span v-if="editingMode" @click="editingMode = false">Annuler</span>
    <img :src="props.imageUrl" v-if="props.imageUrl" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
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
  firstName: String,
  lastName: String,
});

const editingMode = ref(false);

const modify = () => {
  emit("update:selectedCommentId", props.commentId);
  editingMode.value = true;
};

watch(
  () => props.selectedCommentId,
  (newValue) => {
    editingMode.value = newValue === props.commentId;
  }
);
</script>

<style lang="scss" scoped>
div {
  display: flex;
  flex-direction: column;
  min-width: 100px;
  height: min-content;
  border-radius: 10px;
  background-color: rgb(219, 219, 219);
  padding: 5px 10px 5px 10px;
  & > header {
    display: flex;
    position: relative;
    min-width: 100%;
    border: 1px solid blue;
    & h3 {
      font-size: 15px;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      color: rgba(0, 0, 0, 0.904);
      &:hover {
        cursor: pointer;
      }
    }
  }
  & p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
