<template>
  <div
    :style="{
      width: props.width,
      height: props.height,
      backgroundColor: props.backgroundColor,
    }"
  ></div>
</template>

<script setup>
const props = defineProps({
  width: String,
  height: String,
  backgroundColor: String,
});
</script>

<style lang="scss" scoped></style>
