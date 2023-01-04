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
    <div :class="downOrUp" v-show="showGifPanel === true">
      <input class="researchBar" placeholder="Rechercher" />
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
const showGifPanel = ref(false);
const btn = ref(null);
const spaceUp = ref(null);

const openGifPanel = () => {
  gifStore.resetGifs();
  gifStore.getTrendsGif(gifStore.start_index);
  showGifPanel.value = !showGifPanel.value;
  gifPanel.value.scrollTop = 0;
};

const downOrUp = computed(() => {
  return {
    "tooltip-up": spaceUp.value === true,
    "tooltip-down": spaceUp.value === false,
    tooltip: true, // default class
  };
});
/* Ferme le gif panel, reset l'index de début (pour l'affichage des gifs), vide le tableau des gifs
rq : la directive du package v-click-outside-element agit quand on clique en dehors de l'élément. Mettre un if permet de ne pas spammer ces instructions */
const closeGifPanel = () => {
  if (showGifPanel.value === true) {
    gifPanel.value.scrollTop = 0;
    showGifPanel.value = false;
  }
};

/* Appelle l'api GIPHY à chaque fois qu'on arrive à la fin du scroll de la tooltip */
const displayNextGifs = () => {
  let start = useGiphyStore().start_index;
  if (
    gifPanel.value.scrollTop + gifPanel.value.clientHeight >=
      gifPanel.value.scrollHeight &&
    showGifPanel.value === true
  ) {
    console.log(start);
    console.log("test");
    gifStore.getTrendsGif(start);
    start = start + 2;
  }
};

const showUrl = (e) => {
  console.log(e.target.src);
};

function calculateAvailableSpace() {
  const clientHeight = document.documentElement.clientHeight;
  const bottomToCenterBtn =
    clientHeight -
    btn.value.getBoundingClientRect().top -
    btn.value.style.width / 2;
  console.log(bottomToCenterBtn);
  if (bottomToCenterBtn > clientHeight / 2) {
    spaceUp.value = false; // + de place en bas
  } else {
    spaceUp.value = true; // + de place en haut
  }
}

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
  justify-content: center;
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
