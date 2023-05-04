<template>
  <TheHeader />
  <main id="container">
    <div class="error">
      <img src="../assets/where.jpg" alt="notfound" />
      <h1>
        {{ errorMessage }}
      </h1>
    </div>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import TheHeader from "@/components/layout/TheHeader.vue";

const route = useRoute();

const errorMessage = computed(() => {
  switch (route.params.type) {
    case "user":
      return "Nous sommes désolés, il semblerait que cet utilisateur n'existe pas";
    case "post":
      return "Le post que vous essayez de charger a peut-être été supprimé :(";
    case "conversation":
      return "La conversation que vous essayez de charger n'existe pas";
  }
});
</script>

<style lang="scss" scoped>
#container {
  @include container;
  display: flex;
  justify-content: center;
  color: var(--textColorSecond);
  & > .error {
    @include fdCol-jcCt-aiCt;
    max-height: 500px;
    gap: 30px;
    & > img {
      width: 300px;
      height: 300px;
    }
    & > h1 {
      padding: 10px;
      font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
        "Lucida Sans", Arial, sans-serif;
      font-size: 1.5rem;
      text-align: center;
    }
  }
}
</style>
