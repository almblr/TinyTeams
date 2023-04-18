<template>
  <button
    v-if="isSubscribed !== null && !loggedInUserProfile"
    class="btn"
    :class="{ follow: !isSubscribed, unfollow: isSubscribed }"
    @click="updateFollow(isSubscribed ? 'unfollow' : 'follow')"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <span v-if="!isSubscribed">
      <ion-icon name="person-add"></ion-icon>
      S'abonner
    </span>
    <span v-if="isSubscribed">
      <ion-icon name="checkmark" v-if="!isHovered"></ion-icon>
      <ion-icon name="checkmark" v-else></ion-icon>Abonné
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useUserStore from "@/stores/userStore";
import useFollowStore from "@/stores/followStore.js";
import { socket } from "../../socket.js";

const props = defineProps({
  userId: Number,
  loggedInUserProfile: Boolean,
});

const userLS = JSON.parse(sessionStorage.getItem(`user`));

const userStore = useUserStore();
const followStore = useFollowStore();
const isHovered = ref(false);
const isSubscribed = ref(null);

const updateFollow = async (type) => {
  if (type === "follow") {
    const follow = await followStore.sendFollow(props.userId);
    socket.emit("newFollow", {
      senderId: userLS.id,
      senderUsername: `${userLS.firstname} ${userLS.lastname}`,
      senderProfilePicture: userLS.profilePicture,
      type: "newFollow",
      notifiableId: follow.id,
      receiver: follow.isFollowing,
      token: userStore.token,
    });
    isHovered.value = false;
  } else {
    const followId = followStore.follows.find(
      (follow) =>
        follow.author === userLS.id && follow.isFollowing === props.userId
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
      follow.author === userLS.id && follow.isFollowing === props.userId
  );
  follow ? (isSubscribed.value = true) : (isSubscribed.value = false);
});
</script>

<style lang="scss" scoped>
.btn {
  @include jcCt-aiCt;
  max-width: 300px;
  width: 110px;
  height: 35px;
  margin-top: 20px;
  padding: 0px 15px;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  transition: 200ms;
  color: #ffffff;
  cursor: pointer;
  span {
    @include jcCt-aiCt;
    gap: 10px;
  }
}
.follow {
  background-color: #2374e1;
  &:hover {
    background-color: #2375e1ec;
  }
}
.unfollow {
  background-color: #81be8b;
  &:hover {
    background-color: #c74242;
  }
}

@media all and (min-width: 768px) {
  .btn {
    width: 170px;
    font-size: 20px;
  }
}
</style>
