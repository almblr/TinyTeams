<template>
  <div class="container">
    <img :src="props.src" />
    <button @click="$emit('removeImage')">
      <fa icon="fa-solid fa-xmark" />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  src: String,
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  overflow: hidden;
  img {
    object-fit: cover;
    width: 100%;
    &:hover {
      filter: brightness(90%);
      cursor: pointer;
    }
  }
  button {
    @include jcCt-aiCt;
    position: absolute;
    top: 5px;
    right: 5px;
    width: 25px;
    height: 25px;
    transition: 200ms;
    font-size: 18px;
    border: none;
    border-radius: 3px;
    background-color: rgba(94, 89, 89, 0.418);
    color: rgba(255, 255, 255, 0.815);
    &:hover {
      cursor: pointer;
      background-color: rgba(94, 89, 89, 0.61);
    }
  }
}
</style>
