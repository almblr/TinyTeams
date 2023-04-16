<template>
  <div class="file__label" title="Insérez une image">
    <label id="custom-label"
      ><ion-icon name="camera"></ion-icon>
      <input
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        @input="GetUploadedImg($event)"
      />
    </label>
  </div>
</template>

<script setup>
const emit = defineEmits(["showUploadedImg"]);
const props = defineProps({
  color: {
    type: String,
  },
});

const GetUploadedImg = (event) => {
  const blop = URL.createObjectURL(event.target.files[0]);
  const file = event.target.files[0];
  emit("showUploadedImg", blop, file);
  event.target.value = "";
};
</script>

<style lang="scss" scoped>
input[type="file"] {
  display: none;
}
label {
  @include jcCt-aiCt;
  font-size: 1.5rem;
  color: v-bind("props.color");
  cursor: pointer;
  width: 30px;
  height: 25px;
  border-radius: 5px;
  &:hover {
    background-color: var(--addMediaBackground);
  }
}
</style>
