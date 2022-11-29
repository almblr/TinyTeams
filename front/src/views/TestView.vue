<template>
  <div class="container">
    <v-text-field
      density="compact"
      label="First name"
      hide-details="auto"
      hint="coucou"
    ></v-text-field>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.container {
  min-width: 100vw;
  min-height: 100vh;
  background-color: rgb(252, 252, 252);
  margin: 0;
}

#input {
  background-color: rgb(163, 13, 13);
  height: 50px;
}
</style>
