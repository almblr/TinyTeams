<template>
  <RouterView />
</template>

<script setup></script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");
@import "./scss/_var.scss";

#app {
  position: relative;
  height: 10px;
  min-height: 100vh;
  min-width: 100vw;
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
