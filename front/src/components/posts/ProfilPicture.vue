<template>
  <img
    :src="props.url"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
  />
</template>

<script setup>
const props = defineProps({
  url: { type: String, required: true },
  alt: String,
  width: Number,
  height: Number,
});
</script>

<style lang="scss" scoped>
img {
  border-radius: 25px;
  object-fit: cover;
  &:hover {
    cursor: pointer;
  }
}
</style>
