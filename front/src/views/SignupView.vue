<template>
  <UserForm
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
      <PasswordSwitcherButton
        :type="inputType"
        @switchInputType="showHidePassword"
      ></PasswordSwitcherButton>
      <span>
        Doit contenir une majuscule, un chiffre et un caractère spécial (8
        caractères min.)
      </span>
    </div>
    <SubmitFormButton buttonType="submit" text="S'inscrire"></SubmitFormButton>
  </UserForm>
</template>

<script setup>
import { ref } from "vue";
import useUserStore from "@/stores/userStore.js";
import router from "@/router/index.js";
import UserForm from "@/components/users/UserForm.vue";
import PasswordSwitcherButton from "@/components/buttons/PasswordSwitcherButton.vue";
import SubmitFormButton from "@/components/buttons/SubmitFormButton.vue";

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
  router.push("/feed");
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
