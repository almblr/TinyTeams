<template>
  <div class="container">
    <div class="band"></div>
    <img class="profilePicture" :src="userStore.user.profilePicture" />
    <div class="userInfo">
      <h2 class="userInfo__name">
        {{ userStore.user.firstname }} {{ userStore.user.lastname }}
      </h2>
      <p class="userInfo__job">{{ userStore.user.job }}</p>
      <router-link
        to="/settings"
        v-if="userStore.user.id === userLS.id"
        class="userInfo__btn edit"
        >Modifier votre profil
      </router-link>
      <FollowButton v-else :userId="userStore.user.id" />
    </div>
  </div>
</template>

<script setup>
import useUserStore from "@/stores/userStore";
import FollowButton from "@/components/users/FollowButton.vue";
const userLS = JSON.parse(sessionStorage.getItem(`user`));
const userStore = useUserStore();
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  @include fdCol-jcCt-aiCt;
  max-width: 768px;
  width: 100%;
  min-height: 250px;
  background-color: var(--backgroundSecond);
  transition: 200ms;
  box-shadow: 5px 0 20px rgba(0, 0, 0, 0.2);
}
.band {
  min-width: 100%;
  height: 65px;
  background-color: #107aca;
}
.profilePicture {
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
  color: var(--textColorMain);
  &__name {
    font-size: 1.45rem;
  }
  &__btn {
    @include jcCt-aiCt;
    gap: 10px;
    max-width: 300px;
    height: 35px;
    margin-top: 20px;
    padding: 0 15px;
    text-align: center;
    border-radius: 5px;
    font-size: 19px;
    color: #ffffff;
    transition: 200ms;
    text-decoration: none;
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
  .profilePicture {
    top: 40px;
  }
}
</style>
