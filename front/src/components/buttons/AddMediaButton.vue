<template>
  <div class="file__label">
    <label id="custom-label"
      ><slot name="icon"> </slot>
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
  iconSize: String,
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
  font-size: v-bind("props.iconSize");
  color: var(--addMediaColor);
  cursor: pointer;
}
</style>
