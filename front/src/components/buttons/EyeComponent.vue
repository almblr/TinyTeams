<template>
  <fa
    icon="fa-solid fa-eye"
    class="eye"
    :class="{
      'red-first': props.type === 'password',
      'red-snd': props.type === 'text',
    }"
    @click="props.click"
  />
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  click: {
    type: Function,
  },
});
</script>

<style lang="scss" scoped>
.eye {
  position: absolute;
  width: 30px;
  height: 23px;
  top: 12px;
  right: 7px;
  transition: 150ms;
  &:hover {
    transition: 150ms;
    cursor: pointer;
  }
}

.red-first {
  color: rgba(218, 67, 67, 0.534);
}
.red-snd {
  color: rgba(218, 67, 67, 0.999);
}
</style>
