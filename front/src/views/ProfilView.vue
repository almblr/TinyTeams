<template>
  <TheHeaderComponent />
  <main>
    <ProfilCardComponent />
    <PostComponent />
  </main>
</template>

<script setup>
import TheHeaderComponent from "@/components/layout/TheHeaderComponent.vue";
import ProfilCardComponent from "@/components/user/ProfilCardComponent.vue";
import PostComponent from "@/components/posts/PostComponent.vue";
</script>

<style lang="scss" scoped>
main {
  @include fdCol-aiCt;
  width: 100%;
  height: 100vh;
  row-gap: 20px;
  padding-top: 50px;
  overflow-y: scroll;
  background-color: rgb(240, 240, 240);
}
// .posts {
//   @include fdCol-jcCt-aiCt;
//   max-width: 1000px;
//   width: 100%;
//   overflow: auto;
// }
</style>
