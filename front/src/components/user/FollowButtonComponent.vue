<template>
  <div class="container" v-if="isSubscribed !== null">
    <div
      v-if="!isSubscribed && !loggedInUserProfile"
      class="btn follow"
      @click="updateFollow('follow')"
    >
      <fa icon="fa-solid fa-user-plus icon" />S'abonner
    </div>
    <div
      v-if="isSubscribed && !loggedInUserProfile"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
      class="btn unfollow"
      @click="updateFollow('unfollow')"
    >
      <fa icon="fa-solid fa-check icon" v-if="!isHovered" />
      <fa icon="fa-solid fa-xmark icon" v-if="isHovered" />Abonné
    </div>
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
const isSubscribed = ref(null);

const updateFollow = async (type) => {
  if (type === "follow") {
    await followStore.sendFollow(props.userId);

    socket.emit("sendFollow", {
      author: sesStr.userId,
      isFollowing: props.userId,
    });
    isHovered.value = false;
  } else {
    const followId = followStore.follows.find(
      (follow) =>
        follow.author === sesStr.userId && follow.isFollowing === props.userId
    ).id;
    await followStore.unfollow(followId);
    isHovered.value = true;
  }
  isSubscribed.value = type === "follow";
};

onMounted(async () => {
  await followStore.getOne(props.userId);
  const follow = followStore.follows.find(
    (follow) =>
      follow.author === sesStr.userId && follow.isFollowing === props.userId
  );
  follow ? (isSubscribed.value = true) : (isSubscribed.value = false);
});
</script>

<style lang="scss" scoped>
.btn {
  @include jcCt-aiCt;
  gap: 10px;
  max-width: 300px;
  width: 110px;
  height: 35px;
  margin-top: 20px;
  padding: 0px 15px;
  text-align: center;
  border-radius: 5px;
  font-size: 15px;
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
