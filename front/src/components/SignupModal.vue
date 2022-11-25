<template>
  <ModalLayerComponent v-if:="show" @click.self="emit('close')">
    <div class="modal__container">
      <main class="form">
        <h2 class="form__title">Inscription</h2>
        <form class="form__body" @submit.prevent="signup">
          <div class="form__body__name">
            <input
              class="nameInput"
              name="firstName"
              type="text"
              placeholder="Prénom*"
              v-model="userStore.user.firstName"
              required
            />
            <input
              class="nameInput"
              name="lastName"
              type="text"
              placeholder="Nom*"
              v-model="userStore.user.lastName"
              required
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Adresse mail*"
            v-model="userStore.user.email"
            required
          />
          <div class="form__body__password">
            <input
              id="password"
              name="password"
              :type="inputType"
              placeholder="Mot de passe*"
              v-model="userStore.user.password"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
              required
            />
            <eye-component
              :type="inputType"
              :click="showPassword"
            ></eye-component>
            <span>
              Doit contenir une majuscule, un chiffre et un caractère spécial (8
              caractères min.)
            </span>
          </div>
          <button-form-component
            type="submit"
            text="S'inscrire"
          ></button-form-component>
        </form>
      </main></div
  ></ModalLayerComponent>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useUserStore } from "../stores/index.js";
import router from "../router/index.js";
import EyeComponent from "./EyeComponent.vue";
import ButtonFormComponent from "./ButtonFormComponent.vue";
import ModalLayerComponent from "./ModalLayerComponent.vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  show: {
    type: Boolean,
  },
});

const userStore = useUserStore();
const inputType = ref("password");
const user = userStore.user; // user copie seulement l'objet, il ne devient pas le store direct
// const emptyUser = reactive({
//   firstName: "",
//   lastName: "",
//   email: "",
//   password: "",
// });
// const user = reactive({ ...emptyUser });

/* Permet de reset les inputs (l'objet user pour être précis) */
const resetForm = () => {
  //Object.assign(user, emptyUser);
  userStore.$reset();
  console.log(user);
};

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

<style scoped lang="scss">
.modal__container {
  width: 100%;
  max-width: 550px;
  min-height: 400px;
  border-radius: 10px;
  gap: 20px;
  background-color: rgb(255, 255, 255);
  box-shadow: 5px 5px 20px #0000003d;
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  gap: 20px;
  &__title {
    width: 100%;
    font-weight: 700;
    font-size: 35px;
    text-align: center;
    color: rgba(0, 0, 0, 0.75);
  }
  &__body {
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    gap: 30px;
    align-items: center;
    width: 100%;
    padding: 0 3%;
    &__name {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      width: 100%;
    }
    &__password {
      position: relative;
      width: 100%;
      min-height: 45px;
      border-radius: 5px;
      & span {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.849);
      }
    }
    input {
      width: 100%;
      min-height: 45px;
      border: 1px solid #00000085;
      border-radius: 5px;
      padding-left: 5px;
      input::placeholder {
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
}

footer {
  @include jcCt;
  align-items: center;
  gap: 10px;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 300px;
  height: 50px;
  background-color: #fd0101f6;
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
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
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
