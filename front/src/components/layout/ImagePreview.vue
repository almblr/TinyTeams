<template>
  <div class="container">
    <img :src="props.src" />
    <button @click="$emit('removeImage')">
      <ion-icon name="close-outline"></ion-icon>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  src: String,
  size: String,
});
</script>

<style lang="scss" scoped>
.container {
  @include width-height_max;
  position: relative;
  background-color: black;
  img {
    border-radius: 10px;
    width: 100%;
    object-fit: v-bind("props.size");
    background-color: rgb(0, 0, 0);
    &:hover {
      filter: brightness(90%);
      cursor: pointer;
    }
  }
  button {
    @include jcCt-aiCt;
    position: absolute;
    top: 10px;
    right: 10px;
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
