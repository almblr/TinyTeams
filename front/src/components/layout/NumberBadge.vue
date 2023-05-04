<template>
  <div v-if="unread > 0">
    {{ unread }}
  </div>
</template>

<script setup>
const props = defineProps({
  unread: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss" scoped>
div {
  @include jcCt-aiCt;
  width: 17px;
  height: 17px;
  position: absolute;
  top: -2px;
  right: -3px;
  font-size: 0.8rem;
  background-color: red;
  border-radius: 99px;
}
</style>
