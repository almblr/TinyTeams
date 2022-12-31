<template>
  <div class="btn" v-click-outside-element="closeGifPanel">
    <div class="icon" @click="openGifPanel">
      <fa icon="fa-solid fa-image" />
    </div>
    <div class="tooltip" v-show="showGifPanel === true">
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
import { ref, onMounted } from "vue";
import { useGiphyStore } from "../../stores";

const gifStore = useGiphyStore();
const gifPanel = ref(null);
const showGifPanel = ref(false);

const openGifPanel = () => {
  gifStore.resetGifs();
  gifStore.getTrendsGif(gifStore.start_index);
  showGifPanel.value = !showGifPanel.value;
  gifPanel.value.scrollTop = 0;
};

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
    setTimeout(() => {
      gifStore.getTrendsGif(start);
      start = start + 2;
    }, 1000);
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
