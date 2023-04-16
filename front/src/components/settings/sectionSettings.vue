<template>
  <section :id="props.sectionName">
    <h3>
      {{ props.title }}
    </h3>
    <div class="profilePicture" v-if="props.showprofilePicture">
      <img :src="profilePictureUrl" alt="userprofilePicture" />
      <AddMediaButton
        @showUploadedImg="profilePictureFunctions.get"
        v-if="!canRemoveNewPicture"
        ><template v-slot:icon> Changer votre photo </template>
      </AddMediaButton>
      <span v-else class="cancelButton" @click="profilePictureFunctions.remove"
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
        @getInputValue="updateValue"
      />
      <div class="formButtons">
        <SubmitFormButton text="Valider" :isDisabled="!canSaveChanges" />
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import useUserStore from "@/stores/userStore";
import InputSettings from "@/components/settings/InputSettings.vue";
import SubmitFormButton from "@/components/buttons/SubmitFormButton.vue";
import AddMediaButton from "@/components/buttons/AddMediaButton.vue";

const props = defineProps({
  sectionName: { type: String, required: true },
  title: { type: String, required: true },
  inputsArray: { type: Array, required: true },
  submit: { type: String, required: true },
  profilePicture: { type: String, required: false },
  showprofilePicture: { type: Boolean, required: true },
});

const userStore = useUserStore();
const userLS = ref(JSON.parse(sessionStorage.getItem(`user`)));
const canSaveChanges = ref(false);
const imageBlop = ref(null);
const canRemoveNewPicture = ref(false);

const updatedUser = ref({
  profilePicture: userLS.value.profilePicture,
  email: userLS.value.email,
  job: userLS.value.job,
});

const updatedPassword = ref({
  oldPassword: null,
  newPassword: null,
  confirmPassword: null,
});

const profilePictureFunctions = {
  get: (blop, file) => {
    imageBlop.value = blop;
    updatedUser.value.profilePicture = file;
    canRemoveNewPicture.value = true;
  },
  remove: () => {
    imageBlop.value = null;
    updatedUser.value.profilePicture = userLS.value.profilePicture;
    canRemoveNewPicture.value = false;
  },
};

const profilePictureUrl = computed(() => {
  return imageBlop.value ? imageBlop.value : props.profilePicture;
});

const updateValue = (inputValue, inputName) => {
  if (props.sectionName === "user") {
    const userKeys = Object.keys(updatedUser.value);
    for (const key of userKeys) {
      if (inputName === key) {
        updatedUser.value[key] = inputValue;
      }
    }
  }
  if (props.sectionName === "password") {
    const passwordKeys = Object.keys(updatedPassword.value);
    for (const key of passwordKeys) {
      if (inputName === key) {
        updatedPassword.value[key] = inputValue;
      }
    }
  }
};

const submit = async (type) => {
  const formData = new FormData();
  if (type === "saveUser") {
    const commonKeys = Object.keys(updatedUser.value).filter(
      (key) => key in userLS.value
    );
    for (const key of commonKeys) {
      if (updatedUser.value[key] !== userLS.value[key]) {
        formData.append(key, updatedUser.value[key]);
      }
    }
    await userStore.update(formData, userLS.value.id);
    userLS.value = await userStore.getOne(userLS.value.id);
    sessionStorage.setItem("user", JSON.stringify(userLS.value));
    canSaveChanges.value = false;
    canRemoveNewPicture.value = false;
  } else if (type === "savePassword") {
    formData.append("oldPassword", updatedPassword.value.oldPassword);
    formData.append("newPassword", updatedPassword.value.newPassword);
  }
  await userStore.update(formData, userLS.value.id);
  canSaveChanges.value = false;
};
watch(
  () => updatedUser.value,
  (newValue) => {
    const commonKeys = Object.keys(newValue).filter(
      (key) => key in userLS.value
    );
    const areValuesEqual = commonKeys.every(
      (key) => newValue[key] === userLS.value[key]
    );
    areValuesEqual
      ? (canSaveChanges.value = false)
      : (canSaveChanges.value = true);
  },
  { deep: true }
);

watch(
  () => updatedPassword.value,
  (newValue) => {
    const allNull = Object.values(newValue).every((value) =>
      value ? true : false
    );
    if (allNull && newValue.newPassword === newValue.confirmPassword) {
      return (canSaveChanges.value = true);
    }
    canSaveChanges.value = false;
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
  .profilePicture {
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
