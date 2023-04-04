<template>
  <ion-icon name="eye" @click="switchInputType"></ion-icon>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["switchInputType"]);
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const color = ref("rgb(141, 141, 141)");

const switchInputType = () => {
  const newType = props.type === "password" ? "text" : "password";
  emit("switchInputType", newType);
  color.value === "rgb(141, 141, 141)"
    ? (color.value = "rgb(95, 92, 92)")
    : (color.value = "rgb(141, 141, 141)");
};
</script>

<style lang="scss" scoped>
ion-icon {
  position: absolute;
  top: 9px;
  right: 7px;
  transition: 150ms;
  font-size: 29px;
  fill: v-bind("color");
  &:hover {
    transition: 150ms;
    cursor: pointer;
  }
}
</style>
