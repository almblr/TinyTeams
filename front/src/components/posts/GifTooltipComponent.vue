<template>
  <div
    class="btn"
    ref="btn"
    v-on-click-outside="closeGifPanel"
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
      />
      <div class="displayGifs" ref="gifPanel" @scroll="displayNextGifs()">
        <img
          v-for="gif of gifStore.gifs"
          :src="gif.images.original.url"
          @click="GetUploadedGif($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useGiphyStore } from "../../stores";
import { vOnClickOutside } from "@vueuse/components";

const gifStore = useGiphyStore();
const gifPanel = ref(null);
const btn = ref(null);
const spaceUp = ref(null);
const isGifPanelOpen = ref(false);
const searchedTerm = ref("");

const emit = defineEmits(["showUploadedGif"]);

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

/* Mettre un if permet de ne pas spammer ces instructions */
const closeGifPanel = () => {
  if (isGifPanelOpen.value === true) {
    gifPanel.value.scrollTop = 0;
    isGifPanelOpen.value = false;
    searchedTerm.value = "";
  }
};

/* Infinite scroll */
const displayNextGifs = () => {
  if (
    gifPanel.value.scrollTop + gifPanel.value.clientHeight >=
      gifPanel.value.scrollHeight - 5 &&
    isGifPanelOpen.value === true
  ) {
    if (searchedTerm.value !== "") {
      gifStore.searchGif(searchedTerm.value);
    } else {
      gifStore.getTrendsGif();
    }
  }
};

/* Affiche la preview du fichier (l'image) uploadé  */
const GetUploadedGif = async (event) => {
  const gif = event.target.src;
  isGifPanelOpen.value = false;
  emit("showUploadedGif", gif);
};

watch(
  () => searchedTerm.value,
  async (newValue) => {
    if (newValue === "") {
      await gifStore.resetGifs();
      await gifStore.getTrendsGif();
    } else {
      await gifStore.resetGifs();
      await gifStore.searchGif(searchedTerm.value);
    }
  }
);
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
  top: -310px;
}
.tooltip {
  @include fdCol-aiCt;
  position: absolute;
  right: 0px;
  background: rgb(39, 39, 39);
  min-width: 250px;
  height: 310px;
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
    max-height: 270px;
    overflow-y: overlay;
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

/* SCROLLBAR */

::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.5);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.7);
}
</style>
