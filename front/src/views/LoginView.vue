<template>
  <UserForm
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
      <PasswordSwitcherButton
        :type="inputType"
        @switchInputType="(newType) => (inputType = newType)"
      ></PasswordSwitcherButton>
    </div>
    <SubmitFormButton text="Se connecter"></SubmitFormButton>
  </UserForm>
</template>

<script setup>
import { ref } from "vue";
import useUserStore from "@/stores/userStore.js";
import router from "@/router/index.js";
import UserForm from "@/components/users/UserForm.vue";
import PasswordSwitcherButton from "@/components/buttons/PasswordSwitcherButton.vue";
import SubmitFormButton from "@/components/buttons/SubmitFormButton.vue";

const userStore = useUserStore();
const inputType = ref("password");
const showErrorMsg = ref(false);
const data = ref({});

const initErrorMsg = () => {
  showErrorMsg.value = true;
  setTimeout(() => {
    showErrorMsg.value = false;
  }, 7000);
  return;
};

const login = async () => {
  const user = await userStore.login(data.value);
  !user ? initErrorMsg() : router.push("/feed");
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
