<template>
  <TheHeaderComponent />
  <main>
    <span class="test">coucou {{ $route.params.username }}</span>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TheHeaderComponent from "../components/layout/TheHeaderComponent.vue";
import { useUserStore } from "../stores";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const locStr = JSON.parse(localStorage.getItem(`userInfo`));
const token = locStr.token;
const user = ref(null);

onMounted(async () => {
  const username = useRoute().params.username;
  user.value = await userStore.getOne(token, username);
});
</script>

<style lang="scss" scoped>
main {
  display: flex;
  position: absolute;
  top: 50px;
  flex-direction: column;
  gap: 20px;
}
.test {
  color: red;
}
</style>
