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
    <input type="email" placeholder="Email" v-model="data.email" required />
    <div class="passwordInput">
      <input
        :type="inputType"
        placeholder="Mot de passe"
        v-model="data.password"
        required
      />
      <eye-component
        :type="inputType"
        @switchInputType="showHidePassword"
      ></eye-component>
    </div>
    <button-form buttonType="submit" text="Se connecter"></button-form>
  </FormComponent>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../stores/index.js";
import router from "../router/index.js";
import FormComponent from "@/components/layout/FormComponent.vue";
import EyeComponent from "../components/buttons/EyeComponent.vue";
import ButtonForm from "../components/buttons/ButtonFormComponent.vue";

const userStore = useUserStore();
const inputType = ref("password");
const showErrorMsg = ref(false);
const data = ref({});

const showHidePassword = (e) => {
  inputType.value = e;
};
/* Fonction de connexion */
const login = async () => {
  const user = await userStore.login(data.value);
  console.log(user);
  if (Object.values(user).includes("User not found.")) {
    // Response contains "User not found."
    showErrorMsg.value = true;
    setTimeout(() => {
      showErrorMsg.value = false;
    }, 7000);
    return;
  }
  router.push("/news");
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
