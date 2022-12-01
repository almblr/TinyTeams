<template>
  <FormComponent
    title="Inscription"
    link="/login"
    question="Déjà inscrit ?"
    reponse="Connectez-vous !"
    :submit="signup"
    error="Le formulaire d'inscription est incomplet."
  >
    <div class="form__body__name">
      <input
        type="text"
        placeholder="Prénom*"
        v-model="userStore.user.firstName"
        required
      />
      <input
        type="text"
        placeholder="Nom*"
        v-model="userStore.user.lastName"
        required
      />
    </div>
    <input
      type="email"
      placeholder="Adresse mail*"
      v-model="userStore.user.email"
      required
    />
    <div class="form__body__password">
      <input
        :type="inputType"
        placeholder="Mot de passe*"
        v-model="userStore.user.password"
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
        required
      />
      <eye-component :type="inputType" :click="showPassword"></eye-component>
      <span>
        Doit contenir une majuscule, un chiffre et un caractère spécial (8
        caractères min.)
      </span>
    </div>
    <button-form type="submit" text="S'inscrire"></button-form>
  </FormComponent>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/index.js";
import FormComponent from "@/components/FormComponent.vue";
import EyeComponent from "../components/EyeComponent.vue";
import ButtonForm from "../components/ButtonFormComponent.vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  show: {
    type: Boolean,
  },
});
const userStore = useUserStore();
const inputType = ref("password");

/* Permet de switch le type de l'input afin de voir le mdp */
function showPassword() {
  inputType.value === "password"
    ? (inputType.value = "text")
    : (inputType.value = "password");
}

/* Fonction d'inscription' */
const signup = async () => {
  await userStore.signup();
  // const result = await userStore.login(user.email, user.password);
  const result = await userStore.login();
  localStorage.setItem(
    "TokenUser",
    JSON.stringify({
      token: result.token,
      userId: result.userId,
      isAdmin: result.isAdmin,
      userName: result.userName,
    })
  );
  router.push("/news");
};
</script>

<style lang="scss" scoped>
@import "@/scss/inputStyle.scss";
.form__body__name {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}

.form__body__password {
  position: relative;
  width: 100%;
  min-height: 45px;
  border-radius: 5px;
  & span {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.849);
  }
}
</style>
