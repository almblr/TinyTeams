<template>
  <div id="container">
    <LoginFormComponent />
  </div>
</template>

<script setup>
import LoginFormComponent from '../components/LoginFormComponent.vue';
</script>

<style lang="scss" scoped>
#container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../assets/entreprise.jpg');
  background-size: cover;
}

@media all and (min-width: 1440px) {
  #container {
    flex-direction: row;
    justify-content: flex-end;
    padding-right: 10%;
  }
}
</style>
