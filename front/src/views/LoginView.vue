<template>
  <FormComponent
    title="Connexion"
    link="/signup"
    question="Pas de compte ?"
    reponse="Inscrivez-vous !"
    :submit="login"
    :popup="showErrorMsg"
    error="Vérifiez vos informations de connexion."
  >
    <input
      type="email"
      placeholder="Email"
      v-model="userStore.user.email"
      required
    />
    <div class="passwordInput">
      <input
        :type="inputType"
        placeholder="Mot de passe"
        v-model="userStore.user.password"
        required
      />
      <eye-component :type="inputType" :click="showPassword"></eye-component>
    </div>
    <button-form buttonType="submit" text="Se connecter"></button-form>
  </FormComponent>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useUserStore } from "../stores/index.js";
import router from "../router/index.js";
import FormComponent from "@/components/layout/FormComponent.vue";
import EyeComponent from "../components/buttons/EyeComponent.vue";
import ButtonForm from "../components/buttons/ButtonFormComponent.vue";

const userStore = useUserStore();
const inputType = ref("password");
const showErrorMsg = ref(false);

/* Permet de switch le type de l'input afin de voir le mdp */
function showPassword() {
  inputType.value === "password"
    ? (inputType.value = "text")
    : (inputType.value = "password");
}

/* Fonction de connexion */
const login = async () => {
  const result = await userStore.login();
  if (Object.values(result).includes("User not found.")) {
    // Si le resultat du fetch contient "User not found."
    showErrorMsg.value = true;
    setTimeout(() => {
      showErrorMsg.value = false;
    }, 7000);
  } else {
    if (localStorage !== null) {
      localStorage.clear();
    }
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        userId: result.userId,
        isAdmin: result.isAdmin,
        userName: result.userName,
        profilPicture: result.profilPicture,
        token: result.token,
      })
    );
    router.push("/news");
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/inputStyle.scss";

.passwordInput {
  position: relative;
  width: 100%;
  min-height: 45px;
  border-radius: 5px;
}
</style>
