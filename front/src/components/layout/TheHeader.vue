<template>
  <header>
    <div class="divLogo">
      <router-link to="/feed" class="logo-router-link logo">
        <img src="@/assets/logo-white.png" alt="logo TinyTeams" />
      </router-link>
    </div>
    <nav>
      <router-link to="/feed"><ion-icon name="home"></ion-icon></router-link>
      <router-link to="/users"><ion-icon name="people"></ion-icon></router-link>
    </nav>
    <div class="buttons">
      <SwitchThemeButton />
      <MessagesButton />
      <NotifPanel />
      <AccountButton />
    </div>
  </header>
</template>

<script setup>
import SwitchThemeButton from "@/components/buttons/SwitchThemeButton.vue";
import NotifPanel from "@/components/layout/NotifPanel.vue";
import MessagesButton from "@/components/layout/MessagesButton.vue";
import AccountButton from "@/components/layout/AccountButton.vue";
</script>

<style lang="scss" scoped>
@mixin button {
  @include jcCt-aiCt;
  min-width: 65px;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
  color: #ffffff;
  cursor: pointer;
  &:hover {
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
  border-bottom: 1px solid #333435;
  box-shadow: 5px 0px 20px var(--shadowHeader);
  & > .divLogo {
    @include aiCt;
    flex: 1;
    height: 100%;
    & .logo {
      @include aiCt;
      height: 100%;
      border-bottom: none;
      & > img {
        height: 70%;
      }
    }
  }
  nav {
    @include jcCt;
    flex: 1;
    margin: 0 auto;
    height: 100%;
    & a {
      @include button;
      font-size: 23px;
    }
    & > .router-link-active {
      color: #2374e1;
      border-bottom: 3px solid #2374e1;
    }
  }
  .buttons {
    @include aiCt;
    justify-content: flex-end;
    flex: 1;
    gap: 5px;
  }
}
</style>
