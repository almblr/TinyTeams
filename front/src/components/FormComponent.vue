<template>
  <div id="body">
    <div class="container">
      <Logo />
      <main class="form">
        <h2 class="form__title">{{ props.title }}</h2>
        <form class="form__body" @submit.prevent="props.submit">
          <slot></slot>
        </form>
      </main>
      <footer>
        <p>
          {{ props.question }}
          <RouterLink :to="props.link" @click="resetForm">{{
            props.reponse
          }}</RouterLink>
        </p>
      </footer>
    </div>
    <div class="error" v-if="props.popup">
      <span> {{ props.error }} </span>
    </div>
  </div>
</template>

<script setup>
import Logo from "./LogoComponent.vue";
import { useUserStore } from "../stores/index.js";
const userStore = useUserStore();

const props = defineProps({
  title: String,
  submit: Function,
  error: String,
  link: String,
  question: String,
  reponse: String,
  popup: Boolean,
});

const resetForm = () => {
  userStore.$reset();
};
</script>

<style lang="scss" scoped>
#body {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: url("../assets/entreprise.jpg");
  background-size: cover;
}
.container {
  @include fdCol-jcSe-aaCt;
  width: 100%;
  max-width: 600px;
  max-height: min-content;
  background-color: rgb(255, 255, 255);
  box-shadow: 5px 5px 20px #0000003d;
  padding: 3% 2%;
  gap: 20px;
  border-radius: 0;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
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
    align-items: center;
    width: 100%;
    gap: 50px;
  }
}

footer {
  @include jcCt;
  align-items: center;
  gap: 10px;
  & p {
    flex: 1;
    max-width: max-content;
    height: min-content;
    font-weight: 400;
    font-size: 18px;
    text-align: center;
    & a {
      color: red;
      text-decoration: none;
      &:hover {
        font-weight: bold;
      }
    }
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
  position: absolute;
  bottom: 3%;
  left: 50%;
  width: 300px;
  height: 50px;
  background-color: #fd0101;
  border-radius: 10px;
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
    margin: 0 10% 0 0;
  }
}

@media all and (min-width: 1440px) {
  #body {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
