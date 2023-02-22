<template>
  <textarea
    :class="{
      textareaComment: textareaType === 'comment',
      textareaPost: textareaType === 'post',
    }"
    :id="props.commentId ? props.commentId : props.postId"
    v-show="props.show"
    v-model="textareaContent"
    ref="textarea"
    @keydown.enter.exact="update()"
    @keydown.esc="emit('update:show', false)"
    @input="autoResize($event)"
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
  textareaType: String,
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

const update = async () => {
  const formData = new FormData();
  if (!textareaContent.value.trim()) {
    return;
  }
  formData.append("content", textareaContent.value);
  if (props.textareaType === "comment") {
    await commentStore.update(props.postId, props.commentId, formData, token);
    await postStore.getOne(token, props.postId);
  } else if (props.textareaType === "post") {
    await postStore.update(props.postId, formData, token);
    await postStore.getOne(token, props.postId);
  }
  emit("update:show", false);
};

const autoResize = (el) => {
  el.target.style.minHeight = `${el.target.scrollHeight}px`;
};
onMounted(() => {
  focusInput();
  textarea.value.style.minHeight = `${textarea.value.scrollHeight}px`;
});
</script>
<style lang="scss" scoped>
.textareaComment,
.textareaPost {
  border: none;
  outline: none;
  resize: none;
  min-height: none;
}

.textareaComment {
  border-radius: 5px;
  background-color: rgb(241, 241, 241);
  font-size: 1em;
  padding-left: 5px;
  margin-top: 2px;
}

.textareaPost {
  background-color: rgb(255, 255, 255);
  width: 100%;
  font-size: 1.1em;
  padding: 10px 15px;
}
</style>
