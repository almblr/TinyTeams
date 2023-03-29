<template>
  <section :id="props.sectionName">
    <h3>
      {{ props.title }}
    </h3>
    <div class="profilPicture" v-if="props.showProfilPicture">
      <img :src="profilPictureUrl" alt="userProfilPicture" />
      <AddMediaButton
        @showUploadedImg="profilPictureFunctions.get"
        v-if="!canCancel"
        ><template v-slot:icon> Changer votre photo </template>
      </AddMediaButton>
      <span v-else class="cancelButton" @click="profilPictureFunctions.remove"
        >Annuler</span
      >
    </div>
    <form class="inputs" @submit.prevent="submit(props.submit)">
      <InputSettings
        v-for="input in inputsArray"
        :key="input.value"
        :name="input.name"
        :type="input.type"
        :value="input.value"
        :label="input.label"
        :canBeModified="input.canBeModified"
        :resetInput="resetInput"
      />
      <div class="formButtons">
        <SubmitFormButton text="Valider" :isDisabled="!canSaveChanges" />
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, computed, watch, reactive } from "vue";
import InputSettings from "@/components/settings/InputSettings.vue";
import SubmitFormButton from "@/components/buttons/SubmitFormButton.vue";
import AddMediaButton from "@/components/buttons/AddMediaButton.vue";

const props = defineProps({
  sectionName: { type: String, required: true },
  title: { type: String, required: true },
  inputsArray: { type: Array, required: true },
  submit: { type: String, required: true },
  profilPicture: { type: String, required: false },
  showProfilPicture: { type: Boolean, required: true },
});

const canSaveChanges = ref(false);
const resetInput = ref(false);
const imageBlop = ref(null);
const canCancel = ref(false);

const newInputValues = ref({
  imageFile: ref(null),
  firstname: ref(null),
  lastname: ref(null),
  email: ref(null),
});

const updateValue = (inputValue, inputName) => {
  for (const [key, value] of Object.entries(newInputValues)) {
    if (key === inputName) {
      value.value = inputValue;
      console.log(`${key}: ${value.value}`);
      !canSaveChanges.value ? (canSaveChanges.value = true) : null;
    }
  }
};
const profilPictureUrl = computed(() => {
  return imageBlop.value ? imageBlop.value : props.profilPicture;
});

const profilPictureFunctions = {
  get: (blop, file) => {
    imageBlop.value = blop;
    newInputValues.value.imageFile = file;
    canCancel.value = true;
  },
  remove: () => {
    imageBlop.value = null;
    newInputValues.value.imageFile = null;
    canCancel.value = false;
  },
};

const submit = (type) => {
  if (type === "saveUser") {
    // save user
  } else if (type === "savePassword") {
    // save password
  }
};

watch(
  () => newInputValues.value,
  (newValue) => {
    const values = Object.values(newValue);
    values.every((el) => el === null)
      ? (canSaveChanges.value = false)
      : (canSaveChanges.value = true);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
section {
  @include fdCol-jcCt-aiCt;
  padding: 20px 2%;
  width: 100%;
  max-width: 768px;
  gap: 20px;
  background-color: var(--backgroundSecond);
  color: var(--textColorSecond);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05), 0 2px 1px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  .profilPicture {
    @include jcCt-aiCt;
    gap: 20px;
    & img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid rgba(182, 179, 179, 0.219);
    }
    .cancelButton {
      cursor: pointer;
    }
  }
  .inputs {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    row-gap: 10px;
    .formButtons {
      @include jcCt-aiCt;
      position: relative;
      width: 100%;
    }
  }
}
</style>
