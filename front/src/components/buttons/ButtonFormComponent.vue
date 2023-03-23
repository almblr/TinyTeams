<template>
  <button :type="props.buttonType">
    <span>{{ props.text }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  buttonType: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
button {
  width: 100%;
  max-width: 200px;
  max-height: 40px;
  min-height: 40px;
  background: #2374e1;
  opacity: 0.9;
  box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: none;
  transition: 0.2s;
  & > span {
    font-weight: 700;
    font-size: 19px;
    text-align: center;
    color: #ffffff;
  }
  &:hover {
    background: #1a79f5;
    opacity: 1;
    transition: 0.2s;
    box-shadow: 5px 4px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
}
</style>
