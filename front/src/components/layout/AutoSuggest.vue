<template>
  <div>
    <label for="search"> À :</label>
    <input
      type="test"
      id="search"
      v-model="searchTerm"
      @input="userStore.getAll()"
    />
    <ul v-if="searchUsers.length">
      <li
        v-for="user in searchUsers"
        :key="user"
        @click="selectUser(user)"
        v-if="searchTerm"
      >
        {{ user.firstname }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import useUserStore from "@/stores/userStore.js";

const userStore = useUserStore();
const users = userStore.users;
const searchTerm = ref("");
const selectedUser = ref("");

const searchUsers = computed(() => {
  let matches = 0;
  return users.filter((user) => {
    if (
      user.firstname.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
      matches < 10
    ) {
      matches++;
      return user;
    }
  });
});

const selectUser = (user) => {
  selectedUser.value = user;
  searchTerm.value = "";
};
</script>

<style lang="scss" scoped>
li,
ul {
  color: white;
}
</style>
