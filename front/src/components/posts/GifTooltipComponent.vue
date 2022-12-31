<template>
  <div class="btn" v-click-outside-element="close">
    <div class="icon" @click="showGifPanel = !showGifPanel">
      <fa icon="fa-solid fa-image" />
    </div>
    <div class="tooltip" v-show="showGifPanel === true">
      <input class="researchBar" placeholder="Rechercher" />
      <div class="displayGifs" ref="test" @scroll="viewScroll()">
        <img v-for="gif of gifs" :src="gif" @click="showUrl($event)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useGiphyStore } from "../../stores";

const gifStore = useGiphyStore();
const gifs = gifStore.gifs;
const showGifPanel = ref(false);
const test = ref(null);
let start = ref(0);

const close = (el) => {
  showGifPanel.value = false;
  test.value.scrollTop = 0;
};

const viewScroll = () => {
  if (
    test.value.scrollTop + test.value.clientHeight >=
    test.value.scrollHeight
  ) {
    console.log(start.value);
    setTimeout(() => {
      start.value = start.value + 15;
      gifStore.getTrendsGif(start.value);
    }, 500);
  }
};

// const showUrl = (e) => {
//   console.log(e.target.src);
// };

onMounted(() => {
  gifStore.getTrendsGif();
  nextTick();
  console.log(gifs);
});
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  color: #575656;
  & > .icon {
    position: relative;
    font-size: 19px;
  }
}

.tooltip {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(39, 39, 39);
  min-width: 250px;
  color: #f1f1f1;
  font-size: 16px;
  right: 0px;
  top: -300px;
  transition: all 0.4s ease;
  & > .researchBar {
    margin: 5px 0;
    background-color: #e0e0e0;
    padding-left: 10px;
    height: 30px;
    min-width: 90%;
    border: none;
    border-radius: 20px;
    &:focus {
      outline: none;
    }
  }
  & > .displayGifs {
    display: flex;
    flex-flow: row wrap;
    max-height: 250px;
    overflow: scroll;
  }
  & > .displayGifs > img {
    max-width: 250px;
    cursor: pointer;
  }
  &:hover {
    cursor: initial;
  }
}

.tooltip::after {
  content: "";
  top: 100%;
  right: 0px;
  height: 0;
  width: 0;
  position: absolute;
  border-top: 6px solid rgb(39, 39, 39);
  border-left: 9px solid transparent;
}
</style>
