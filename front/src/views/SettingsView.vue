<template>
  <div id="container">
    <TheHeader />
    <main id="settings">
      <sectionSettings
        v-for="section in sections"
        :title="section.title"
        :inputsArray="section.inputs"
        :submit="section.function"
      />
    </main>
  </div>
</template>

<script setup>
import useUserStore from "@/stores/userStore.js";
import TheHeader from "@//components/layout/TheHeader.vue";
import sectionSettings from "@/components/settings/sectionSettings.vue";

let userLS = JSON.parse(sessionStorage.getItem(`user`))?.user;

const userStore = useUserStore();
const sections = [
  {
    name: "user",
    title: "Informations personnelles",
    function: "saveUser",
    inputs: [
      {
        name: "firstname",
        type: "text",
        value: userLS.firstname,
        label: "Prénom",
        canBeModified: false,
      },
      {
        name: "lastname",
        type: "text",
        value: userLS.lastname,
        label: "Nom",
        canBeModified: false,
      },
      {
        name: "email",
        type: "email",
        value: userLS.email,
        label: "Votre adresse e-mail",
        canBeModified: true,
      },
      {
        name: "job",
        type: "text",
        value: userLS.job,
        label: "Métier",
        canBeModified: true,
      },
    ],
  },
  {
    name: "password",
    title: "Changer de mot de passe",
    function: "savePassword",
    inputs: [
      {
        name: "oldPassword",
        type: "password",
        value: "",
        label: "Ancien mot de passe",
        canBeModified: true,
      },
      {
        name: "newPassword",
        type: "password",
        value: "",
        label: "Nouveau mot de passe",
        canBeModified: true,
      },
      {
        name: "confirmPassword",
        type: "password",
        value: "",
        label: "Confirmer le mot de passe",
        canBeModified: true,
      },
    ],
  },
];
</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  overflow-y: auto;
  position: relative;
  background-color: var(--backgroundMain);
}

#settings {
  @include fdCol-aiCt;
  transition: 200ms;
  min-height: min-content;
  padding-top: 30px;
  gap: 30px;
}
</style>
