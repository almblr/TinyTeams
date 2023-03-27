<template>
  <input
    :type="props.type"
    :value="props.value"
    :placeholder="props.placeholder"
    :readonly="!props.canBeModified"
  />
</template>

<script setup>
const props = defineProps({
  type: { type: String, required: true },
  value: { type: String, required: true },
  placeholder: { type: String, required: true },
  canBeModified: { type: Boolean, required: true },
});
</script>

<style lang="scss" scoped>
@import "@/scss/inputStyle.scss";

input[readonly] {
  cursor: not-allowed;
  background-color: rgba(80, 79, 79, 0.178);
}
</style>
