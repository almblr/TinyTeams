<template>
  <div
    class="btn"
    ref="btn"
    v-click-outside-element="closeGifPanel"
    @click="calculateAvailableSpace"
  >
    <div class="icon" @click="openGifPanel">
      <fa icon="fa-solid fa-image" />
    </div>
    <div :class="tooltipClass" v-show="isGifPanelOpen === true">
      <input
        class="researchBar"
        placeholder="Rechercher"
        v-model="searchedTerm"
        @input="showSearchedGifs"
      />
      <div class="displayGifs" ref="gifPanel" @scroll="displayNextGifs()">
        <img
          v-for="gif of gifStore.gifs"
          :src="gif.images.original.url"
          @click="showUrl($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useGiphyStore } from "../../stores";

const gifStore = useGiphyStore();
const gifPanel = ref(null);
const btn = ref(null);
const spaceUp = ref(null);
const isGifPanelOpen = ref(false);
const searchedTerm = ref("");

const tooltipClass = computed(() => {
  return {
    "tooltip-up": spaceUp.value === true,
    "tooltip-down": spaceUp.value === false,
    tooltip: true, // default class
  };
});

const calculateAvailableSpace = () => {
  const clientHeight = document.documentElement.clientHeight;
  const bottomToCenterBtn =
    clientHeight -
    btn.value.getBoundingClientRect().top -
    btn.value.style.width / 2;
  if (bottomToCenterBtn > clientHeight / 2) {
    spaceUp.value = false; // More space down
  } else {
    spaceUp.value = true; // More space up
  }
};

const openGifPanel = () => {
  gifStore.resetGifs();
  gifStore.getTrendsGif();
  searchedTerm.value = "";
  isGifPanelOpen.value = !isGifPanelOpen.value;
  gifPanel.value.scrollTop = 0;
};

/* La directive du package v-click-outside-element agit quand on clique en dehors de l'élément. Mettre un if permet de ne pas spammer ces instructions */
const closeGifPanel = () => {
  if (isGifPanelOpen.value === true) {
    gifPanel.value.scrollTop = 0;
    isGifPanelOpen.value = false;
    searchedTerm.value = "";
  }
};

const showSearchedGifs = async () => {
  if (searchedTerm.value === "") {
    await gifStore.resetGifs();
    await gifStore.getTrendsGif();
  } else {
    // If user clears the input
    await gifStore.resetGifs();
    await gifStore.searchGif(gifStore.offset, searchedTerm.value);
  }
};

/* Infinite scroll */
const displayNextGifs = () => {
  if (
    gifPanel.value.scrollTop + gifPanel.value.clientHeight >=
      gifPanel.value.scrollHeight &&
    isGifPanelOpen.value === true
  ) {
    if (searchedTerm.value !== "") {
      let start = gifStore.offset;
      gifStore.searchGif(start, searchedTerm.value);
      start = start + 2;
      console.log(searchedTerm.value);
    } else {
      let start = gifStore.offset;
      gifStore.getTrendsGif(start);
      start = start + 2;
    }
  }
};

const showUrl = (e) => {
  console.log(e.target.src);
};

/* Ne surtout pas faire le onMounted pour appeler l'api GIPHY au niveau de composant car il se fera autant de fois que le composant est appelé (= nombre de posts sur la page) */
onMounted(() => {
  gifPanel.value.scrollTop = 0;
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

.tooltip-down {
  top: 30px !important;
}

.tooltip-up {
  top: -300px;
}
.tooltip {
  position: absolute;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(39, 39, 39);
  min-width: 250px;
  height: 290px;
  color: #f1f1f1;
  font-size: 16px;
  right: 0px;
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

.tooltip:after {
  content: "";
  top: 100%;
  right: 0;
  height: 0;
  width: 0;
  position: absolute;
  border-left: 9px solid transparent;
  border-top: 6px solid rgb(39, 39, 39);
}
.tooltip-down::after {
  bottom: 100% !important;
  border-bottom: 6px solid rgb(39, 39, 39) !important;
  top: initial;
  border-top: initial;
}
</style>
