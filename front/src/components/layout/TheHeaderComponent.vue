<template>
  <header>
    <router-link to="/news" class="logo-router-link logo">
      <img src="@/assets/logo-white.png" alt="logo Groupomania" />
    </router-link>
    <nav>
      <router-link to="/news"><fa icon="fa-solid fa-house" /></router-link>
      <router-link to="/users"
        ><fa icon="fa-solid fa-user-group"
      /></router-link>
    </nav>
    <div class="buttons">
      <SwitchTheme />
      <router-link to="/" class="btn"
        ><fa icon="fa-brands fa-facebook-messenger"
      /></router-link>
      <router-link to="/" class="btn"
        ><fa icon="fa-solid fa-bell"
      /></router-link>
      <div class="btn tooltip" v-on-click-outside="closeTooltip" title="Compte">
        <img
          class="tooltip_button profilPicture"
          :src="profilPicture"
          @click="showTooltip = !showTooltip"
        />
        <div class="tooltip__content" v-show="showTooltip === true">
          <router-link :to="`/users/${username}`" class="profilButton">{{
            "Votre profil"
          }}</router-link>
          <router-link :to="`/`">Paramètres</router-link>
          <router-link to="/" @click="logout"> Se déconnecter </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import SwitchTheme from "../buttons/SwitchTheme.vue";

const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const username = sesStr.username;
const profilPicture = sesStr.profilPicture;
const showTooltip = ref(null);

/* La directive du package v-click-outside-element agit quand on clique en dehors de l'élément. Mettre un if permet de ne pas spammer ces instructions */
const closeTooltip = () => {
  if (showTooltip.value === true) {
    showTooltip.value = false;
  }
};

/* Deconnexion : vide le sessionStorage */
const logout = () => {
  window.sessionStorage.length > 0 ? window.sessionStorage.clear() : null;
};
</script>

<style lang="scss" scoped>
@mixin button {
  @include jcCt-aiCt;
  min-width: 65px;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
  color: #ffffff;
  &:hover {
    cursor: pointer;
    background-color: #ececec15;
    transition: 200ms;
  }
}
header {
  @include jcCt-aiCt;
  position: sticky;
  top: 0;
  width: 100%;
  height: 50px;
  z-index: 9999;
  background-color: #242526;
  backdrop-filter: blur(1px);
  padding: 0px 10px 0 5px;
  gap: 10px;
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.7);
  & .logo {
    @include aiCt;
    flex: 1;
    height: 100%;
    border-bottom: none;
    & > img {
      height: 70%;
    }
  }
  nav {
    @include jcCt;
    flex: 1;
    margin: 0 auto;
    height: 100%;
    & a {
      @include button;
      font-size: 19px;
    }
  }
  .buttons {
    @include aiCt;
    justify-content: flex-end;
    flex: 1;
    gap: 5px;
  }
}

.btn {
  @include jcCt-aiCt;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #333435;
  & > * {
    font-size: 20px;
    color: white;
  }
  &:hover {
    cursor: pointer;
    filter: brightness(140%);
    transition: 150ms;
  }
}
.tooltip {
  position: relative;
  min-height: 40px;
  max-height: 40px;
  &:hover {
    cursor: pointer;
    filter: brightness(90%);
    transition: 150ms;
  }
  .profilPicture {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    object-fit: cover;
  }
  &__content {
    @include fdCol-aiCt;
    position: absolute;
    right: 0;
    top: 40px;
    z-index: 9999;
    background: rgb(44, 43, 43);
    box-shadow: 5px 5px 20px #000000c7;
    margin-top: 3px;
    border-radius: 5px;
    width: 300px;
    overflow: hidden; // Permet de ne pas ignorer les bordures au hover
    & a {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 100%;
      text-decoration: none;
      color: white;
      font-size: 19px;
      text-align: center;
      border-bottom: none;
      gap: 20px;
      &:hover {
        background: rgb(39, 39, 39);
      }
    }
  }
}

.router-link-active {
  color: #2374e1;
  border-bottom: 3px solid #2374e1;
}
</style>
