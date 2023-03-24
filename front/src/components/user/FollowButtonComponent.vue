<template>
  <div
    v-if="isSubscribed === false && !loggedInUserProfile"
    class="btn follow"
    @click="updateFollow('follow', props.userId)"
  >
    <fa icon="fa-solid fa-user-plus" />S'abonner
  </div>
  <div
    v-if="isSubscribed && !loggedInUserProfile"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    class="btn unfollow"
    @click="updateFollow('unfollow', props.userId)"
  >
    <fa icon="fa-solid fa-check" v-if="isHovered === false" />
    <fa icon="fa-solid fa-xmark" v-if="isHovered === true" />Abonné
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFollowStore } from "@/stores/index.js";
import socket from "@/services/socketio.js";

const props = defineProps({
  userId: Number,
  loggedInUserProfile: Boolean,
});

const followStore = useFollowStore();
const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const isHovered = ref(false);
const isSubscribed = ref(false);

const updateFollow = async (type, userId) => {
  if (type === "follow") {
    await followStore.sendFollow(userId);
    socket.emit("sendFollow", {
      author: sesStr.userId,
      isFollowing: userId,
    });
  } else {
    await followStore.unfollow(userId);
  }
  isSubscribed.value = type === "follow";
};
onMounted(async () => {
  isSubscribed.value = await followStore.getOne(props.userId);
});
</script>

<style lang="scss" scoped>
.btn {
  @include jcCt-aiCt;
  gap: 10px;
  max-width: 300px;
  height: 35px;
  margin-top: 20px;
  padding: 0px 15px;
  text-align: center;
  border-radius: 5px;
  font-size: 19px;
  color: #ffffff;
  transition: 200ms;
}
.follow {
  background-color: #2374e1;
  cursor: pointer;
  &:hover {
    background-color: #2375e1ec;
  }
}
.unfollow {
  background-color: #81be8b;
  cursor: pointer;
  &:hover {
    background-color: #c74242;
  }
}
</style>
