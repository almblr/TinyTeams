<template>
  <div class="btn" ref="btn" v-on-click-outside="closeTooltip">
    <ion-icon
      name="notifications"
      @click="showTooltip = !showTooltip"
    ></ion-icon>
    <div class="tooltip" v-show="showTooltip === true">
      <div v-for="notif of notifStore.notifs">
        <router-link :to="notifLink(notif)">
          <img :src="notif.senderProfilePicture" alt="ProfilePicture" />
          <p>{{ notif.senderUsername }} {{ notifDescription(notif.type) }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import useNotifStore from "@/stores/notificationStore.js";

const notifStore = useNotifStore();
const showTooltip = ref(null);

const closeTooltip = () => {
  showTooltip.value === true ? (showTooltip.value = false) : null;
};

const notifLink = (notif) => {
  return notif.postId
    ? `/post/${notif.postId}`
    : `/users/${notif.senderUsername}`;
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

onMounted(async () => {
  await notifStore.getAll();
});
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  cursor: pointer;
  & > ion-icon {
    font-size: 20px;
    color: white;
  }
  & .tooltip {
    @include fdCol-aiCt;
    position: absolute;
    right: 0;
    top: 40px;
    min-width: 300px;
    z-index: 99;
    background: black;
    margin-top: 3px;
    opacity: 0.8;
    border-radius: 5px;
    overflow: hidden; // Permet de ne pas ignorer les bordures au hover
    & > span {
      display: absolute;
      min-width: 100px;
      color: white;
      text-align: center;
      transition: 200ms;
      padding: 5px 0px;
      &:hover {
        background: rgb(14, 14, 14);
      }
    }
  }
}
</style>
