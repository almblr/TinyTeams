<template>
  <div
    class="inputContainer"
    :class="{
      firstname: props.name === 'firstname',
      lastname: props.name === 'lastname',
    }"
  >
    <label :for="props.name">{{ props.label }}</label>
    <input
      :name="props.name"
      :type="props.type"
      :readonly="!props.canBeModified"
      required
      v-model="content"
      @input="sendInputValue"
      ref="input"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  name: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true },
  label: { type: String, required: true },
  canBeModified: { type: Boolean, required: true },
  showValue: { type: Boolean },
  resetInput: { type: Boolean },
});

const emit = defineEmits(["getInputValue"]);

const input = ref(null);
const sendInputValue = () => emit("getInputValue", input.value, props.name);

const content = computed({
  get() {
    return props.value;
  },
  set(value) {
    input.value = value;
  },
});
</script>

<style lang="scss" scoped>
.inputContainer {
  @include fdCol-aiCt;
  width: 100%;
  gap: 5px;
}
label {
  align-self: start;
}
input {
  height: 35px;
  width: 100%;
  border-radius: 5px;
  padding-left: 5px;
  border: 1px solid var(--addMediaBackground);
  color: var(--textColorMain);
  background-color: var(--backgroundSecond);
  &:focus {
    outline: none;
  }
}
input[readonly] {
  cursor: not-allowed;
  background-color: rgba(80, 79, 79, 0.178);
}

.firstname,
.lastname {
  width: 49%;
}
</style>
