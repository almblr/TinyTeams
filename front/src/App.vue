<template>
  <RouterView />
</template>

<script setup>
import { useDark } from "@vueuse/core";

const isDark = useDark();
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");
@import "./scss/_var.scss";

#app {
  height: 100vh;
  min-width: 100%;
  overflow: hidden;
}

*,
::after,
::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Lato", sans-serif;
}
</style>
