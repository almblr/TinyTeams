<template>
  <div class="container">
    <div class="band"></div>
    <img class="profilPicture" :src="user.profilPicture" />
    <div class="userInfo">
      <h2 class="userInfo__name">{{ user.firstname }} {{ user.lastname }}</h2>
      <p class="userInfo__job">Développeur</p>
      <div v-if="loggedInUserProfile" class="userInfo__btn edit">
        <fa icon="fa-solid fa-gear" />Modifier votre profil
      </div>
      <div
        v-if="isSubscribed === false && !loggedInUserProfile"
        class="userInfo__btn follow"
        @click="updateFollow('follow')"
      >
        <fa icon="fa-solid fa-user-plus" />S'abonner
      </div>
      <div
        v-if="isSubscribed && !loggedInUserProfile"
        class="userInfo__btn unfollow"
        @click="updateFollow('unfollow')"
      >
        <fa icon="fa-solid fa-check" />Abonné
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useUserStore, useFollowStore } from "@/stores/index.js";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const followStore = useFollowStore();
const locStr = JSON.parse(localStorage.getItem(`user`));
const usernameLS = locStr.username;
const route = useRoute();
const user = ref({});
const loggedInUserProfile = ref(false);
const isSubscribed = ref(false);

const updateFollow = async (type) => {
  if (type === "follow") {
    await followStore.sendFollow(user.value.id);
    isSubscribed.value = true;
  } else {
    await followStore.unfollow(user.value.id);
    isSubscribed.value = false;
  }
};

onMounted(() => {
  /* Même chose que faire un watch et un onMounted séparemment */
  watchEffect(async () => {
    user.value = await userStore.getOne(route.params.username);
    if (route.params.username === usernameLS) {
      return (loggedInUserProfile.value = true);
    }
    const isFollowing = await followStore.getOne(user.value.id);
    isFollowing ? (isSubscribed.value = true) : null;
  });
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  @include fdCol-aiCt;
  max-width: 700px;
  width: 100%;
  min-height: 250px;
  background-color: white;
  transition: 300ms;
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.2);
}

.band {
  min-width: 100%;
  height: 65px;
  background-color: rgb(36, 51, 100);
}

.profilPicture {
  position: absolute;
  top: 10px;
  width: 110px;
  height: 110px;
  border-radius: 55px;
  object-fit: cover;
  border: 4px solid white;
}

.userInfo {
  @include fdCol-jcCt-aiCt;
  position: relative;
  flex: 1;
  padding-top: 40px;
  width: 100%;
  color: rgb(48, 43, 43);
  &__btn {
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
  :hover {
    cursor: pointer;
  }
  .edit {
    background-color: rgba(65, 65, 65, 0.555);
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
      cursor: pointer;
    }
  }
}

@media all and (min-width: 750px) {
  .container {
    min-height: 300px;
    width: 95%;
    border-radius: 7px;
    margin-top: 2em;
    overflow: hidden;
  }
  .band {
    height: 90px;
  }
  .profilPicture {
    top: 40px;
  }
}
</style>
