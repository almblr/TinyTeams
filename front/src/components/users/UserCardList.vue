<template>
  <article v-for="user in props.users" :key="user.id" v-if="props.users">
    <img :src="user.profilePicture" alt="profilePicture" class="userPicture" />
    <div class="userInfos">
      <router-link :to="`/users/${user.id}`">
        <h2>{{ user.firstname }} {{ user.lastname }}</h2>
      </router-link>
      <h3>{{ user.job }}</h3>
    </div>
    <div v-if="route.name === 'User'">
      <FollowButton
        :userId="user.id"
        :loggedInUserProfile="user.id === userLS.id"
      />
    </div>
    <SendMessageBtn v-else :userId="user.id" />
  </article>
</template>

<script setup>
import { useRoute } from "vue-router";
import FollowButton from "@/components/users/FollowButton.vue";
import SendMessageBtn from "@/components/buttons/SendMessage.vue";

const props = defineProps({
  users: Array,
});

const route = useRoute();
const userLS = JSON.parse(sessionStorage.getItem(`user`));
</script>

<style lang="scss" scoped>
article {
  @include aiCt;
  position: relative;
  max-width: 768px;
  width: 100%;
  min-height: 130px;
  background-color: var(--backgroundSecond);
  color: var(--textColorMain);
  padding: 15px;
  gap: 20px;
  a {
    text-decoration: none;
    color: var(--textColorMain);
  }
  .userPicture {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    object-fit: cover;
  }
  & .userInfos {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    flex: 1;
    h2 {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    h3 {
      font-size: 15px;
      font-weight: 400;
    }
  }
}

@media all and (min-width: 768px) {
  article {
    box-shadow: 5px 0px 20px var(--shadowColor);
    padding: 15px 40px 15px 15px;
    & .userInfos {
      h2 {
        font-size: 25px;
        font-weight: 600;
        margin-bottom: 5px;
      }
      h3 {
        font-size: 20px;
        font-weight: 400;
      }
    }
  }
}
</style>
