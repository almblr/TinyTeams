<template>
  <div class="file__label" title="Insérez une image">
    <label id="custom-label"
      ><span v-if="route.name === 'Settings'">Modifier votre photo</span>
      <ion-icon v-else name="camera"></ion-icon>
      <input
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        @input="GetUploadedImg($event)"
      />
    </label>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
const emit = defineEmits(["showUploadedImg"]);
const props = defineProps({
  color: {
    type: String,
  },
});

const route = useRoute();

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
  width: v-bind('route.name === "Settings" ? "auto" : "30px"');
  height: 25px;
  border-radius: 5px;
  span {
    font-size: 1rem;
  }
  ion-icon {
    &:hover {
      background-color: var(--addMediaBackground);
    }
  }
}
</style>
