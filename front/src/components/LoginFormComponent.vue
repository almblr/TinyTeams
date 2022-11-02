<template>
  <div class="container">
    <div class="logo">
      <img src="../assets/logo-black.png" alt="Groupomania logo" />
    </div>
    <main class="form">
      <h2 class="form__title">Connexion</h2>
      <form class="form__body" @submit.prevent="login">
        <input
          type="email"
          name="email"
          placeholder="Email"
          v-model="email"
          required
        />
        <div class="passwordInput">
          <input
            :type="inputType"
            name="password"
            placeholder="Password"
            v-model="password"
            required
          />
          <eye-component
            :type="inputType"
            :click="showPassword"
          ></eye-component>
        </div>
        <button-form-component
          type="submit"
          text="Se connecter"
        ></button-form-component>
      </form>
    </main>
    <footer>
      <p>
        Pas de compte ?
        <span @click="showSignupModal = true" @close="showSignupModal = false"
          >Inscrivez-vous !</span
        >
      </p>
    </footer>
    <div class="error" v-if="errorMsg">
      <span>Vérifiez vos informations de connexion.</span>
    </div>
  </div>
  <SignupModal :show="showSignupModal" @close="showSignupModal = false">
  </SignupModal>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/index.js';
import router from '../router/index.js';
import EyeComponent from '../components/EyeComponent.vue';
import ButtonFormComponent from '../components/ButtonFormComponent.vue';
import SignupModal from '../components/SignupModal.vue';

const userStore = useUserStore();
const inputType = ref('password');
const password = ref(null);
const email = ref(null);
const errorMsg = ref(false);
const showSignupModal = ref(false);

/* Permet de switch le type de l'input afin de voir le mdp */
function showPassword() {
  inputType.value === 'password'
    ? (inputType.value = 'text')
    : (inputType.value = 'password');
}

/* Fonction de connexion */
const login = async () => {
  const result = await userStore.login(email.value, password.value);
  if (Object.values(result).includes('Utilisateur non trouvé.')) {
    // Si le resultat du fetch contient "Utilisateur non trouvé !"
    errorMsg.value = true;
    setTimeout(() => {
      errorMsg.value = false;
    }, 7000);
  } else {
    if (localStorage !== null) {
      localStorage.clear();
    }
    localStorage.setItem(
      'TokenUser',
      JSON.stringify({
        token: result.token,
        userId: result.userId,
        isAdmin: result.isAdmin,
        userName: result.userName,
      })
    );
    router.push('/news');
  }
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  max-width: 650px;
  height: 100%;
  max-height: 550px;
  background-color: rgb(255, 255, 255);
  box-shadow: 5px 5px 20px #0000003d;
  padding: 10% 5%;
  gap: 20px;
}
.logo {
  max-width: fit-content;
  max-height: fit-content;
  & > img {
    max-width: 70px;
    max-height: 70px;
  }
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 50px;
  align-items: center;
  width: 100%;
  flex: 1;
  &__title {
    width: 100%;
    height: 50px;
    font-weight: 700;
    font-size: 35px;
    text-align: center;
    color: rgba(0, 0, 0, 0.75);
  }
  &__body {
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    gap: 50px;
    align-items: center;
    width: 100%;
    & .passwordInput {
      position: relative;
      width: 100%;
      min-height: 45px;
      border-radius: 5px;
    }
  }
  input {
    min-width: 100% !important;
    min-height: 45px;
    border: 1px solid #00000085;
    border-radius: 5px;
    padding-left: 5px;
    input::placeholder {
      height: 30px;
      font-size: 35px;
    }
    &:focus {
      outline: none;
      border: 2px solid #fd2d01;
    }
  }

  input:valid {
    border: 2px solid green !important;
  }

  input:not(:placeholder-shown):invalid {
    border: 2px solid red !important;
  }
}

footer {
  @include row-justify-center;
  align-items: center;
  gap: 10px;
  & p {
    flex: 1;
    max-width: max-content;
    height: min-content;
    font-weight: 400;
    font-size: 18px;
    text-align: center;
  }
  & span {
    color: #d63535;
    text-decoration: none;
    font-size: 17px;
    margin-left: 3px;
    &:hover {
      color: #ff0000;
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 300px;
  height: 50px;
  background-color: #fd0101f6;
  background-color: #fd0101;
  border-radius: 10px;
  bottom: 3%;
  left: 50%;
  transform: translate(-50%, 0);
  animation: displayError 7s 1;
  box-shadow: 5px 5px 20px #0000003d;
  opacity: 0;
  & > span {
    font-size: 18px;
    color: white;
    text-align: center;
    font-weight: bold;
  }
}

@keyframes displayError {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  95% {
    opacity: 0;
  }
}

@media all and (min-width: 1440px) {
  .container {
    border-radius: 5px;
  }
}
</style>
