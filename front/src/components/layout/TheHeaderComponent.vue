<template>
  <header>
    <router-link to="/news" class="logo">
      <img src="@/assets/logo-white.png" alt="logo Groupomania" />
    </router-link>
    <nav>
      <router-link to="/news" class="button">Accueil</router-link>
      <router-link :to="`/user/${usernameParam}`" class="button"
        >Profil</router-link
      >
    </nav>
    <router-link to="/" @click="logout" class="button logout">
      <fa icon="fa-solid fa-power-off" />
    </router-link>
  </header>
</template>

<script setup>
const locStr = JSON.parse(localStorage.getItem(`userInfo`));
const username = locStr.userName;
const usernameParam = username.split(" ").join("_").toLowerCase();

/* Deconnexion : vide le localstorage */
const logout = () => {
  window.localStorage.length > 0 ? window.localStorage.clear() : null;
};
</script>

<style lang="scss" scoped>
@mixin button {
  @include jcCt-aiCt;
  min-width: 80px;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  text-decoration: none;
  color: #ffffff;
  &:hover {
    cursor: pointer;
    box-shadow: inset 0px 0px 10px rgb(0, 0, 0);
  }
}
header {
  @include jcSb;
  z-index: 99;
  position: fixed;
  top: 0;
  width: 100%;
  height: 6%;
  max-height: 50px;
  padding-left: 1%;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.849);
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.178);
  & .logo {
    display: flex;
    align-items: center;
    height: 100%;
    & > img {
      height: 70%;
    }
  }
  nav {
    @include jcCt;
    flex: 1;
    min-height: 100%;
    & a {
      @include button;
    }
  }
  & .logout {
    @include button;
    right: 0;
  }
}
</style>
