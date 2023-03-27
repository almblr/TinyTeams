<template>
  <div class="divider"></div>
</template>

<script setup>
const props = defineProps({
  width: String,
  height: String,
});
</script>

<style lang="scss" scoped>
.divider {
  background-color: var(--colorDivider);
  width: v-bind("props.width");
  height: v-bind("props.height");
}
</style>
