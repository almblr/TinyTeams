<template>
  <div class="btn" @click="showGifPanel = !showGifPanel">
    <fa icon="fa-solid fa-image" />
    <div class="tooltip" v-show="showGifPanel === true">
      <div class="researchBar">bar 2 recherche</div>
      <!--       <div class="displayGifs" v-for="gif of gifStore.gifs">{{ gif }}</div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useGiphyStore } from "../../stores";

const gifStore = useGiphyStore();

const showGifPanel = ref(false);

/* Au chargement de la page */
onMounted(() => {
  gifStore.getTrendsGif();
});
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  color: #575656;
  & > * {
    position: relative;
    top: 1px;
    font-size: 19px;
  }
}

.tooltip {
  position: absolute;
  background: #333;
  width: 250px;
  padding: 20px;
  color: #f1f1f1;
  font-size: 16px;
  right: 0px;
  top: -90px;
  margin-bottom: 10px;
  pointer-events: none;
  transition: all 0.4s ease;
}

.tooltip::after {
  content: "";
  top: 100%;
  right: 0px;
  height: 0;
  width: 0;
  position: absolute;
  border-top: 5px solid #333;
  border-left: 7px solid transparent;
}

.btn:hover .tooltip {
  // /* display: block; */
  // pointer-events: all;
  // opacity: 1;
  // transition: all 0.4s ease;
}
</style>
