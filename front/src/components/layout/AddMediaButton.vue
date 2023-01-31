<template>
  <div
    class="file__label"
    :style="stylesComputed"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <label
      for="image-input"
      id="custom-label"
      ref="label"
      :style="{ color: styles.color }"
      ><fa icon="fa-solid fa-image" />
    </label>
  </div>
  <input
    ref="input"
    id="image-input"
    type="file"
    accept="image/png, image/jpg, image/jpeg"
    @change="showUploadedImg"
  />
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  styles: Object,
});

const input = ref(null);
const label = ref(null);
const image = ref(null);

const isHovered = ref(false);

const stylesComputed = computed(() => {
  return {
    width: props.styles.width,
    height: props.styles.height,
    backgroundColor:
      isHovered.value === true
        ? props.styles.backgroundColorHover
        : props.styles.backgroundColor,
  };
});

/* Affiche la preview du fichier (l'image) uploadé  */
const showUploadedImg = (event) => {
  image.value = URL.createObjectURL(event.target.files[0]);
  console.log(image.value);
  console.log(input.value.value);
};
</script>

<style lang="scss" scoped>
input[type="file"] {
  display: none;
}
.file__label {
  @include jcCt-aaCt;
  border-radius: 5px;
  transition: 0.2s;
  &:hover {
    opacity: 1;
    cursor: pointer;
    transition: 0.2s;
  }
  label {
    @include jcCt-aaCt;
    transition: 0.1s;
    font-size: 24px;

    &:hover {
      opacity: 1;
      cursor: pointer;
      transition: 0.1s;
    }
  }
}
</style>
