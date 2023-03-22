<template>
  <div class="file__label">
    <label id="custom-label"
      ><slot name="icon"> </slot>
      <input
        class="toto"
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        @input="GetUploadedImg($event)"
      />
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  iconSize: String,
});
const emit = defineEmits(["showUploadedImg"]);
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
