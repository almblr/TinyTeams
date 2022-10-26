<template>
  <button :type="type">
    <span>{{ text }}</span>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
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
  max-height: 50px;
  min-height: 50px;
  background: #ff2a00f5;
  opacity: 0.9;
  box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: none;
  transition: 0.2s;
  & > span {
    font-weight: 700;
    font-size: 22px;
    text-align: center;
    color: #ffffff;
  }
  &:hover {
    background: #fd2d01;
    opacity: 1;
    transition: 0.2s;
    box-shadow: 5px 4px 7px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
}

@media all and (max-width: 480px) {
}
</style>
