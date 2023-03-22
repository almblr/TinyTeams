<template>
  <RouterView />
</template>

<script setup></script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");
@import "./scss/_var.scss";

#app {
  height: 100vh;
  min-width: 100%;
  overflow-y: hidden;
}

*,
::after,
::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Lato", sans-serif;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* SCROLLBAR */

::-webkit-scrollbar {
  width: 13px;
}

/* Track */
::-webkit-scrollbar-track {
  background: var(--backgroundMain);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--colorDivider);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: var(--addMediaBackground);
}
</style>
