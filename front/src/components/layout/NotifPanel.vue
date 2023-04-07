<template>
  <div id="container">
    <div
      class="iconBtn"
      ref="btn"
      v-on-click-outside="closeTooltip"
      @click="openTooltip"
    >
      <ion-icon name="notifications"></ion-icon>
    </div>
    <div class="tooltip" v-show="showTooltip === true" ref="notifs">
      <div class="nothingToShow" v-if="notifStore.notifs.length === 0">
        Aucune notification à afficher
      </div>
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
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { useInfiniteScroll } from "@vueuse/core";
import useNotifStore from "@/stores/notificationStore.js";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const notifStore = useNotifStore();
const firstload = ref(true);
const showTooltip = ref(null);
const notifs = ref(null);

const openTooltip = async () => {
  showTooltip.value = !showTooltip.value;
  // firstload.value === false ? null :
  await notifStore.getAll();
  firstload.value = false;
};
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

useInfiniteScroll(
  notifs,
  async () => {
    const lastNotif = notifStore.notifs[notifStore.notifs.length - 1];
    const lastNotifId = lastNotif.id;
    console.log(lastNotifId);
    await notifStore.getAll(lastNotifId);
  },
  {
    distance: 10,
  }
);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 0;
  top: 40px;
  min-width: 300px;
  min-height: 50px;
  max-height: 500px;
  z-index: 99;
  background: var(--backgroundSecond);
  margin-top: 3px;
  border-radius: 5px;
  color: var(--textColorMain);
  border: 1px solid rgba(138, 138, 138, 0.075);
  overflow-y: auto;
  & .nothingToShow {
    @include jcCt-aiCt;
    min-height: 100px;
    font-style: italic;
  }
  & a {
    display: flex;
    align-items: center;
    width: 97%;
    text-decoration: none;
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
