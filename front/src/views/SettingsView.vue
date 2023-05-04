<template>
  <div id="container">
    <TheHeader />
    <main id="settings">
      <SectionSettings
        v-for="section in sections"
        :section="section"
        :profilePicture="user.profilePicture"
        @showPopup="toggleShowPopup"
      />
    </main>
    <div class="popup" v-if="showPopup">
      <span>Changements sauvegardés</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TheHeader from "@//components/layout/TheHeader.vue";
import SectionSettings from "@/components/settings/SectionSettings.vue";

const user = JSON.parse(sessionStorage.getItem(`user`));
const showPopup = ref(false);

const sections = [
  {
    name: "user",
    title: "Informations personnelles",
    function: "saveUser",
    showprofilePicture: true,
    inputs: [
      {
        name: "firstname",
        type: "text",
        value: user.firstname,
        label: "Prénom",
        canBeModified: false,
      },
      {
        name: "lastname",
        type: "text",
        value: user.lastname,
        label: "Nom",
        canBeModified: false,
      },
      {
        name: "email",
        type: "email",
        value: user.email,
        label: "Votre adresse e-mail",
        canBeModified: true,
      },
      {
        name: "job",
        type: "text",
        value: user.job,
        label: "Poste occupé",
        canBeModified: true,
      },
    ],
  },
  {
    name: "password",
    title: "Changer de mot de passe",
    function: "savePassword",
    showprofilePicture: false,
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

const toggleShowPopup = () => {
  showPopup.value = true;
  setTimeout(() => {
    showPopup.value = false;
  }, 3000);
};
</script>

<style lang="scss" scoped>
#container {
  @include container;
}

#settings {
  @include fdCol-aiCt;
  min-height: min-content;
  padding-top: 30px;
  gap: 30px;
  transition: 200ms;
}

.popup {
  @include jcCt-aiCt;
  position: absolute;
  bottom: 20px;
  left: calc(50% - 115px);
  width: 230px;
  height: 35px;
  border-radius: 5px;
  background-color: rgb(98, 179, 98);
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 5px 0 20px var(--shadowColor);
  color: white;
  z-index: 100;
  opacity: 0;
  animation: popup 3s ease-in-out;
}

@keyframes popup {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  3% {
    transform: translateY(-10px);
    opacity: 1;
  }
  95% {
    transform: translateY(-10px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
}
</style>
