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
      <router-link to="/messages" class="btn"
        ><ion-icon name="chatbubble-ellipses"></ion-icon
      ></router-link>
      <NotifPanel />
      <div class="btn tooltip" v-on-click-outside="closeTooltip" title="Compte">
        <img
          class="tooltip_button profilePicture"
          :src="profilePictureUrl"
          @click="showTooltip = !showTooltip"
        />
        <div class="tooltip__content" v-show="showTooltip === true">
          <router-link :to="`/users/${userLS.id}`" class="profilButton">{{
            "Votre profil"
          }}</router-link>
          <router-link to="/settings">Paramètres</router-link>
          <router-link to="/" @click="logout"> Se déconnecter </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import useUserStore from "@/stores/userStore.js";
import useChatStore from "@/stores/chatStore.js";
import useFollowStore from "@/stores/followStore.js";
import usePostStore from "@/stores/postStore.js";
import SwitchThemeButton from "@/components/buttons/SwitchThemeButton.vue";
import NotifPanel from "@/components/layout/NotifPanel.vue";

const userStore = useUserStore();
const chatStore = useChatStore();
const followStore = useFollowStore();
const postStore = usePostStore();
const showTooltip = ref(null);
const userLS = JSON.parse(sessionStorage.getItem(`user`));
const profilePictureUrl = userLS.profilePicture;

/* La directive du package v-click-outside-element agit quand on clique en dehors de l'élément. Mettre un if permet de ne pas spammer ces instructions */
const closeTooltip = () => {
  if (showTooltip.value === true) {
    showTooltip.value = false;
  }
};

/* Deconnexion : vide le sessionStorage */
const logout = () => {
  window.sessionStorage.length > 0 ? window.sessionStorage.clear() : null;
  chatStore.$reset();
  userStore.$reset();
  followStore.$reset();
  postStore.$reset();
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
  }
  .buttons {
    @include aiCt;
    justify-content: flex-end;
    flex: 1;
    gap: 5px;
    & .btn {
      @include jcCt-aiCt;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background-color: #333435;
      cursor: pointer;
      transition: 150ms;
      border-bottom: none;
      & > * {
        font-size: 20px;
        color: white;
      }
      &:hover {
        filter: brightness(140%);
      }
    }
    .tooltip {
      position: relative;
      min-height: 40px;
      max-height: 40px;
      cursor: pointer;
      &:hover {
        filter: brightness(90%);
        transition: 150ms;
      }
      .profilePicture {
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
  }
}

.router-link-active {
  color: #2374e1;
  border-bottom: 3px solid #2374e1;
}
</style>
