<template>
  <div class="imagePreview" v-if="props.src">
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
.imagePreview {
  position: relative;
  img {
    width: 100%;
  }
  button {
    @include jcCt-aiCt;
    position: absolute;
    top: 5px;
    right: 5px;
    width: 25px;
    height: 25px;
    background-color: rgba(255, 0, 0, 0.411);
    font-size: 18px;
    border: none;
    color: rgba(255, 255, 255, 0.815);
    border-radius: 3px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
