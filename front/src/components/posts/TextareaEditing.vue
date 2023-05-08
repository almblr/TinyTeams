<template>
  <textarea
    :class="{
      textareaComment: textareaType === 'comment',
      textareaPost: textareaType === 'post',
    }"
    :id="props.commentId ? props.commentId : props.postId"
    v-show="props.show"
    v-model="content"
    ref="textarea"
    @keydown.enter.exact="update()"
    @keydown.esc="emit('update:show', false)"
  ></textarea>
</template>

<script setup>
import { onMounted, computed } from "vue";
import usePostStore from "@/stores/postStore.js";
import { useTextareaAutosize } from "@vueuse/core";

const { textarea, input } = useTextareaAutosize();

const emit = defineEmits(["update:show"]);
const props = defineProps({
  show: Boolean,
  postId: Number,
  commentId: Number,
  content: String,
  textareaType: String,
});
const postStore = usePostStore();

const content = computed({
  get() {
    return props.content;
  },
  set(value) {
    input.value = value;
  },
});

const update = async () => {
  const formData = new FormData();
  if (!input.value.trim()) {
    return;
  }
  formData.append("content", input.value);
  if (props.textareaType === "comment") {
    await postStore.updateComment(props.postId, props.commentId, formData);
  } else if (props.textareaType === "post") {
    await postStore.updatePost(props.postId, formData);
  }
  emit("update:show", false);
};

onMounted(() => {
  textarea.value.focus();
  textarea.value.style.minHeight = `${textarea.value.scrollHeight}px`;
});
</script>
<style lang="scss" scoped>
.textareaComment,
.textareaPost {
  border: none;
  outline: none;
  resize: none;
  // min-height: none;
}

.textareaComment {
  font-size: 1em;
  padding-left: 5px;
  margin-top: 2px;
  border-radius: 5px;
  background-color: var(--textarea);
  color: var(--textColorMain);
  caret-color: var(--textColorMain);
}

.textareaPost {
  width: 100%;
  font-size: 1.1rem;
  padding: 10px 15px 0 15px;
  color: var(--textColorMain);
  background-color: var(--backgroudMain);
  caret-color: var(--textColorMain);
}
</style>
