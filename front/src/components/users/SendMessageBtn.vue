<template>
  <button @click="sendMessage(userId)">Envoyer un message</button>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});
</script>

<style lang="scss" scoped></style>
