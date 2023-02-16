<template>
  <textarea
    :id="props.commentId"
    v-show="props.show"
    v-model="textareaContent"
    ref="textarea"
    @keydown.enter="updateComment()"
    @keydown.esc="emit('update:show', false)"
  ></textarea>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePostStore, useCommentStore } from "../../stores";

const emit = defineEmits(["update:show"]);
const props = defineProps({
  show: Boolean,
  postId: Number,
  commentId: Number,
  content: String,
});

const locStr = JSON.parse(localStorage.getItem(`userInfo`));
const token = locStr.token;
const postStore = usePostStore();
const commentStore = useCommentStore();
const textarea = ref(null);
const textareaContent = ref(props.content);

const focusInput = () => {
  textarea.value.focus();
};

const updateComment = async () => {
  const formData = new FormData();
  formData.append("content", textareaContent.value);
  await commentStore.updateOne(props.postId, props.commentId, formData, token);
  await postStore.getOne(token, props.postId);
  emit("update:show", false);
};

onMounted(() => {
  focusInput();
});
</script>
<style lang="scss" scoped>
textarea {
  border: none;
  outline: none;
  border-radius: 5px;
  background-color: rgb(241, 241, 241);
  padding-left: 5px;
  resize: none;
  height: 25px;
}
</style>
