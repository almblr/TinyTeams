<template>
  <div id="container">
    <div
      class="iconBtn"
      ref="btn"
      v-on-click-outside="closeTooltip"
      @click="
        showTooltip = !showTooltip;
        notifStore.getAll();
      "
    >
      <ion-icon name="notifications"></ion-icon>
    </div>
    <div class="tooltip" v-show="showTooltip === true">
      <router-link :to="notifLink(notif)" v-for="notif of notifStore.notifs">
        <img :src="notif.senderProfilePicture" alt="ProfilePicture" />
        <div class="text">
          <p>
            {{ notif.senderUsername }}
            {{ notifDescription(notif.notifiableType) }}
          </p>
          <span>{{ dayjs().to(dayjs(notif.createdAt)) }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import useNotifStore from "@/stores/notificationStore.js";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const notifStore = useNotifStore();
const showTooltip = ref(null);

const closeTooltip = () => {
  showTooltip.value === true ? (showTooltip.value = false) : null;
};

const notifLink = (notif) => {
  return notif.postId
    ? `/post/${notif.postId}`
    : `/users/${notif.senderUsername.replaceAll(" ", "").toLowerCase()}`;
};

const notifDescription = (notifType) => {
  switch (notifType) {
    case "newPost": {
      return "a publié un nouveau post";
    }
    case "newlike": {
      return "a aimé votre post";
    }
    case "newFollow": {
      return "vous suit !";
    }
    case "newComment": {
      return "a commenté votre post";
    }
  }
};
</script>

<style lang="scss" scoped>
#container {
  position: relative;
}
.iconBtn {
  @include jcCt-aiCt;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #333435;
  cursor: pointer;
  transition: 150ms;
  color: white;
  position: relative;
  &:hover {
    filter: brightness(140%);
  }
  & > ion-icon {
    font-size: 20px;
  }
}
.tooltip {
  @include fdCol-jcCt-aiCt;
  position: absolute;
  right: 0;
  top: 40px;
  min-width: 300px;
  z-index: 99;
  background: var(--backgroundSecond);
  margin-top: 3px;
  border-radius: 5px;
  border: 1px solid rgba(138, 138, 138, 0.075);
  overflow: hidden; // Permet de ne pas ignorer les bordures au hover
  & a {
    display: flex;
    align-items: center;
    width: 97%;
    text-decoration: none;
    color: var(--textColorMain);
    gap: 10px;
    border-radius: 10px;
    padding: 10px;
    &:hover {
      background: rgba(211, 208, 208, 0.082);
    }
    & img {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      object-fit: cover;
    }
    & .text {
      display: flex;
      flex-direction: column;
      gap: 1px;
      color: var(--textColorMain);
      & span {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
