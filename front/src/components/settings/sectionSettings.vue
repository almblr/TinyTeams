<template>
  <section>
    <h3>
      {{ props.title }}
    </h3>
    <div class="profilPicture" v-if="props.showProfilPicture">
      <img :src="profilPictureUrl" alt="userProfilPicture" />
      <AddMediaButton @showUploadedImg="getImageInfos"
        ><template v-slot:icon>Changer votre photo</template>
      </AddMediaButton>
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
      />
      <SubmitFormButton text="Sauvegarder les modifications" />
    </form>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import InputSettings from "@/components/settings/InputSettings.vue";
import SubmitFormButton from "@/components/buttons/SubmitFormButton.vue";
import AddMediaButton from "@/components/buttons/AddMediaButton.vue";

const props = defineProps({
  title: { type: String, required: true },
  inputsArray: { type: Array, required: true },
  submit: { type: String, required: true },
  profilPicture: { type: String, required: false },
  showProfilPicture: { type: Boolean, required: true },
});

const imageBlop = ref(null);
const imageFile = ref(null);

const profilPictureUrl = computed(() => {
  return imageBlop.value ? imageBlop.value : props.profilPicture;
});

const getImageInfos = (blop, file) => {
  imageBlop.value = blop;
  imageFile.value = file;
};

console.log(profilPictureUrl.value);
const submit = (type) => {
  console.log("coucou");
  if (type === "saveUser") {
    // save user
  } else if (type === "savePassword") {
    // save password
  }
};
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
    }
  }
  .inputs {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    row-gap: 10px;
    & > button {
      margin: auto;
      margin-top: 20px;
    }
  }
}
</style>
