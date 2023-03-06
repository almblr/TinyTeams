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
        v-model="userInfo.firstname"
        required
      />
      <input
        type="text"
        placeholder="Nom*"
        v-model="userInfo.lastname"
        required
      />
    </div>
    <input
      type="email"
      placeholder="Adresse mail*"
      v-model="userInfo.email"
      required
    />
    <div class="form__body__password">
      <input
        :type="inputType"
        placeholder="Mot de passe*"
        v-model="userInfo.password"
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
        required
      />
      <eye-component
        :type="inputType"
        @switchInputType="showHidePassword"
      ></eye-component>
      <span>
        Doit contenir une majuscule, un chiffre et un caractère spécial (8
        caractères min.)
      </span>
    </div>
    <button-form buttonType="submit" text="S'inscrire"></button-form>
  </FormComponent>
</template>

<script setup>
import { ref } from "vue";
import router from "../router/index.js";
import { useUserStore } from "../stores/index.js";
import FormComponent from "@/components/layout/FormComponent.vue";
import EyeComponent from "../components/buttons/EyeComponent.vue";
import ButtonForm from "../components/buttons/ButtonFormComponent.vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  show: {
    type: Boolean,
  },
});
const userStore = useUserStore();
const userInfo = ref({});
const inputType = ref("password");

const showHidePassword = (e) => {
  inputType.value = e;
};

const signup = async () => {
  await userStore.signup(userInfo.value);
  await userStore.login(userInfo.value);
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
