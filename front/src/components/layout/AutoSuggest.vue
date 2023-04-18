<template>
  <div id="user-searchBar">
    <div class="search-user">
      <label for="search"> À :</label>
      <input
        type="text"
        id="search"
        v-model="searchTerm"
        @click="showTooltip = true"
        @input="loadUsers"
      />
    </div>
    <div class="tooltip" v-if="showTooltip" ref="tooltip">
      <ul>
        <li
          v-if="searchTerm"
          v-for="user in users"
          :key="user"
          @click="selectUser(user)"
        >
          <img :src="user.profilePicture" alt="profilePicture" />
          <span class="name">
            {{ user.firstname + " " + user.lastname }}
          </span>
          <span class="job">
            {{ user.job }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useUserStore from "@/stores/userStore.js";
import router from "@/router/index.js";
import { onClickOutside } from "@vueuse/core";

const userStore = useUserStore();
const chatStore = useUserStore();
const users = ref(null);
const tooltip = ref(null);
const showTooltip = ref(false);
const searchTerm = ref("");
const selectedUser = ref("");

const loadUsers = async () => {
  if (!searchTerm.value) return (users.value = null);
  users.value = await userStore.getAll(searchTerm.value);
};

onClickOutside(tooltip, () => {
  showTooltip.value = false;
});

const selectUser = (user) => {
  chatStore.newMessage = true;
  selectedUser.value = user;
  searchTerm.value = "";
  chatStore.showContactList = false;
  showTooltip.value = false;
  router.push(`/messages/new/${user.id}`);
};
</script>

<style lang="scss" scoped>
#user-searchBar {
  display: flex;
  position: relative;
  width: 100%;
  min-height: 50px;
  height: 50px;
  .search-user {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-left: 15px;
    background-color: var(--backgroundSecond);
    border-bottom: 1px solid var(--border);
    label {
      color: var(--textColorMain);
      font-weight: lighter;
      font-size: 1.2rem;
    }
    input {
      height: 50px;
      flex: 1;
      padding-left: 10px;
      outline: none;
      border: none;
      background-color: transparent;
      caret-color: var(--textColorMain);
      color: var(--textColorMain);
      font-size: 1.2rem;
    }
  }
  .tooltip {
    position: absolute;
    z-index: 100;
    top: 47px;
    left: 50px;
    width: 330px;
    height: 400px;
    background-color: var(--backgroundSecond);
    border-radius: 10px;
    overflow-y: auto;
    border: 1px solid rgba(190, 189, 189, 0.103);
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.103);
    & ul {
      padding: 5px;
      & li {
        text-decoration: none;
        display: flex;
        align-items: center;
        width: 100%;
        gap: 10px;
        height: 50px;
        font-size: 1, 2rem;
        border-radius: 10px;
        color: var(--textColorMain);
        padding-left: 5px;
        cursor: pointer;
        &:hover {
          background-color: var(--hover);
        }
        & img {
          object-fit: cover;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        & .job {
          position: absolute;
          right: 10px;
          font-size: 0.9rem;
          color: var(--textColorMain);
          color: rgba(138, 138, 241, 0.918);
        }
      }
    }
  }
}
</style>
