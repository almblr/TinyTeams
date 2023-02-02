<template>
  <div class="file__label">
    <label for="image-input" id="custom-label" ref="label"
      ><slot name="icon"></slot>
    </label>
  </div>
  <input
    ref="input"
    id="image-input"
    type="file"
    accept="image/png, image/jpg, image/jpeg"
    @change="GetUploadedImg($event)"
  />
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  width: String,
  height: String,
  color: String,
  backgroundColor: String,
  backgroundColorHover: String,
});
const emit = defineEmits(["showUploadedImg"]);

const input = ref(null);
const label = ref(null);

/* Affiche la preview du fichier (l'image) uploadé  */
const GetUploadedImg = (event) => {
  const blop = URL.createObjectURL(event.target.files[0]);
  const file = input.value.files[0];
  emit("showUploadedImg", blop, file);
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
  width: v-bind("props.width");
  height: v-bind("props.height");
  background-color: v-bind("props.backgroundColor");
  &:hover {
    opacity: 1;
    cursor: pointer;
    transition: 0.2s;
    background-color: v-bind("props.backgroundColorHover");
  }
  label {
    @include jcCt-aaCt;
    transition: 0.1s;
    font-size: 24px;
    color: v-bind("props.color");

    &:hover {
      opacity: 1;
      cursor: pointer;
      transition: 0.1s;
    }
  }
}
</style>
