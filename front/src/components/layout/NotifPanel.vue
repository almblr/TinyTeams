<template>
  <div class="btn" ref="btn" v-on-click-outside="closeTooltip">
    <ion-icon
      name="notifications"
      @click="showTooltip = !showTooltip"
    ></ion-icon>
    <div class="tooltip" v-show="showTooltip === true">
      <div v-for="notif of notifStore.notifs"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import useNotifStore from "@/stores/notificationStore.js";

const notifStore = useNotifStore();
</script>

<style lang="scss" scoped></style>
