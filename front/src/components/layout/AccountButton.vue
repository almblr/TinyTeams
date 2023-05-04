<template>
  <div class="tooltip" v-on-click-outside="closeTooltip" title="Compte">
    <img
      class="tooltip_button profilePicture"
      :src="user.profilePicture"
      @click="showTooltip = !showTooltip"
    />
    <div class="tooltip__content" v-show="showTooltip">
      <router-link :to="`/users/${user.id}`" class="profilButton"
        >Votre profil</router-link
      >
      <router-link to="/settings">Paramètres</router-link>
      <router-link to="/" @click="logout"> Se déconnecter </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import useUserStore from "@/stores/userStore.js";
import usePostStore from "@/stores/postStore.js";
import useChatStore from "@/stores/chatStore.js";
import useFollowStore from "@/stores/followStore.js";

const user = JSON.parse(sessionStorage.getItem(`user`));
const userStore = useUserStore();
const postStore = usePostStore();
const chatStore = useChatStore();
const followStore = useFollowStore();
const showTooltip = ref(null);

/* La directive du package v-click-outside-element agit quand on clique en dehors de l'élément. Mettre un if permet de ne pas spammer ces instructions */
const closeTooltip = () => {
  if (showTooltip.value === true) {
    showTooltip.value = false;
  }
};

const logout = () => {
  window.sessionStorage.length > 0 ? window.sessionStorage.clear() : null;
  chatStore.$reset();
  userStore.$reset();
  followStore.$reset();
  postStore.$reset();
};
</script>

<style lang="scss" scoped>
.tooltip {
  position: relative;
  min-height: 40px;
  max-height: 40px;
  cursor: pointer;
  .profilePicture {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    object-fit: cover;
    &:hover {
      filter: brightness(90%);
      transition: 150ms;
    }
  }
  &__content {
    @include fdCol-aiCt;
    position: absolute;
    right: 0;
    top: 40px;
    z-index: 9999;
    background: var(--backgroundMain);
    box-shadow: 5px 5px 20px #0000007c;
    margin-top: 3px;
    border-radius: 5px;
    width: 300px;
    overflow: hidden; // Permet de ne pas ignorer les bordures au hover
    & a {
      @include jcCt-aiCt;
      height: 40px;
      width: 100%;
      text-decoration: none;
      font-size: 19px;
      text-align: center;
      border-bottom: none;
      gap: 20px;
      color: var(--textColorMain);
      transition: 200ms;
      &:hover {
        background: var(--hover);
      }
    }
  }
}
</style>
