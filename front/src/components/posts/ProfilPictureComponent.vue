<template>
  <img :src="props.url" />
</template>

<script setup>
const props = defineProps({
  url: { type: String, required: true },
  width: String,
  height: String,
});
</script>

<style lang="scss" scoped>
img {
  width: v-bind("props.width");
  height: v-bind("props.height");
  border-radius: 25px;
  object-fit: cover;
  &:hover {
    cursor: pointer;
  }
}
</style>
