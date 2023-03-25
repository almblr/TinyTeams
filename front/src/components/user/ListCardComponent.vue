<template>
  <article v-for="user in props.users" :key="user.id" v-if="props.users">
    <img :src="user.profilPicture" alt="profilPicture" class="userPicture" />
    <div class="userInfos">
      <router-link :to="`/users/${user.username}`">
        <h2>{{ user.firstname }} {{ user.lastname }}</h2>
      </router-link>
      <h3>Jobless</h3>
    </div>
    <div>
      <FollowButtonComponent
        :userId="user.id"
        :loggedInUserProfile="user.id === connectedUser"
      />
    </div>
  </article>
</template>

<script setup>
import FollowButtonComponent from "@/components/user/FollowButtonComponent.vue";

const props = defineProps({
  users: Array,
});
const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const connectedUser = sesStr.userId;
</script>

<style lang="scss" scoped>
article {
  @include aiCt;
  position: relative;
  width: 95%;
  max-width: 700px;
  min-width: 260px;
  border-radius: 10px;
  min-height: 130px;
  background-color: var(--backgroundSecond);
  box-shadow: 5px 0px 20px var(--shadowColor);
  color: var(--textColorMain);
  padding: 15px;
  gap: 30px;
  a {
    text-decoration: none;
    color: var(--textColorMain);
  }
  .userPicture {
    width: 80px;
    height: 80px;
    border-radius: 40px;
    object-fit: cover;
  }
  & .userInfos {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    flex: 1;
  }
}
</style>
