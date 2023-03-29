<template>
  <button class="button" :disabled="props.isDisabled">
    <span class="button__text">{{ props.text }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  isDisabled: {
    type: Boolean,
    required: false,
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.button {
  width: 100%;
  max-width: 300px;
  width: max-content;
  max-height: 40px;
  min-height: 40px;
  background: #2374e1;
  opacity: 0.9;
  box-shadow: 5px 4px 10px var(--shadowColor);
  border-radius: 30px;
  border: none;
  transition: 0.2s;
  padding: 5px 15px;
  &:hover {
    background: #1a79f5;
    opacity: 1;
    transition: 0.2s;
    cursor: pointer;
  }
  &:disabled {
    cursor: not-allowed;
  }
  &__text {
    font-weight: 700;
    font-size: 19px;
    text-align: center;
    color: #ffffff;
  }
}
</style>
