<template>
  <TheHeaderComponent />
  <main>
    <span class="test">coucou {{ $route.params.id }}</span>
  </main>
</template>

<script setup>
import { onMounted } from "vue";
import TheHeaderComponent from "../components/layout/TheHeaderComponent.vue";
import { useUserStore } from "../stores";

const userStore = useUserStore();

// onMounted(async () => {
//   const user = await userStore.getOne(token, userId);
//   console.log(test.id);
// });

onMounted(() => {});
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
