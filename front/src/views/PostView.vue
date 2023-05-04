<template>
  <div id="container">
    <TheHeader />
    <main id="post">
      <PostContainer />
    </main>
  </div>
</template>

<script setup>
import TheHeader from "@//components/layout/TheHeader.vue";
import PostContainer from "@/components/posts/PostContainer.vue";
</script>

<style lang="scss" scoped>
#container {
  @include container;
}

#post {
  @include fdCol-aiCt;
  transition: 200ms;
  min-height: min-content;
  padding-top: 30px;
}
</style>
