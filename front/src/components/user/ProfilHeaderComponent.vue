<template>
  <header class="container">
    <div class="band"></div>
    <img class="profilPicture" :src="props.profilPictureUrl" />
  </header>
</template>

<script setup>
const props = defineProps({
  profilPictureUrl: String,
});
</script>

<style lang="scss" scoped>
.container {
  @include fdCol-aiCt;
  width: 100%;
  max-width: 650px;
  min-height: 300px;
  border-radius: 10px;
  background-color: white;
  margin-top: 2em;
}

.band {
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  min-width: 100%;
  height: 65px;
  background-color: rgb(83, 112, 207);
}

.profilPicture {
  position: absolute;
  top: 60px;
  width: 70px;
  height: 70px;
  border-radius: 35px;
  object-fit: cover;
  border: 2px solid white;
}
</style>
