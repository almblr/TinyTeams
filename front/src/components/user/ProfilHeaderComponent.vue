<template>
  <header class="container">
    <ProfilPictureComponent
      :url="props.profilPictureUrl"
      width="40px"
    ></ProfilPictureComponent>
  </header>
</template>

<script setup>
import ProfilPictureComponent from "@/components/posts/ProfilPictureComponent.vue";

const props = defineProps({
  backgroundUrl: String,
  profilPictureUrl: String,
});
</script>

<style lang="scss" scoped>
.container {
  @include jcCt-aiCt;
  width: 100%;
  max-height: 400px;
  background-color: gray;
}
</style>
