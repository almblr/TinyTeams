<template>
  <textarea
    :id="props.commentId"
    v-show="props.show"
    v-model="textareaContent"
    ref="textarea"
  ></textarea>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  show: Boolean,
  commentId: Number,
  content: String,
});
const textareaContent = ref(props.content);
</script>
<style lang="scss" scoped>
textarea {
  border-radius: 5;
  resize: none;
}
</style>
