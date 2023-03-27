<template>
  <div id="container">
    <TheHeader />
    <main id="settings">
      <section class="usersSettings">
        <h3>Informations personnelles</h3>
        <div class="inputSettings">
          <InputSettings
            v-for="input in inputs"
            :key="input.value"
            :type="input.type"
            :value="input.value"
            :placeholder="input.placeholder"
            :canBeModified="input.canBeModified"
          />
        </div>
      </section>
      <section class="passwordSettings">
        <h3>Changer le mot de passe</h3>
        <!-- input ancien mot de passe nouveau mot de passe confirmer nouveau mot de passe -->
      </section>
    </main>
  </div>
</template>

<script setup>
import useUserStore from "@/stores/userStore.js";
import TheHeader from "@//components/layout/TheHeader.vue";
import InputSettings from "@//components/users/InputSettings.vue";

const userStore = useUserStore();
const inputs = [
  {
    type: "text",
    value: userStore.connectedUser.firstname,
    placeholder: "Prénom",
    canBeModified: false,
  },
  {
    type: "text",
    value: userStore.connectedUser.lastname,
    placeholder: "Nom",
    canBeModified: false,
  },
  {
    type: "email",
    value: userStore.connectedUser.email,
    placeholder: "Email",
    canBeModified: true,
  },
  {
    type: "text",
    value: userStore.connectedUser.job,
    placeholder: "Métier",
    canBeModified: true,
  },
];
</script>

<style lang="scss" scoped>
#container {
  @include fdCol-aiCt;
  height: 100%;
  overflow-y: auto;
  position: relative;
  background-color: var(--backgroundMain);
}

#settings {
  @include fdCol-aiCt;
  border: 1px solid red;
  width: 100%;
  padding-top: 30px;
  max-width: 800px;
  gap: 20px;
}
section {
  @include fdCol-jcCt-aiCt;
  min-width: 800px;
  background-color: var(--backgroundSecond);
  height: 200px;
}
</style>
