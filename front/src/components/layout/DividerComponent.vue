<template>
  <div
    :style="{
      width: props.width,
      height: props.height,
    }"
  ></div>
</template>

<script setup>
const props = defineProps({
  width: String,
  height: String,
});
</script>

<style lang="scss" scoped>
div {
  background-color: var(--colorDivider);
}
</style>
