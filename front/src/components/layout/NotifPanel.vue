<template>
  <div id="container">
    <div
      class="iconBtn"
      ref="btn"
      v-on-click-outside="closeTooltip"
      @click="openTooltip"
    >
      <ion-icon name="notifications"></ion-icon>
      <NumberBadge :unread="notifStore.nonViewedNotifs.length" />
    </div>
    <div class="tooltip" v-show="showTooltip === true" ref="notifs">
      <div class="nothingToShow" v-if="notifStore.notifs.length === 0">
        Aucune notification à afficher
      </div>
      <router-link :to="notifLink(notif)" v-for="notif of notifStore.notifs">
        <img :src="notif.senderProfilePicture" alt="ProfilePicture" />
        <div class="text">
          <p>
            {{ notif.senderUsername + notifDescription(notif.notifiableType) }}
          </p>
          <span>{{ dayjs().to(dayjs(notif.createdAt)) }}</span>
        </div>
        <div v-if="!notif.isRead" class="notificationBadge"></div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { useInfiniteScroll } from "@vueuse/core";
import NumberBadge from "@/components/layout/NumberBadge.vue";
import useNotifStore from "@/stores/notificationStore.js";
import dayjs from "@/dayjs.js";

const user = JSON.parse(sessionStorage.getItem(`user`));
const notifStore = useNotifStore();
const firstload = ref(true);
const showTooltip = ref(null);
const notifs = ref(null);
const canInfiniteScroll = ref(true);

const openTooltip = async () => {
  showTooltip.value = !showTooltip.value;
  if (!showTooltip.value) return;
  if (!firstload.value) {
    if (notifStore.notifs.every((notif) => notif.isRead)) {
      return;
    } else {
      return await notifStore.getAll(user.id);
    }
  }
  await notifStore.getAll(user.id);
  await notifStore.updateAll(user.id);
  firstload.value = false;
};
const closeTooltip = () => {
  showTooltip.value ? (showTooltip.value = false) : null;
};

const notifLink = (notif) => {
  return notif.postId ? `/post/${notif.postId}` : `/users/${notif.sender}`;
};

const notifDescription = (notifType) => {
  switch (notifType) {
    case "newLike":
      return " a aimé votre post";
    case "newPost":
      return " a publié un nouveau post";
    case "newFollow":
      return " vous suit !";
    case "newComment":
      return " a commenté votre post";
    default:
      return "";
  }
};

useInfiniteScroll(
  notifs,
  async () => {
    if (canInfiniteScroll.value) {
      const lastNotif = notifStore.notifs[notifStore.notifs.length - 1];
      const lastNotifId = lastNotif.id;
      const nextNotifs = await notifStore.getAll(lastNotifId);
      return !nextNotifs ? null : (canInfiniteScroll.value = false);
    }
    return;
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
  @include headerBtn;
  & > ion-icon {
    font-size: 20px;
  }
}
.tooltip {
  @include fdCol-aiCt;
  position: absolute;
  z-index: 99;
  right: 0;
  top: 40px;
  min-width: 300px;
  min-height: 50px;
  max-height: 500px;
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
    @include aiCt;
    width: 97%;
    text-decoration: none;
    border-radius: 10px;
    padding: 10px;
    gap: 10px;
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
