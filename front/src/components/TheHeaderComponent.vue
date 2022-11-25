<template>
  <header>
    <div class="logo">
      <img
        class="basicLogo"
        src="../assets/icon-left-font-monochrome-white.png"
        alt="logo Groupomania"
      />
      <img
        class="reducedLogo"
        src="../assets/logo-white.png"
        alt="logo Groupomania"
      />
    </div>
    <nav>
      <a class="button">Accueil</a>
      <router-link to="/" @click="logout" class="button">Profil</router-link>
      <router-link to="/" @click="logout" class="button logout">
        <fa icon="fa-solid fa-power-off" />
      </router-link>
    </nav>
  </header>
</template>

<script setup></script>

<style lang="scss" scoped>
header {
  @include jcSb;
  z-index: 99;
  position: fixed;
  top: 0;
  width: 100%;
  height: 6%;
  max-height: 50px;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.849);
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.178);
  & .logo {
    position: absolute;
    margin-left: 1%;
    & .basicLogo {
      width: 200px;
      height: 50px;
      object-fit: cover;
    }

    .reducedLogo {
      display: none;
    }
  }
}
nav {
  @include jcCt;
  position: relative;
  width: 100%;
  min-height: 100%;
  & a {
    @include jcCt-aaCt;
    min-width: 80px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    text-decoration: none;
    color: #ffffff;
    &:hover {
      cursor: pointer;
      box-shadow: inset 0px 0px 10px rgb(0, 0, 0);
    }
  }
  & .logout {
    position: absolute;
    right: 0;
    height: 50px;
  }
}

@media all and (max-width: 789px) {
  .basicLogo {
    display: none;
  }

  .reducedLogo {
    display: block !important;
    width: 32px;
    height: 50px;
    object-fit: contain;
  }
}
</style>
