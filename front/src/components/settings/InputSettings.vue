<template>
  <div
    class="inputContainer"
    :class="{
      firstname: input.name === 'firstname',
      lastname: input.name === 'lastname',
    }"
  >
    <label :for="input.name">{{ input.label }}</label>
    <input
      :name="input.name"
      :type="input.type"
      :readonly="!input.canBeModified"
      required
      v-model="content"
      @input="sendInputValue"
      ref="inputContent"
    />
    <span class="passwordInfos" v-if="input.name === 'confirmPassword'">
      Doit contenir une majuscule, un chiffre et un caractère spécial (8
      caractères min.)
    </span>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  input: { type: Object, required: true },
});

const emit = defineEmits(["getInputValue"]);
const inputContent = ref(null);

const sendInputValue = () =>
  emit("getInputValue", inputContent.value, props.input.name);

const content = computed({
  get() {
    return props.input.value;
  },
  set(value) {
    inputContent.value = value;
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
  background-color: var(--backgroundSecond);
  color: var(--textColorMain);
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

.passwordInfos {
  width: 100%;
  font-size: 0.8rem;
}
</style>
