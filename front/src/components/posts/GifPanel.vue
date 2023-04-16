<template>
  <div
    class="btn"
    ref="btn"
    v-on-click-outside="closeGifPanel"
    @click="calculateAvailableSpace"
    title="Insérer un gif"
  >
    <div class="icon" @click="openGifPanel">
      <ion-icon name="image"></ion-icon>
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
import useGiphyStore from "@/stores/giphyStore.js";
import { vOnClickOutside } from "@vueuse/components";

const emit = defineEmits(["showUploadedGif"]);
const props = defineProps({
  color: {
    type: String,
  },
  tooltipPosition: {
    type: String,
  },
});

const gifStore = useGiphyStore();
const gifPanel = ref(null);
const btn = ref(null);
const spaceUp = ref(null);
const isGifPanelOpen = ref(false);
const searchedTerm = ref("");

const tooltipClass = computed(() => {
  const direction = spaceUp.value ? "up" : "down";
  return `tooltip-${direction} tooltip`;
});

const tooltipStyle = computed(() => {
  if (props.tooltipPosition === "right") {
    return {
      right: "initial",
      left: "2px",
      leftBorder: 0,
      borderRight: "9px solid transparent",
      borderLeft: "none",
    };
  }
  if (props.tooltipPosition === "left") {
    return {
      right: "2px",
      rightBorder: 0,
      left: "initial",
      borderRight: "none",
      borderLeft: "9px solid transparent",
    };
  }
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
  @include jcCt-aiCt;
  position: relative;
  color: v-bind("props.color");
  cursor: pointer;
  width: 30px;
  height: 25px;
  border-radius: 5px;
  &:hover {
    background-color: var(--addMediaBackground);
  }
  & > .icon {
    @include jcCt-aiCt;
    position: relative;
    font-size: 23px;
  }
}

.tooltip-down {
  top: 30px;
}

.tooltip-up {
  top: -311px;
}
.tooltip {
  @include fdCol-aiCt;
  position: absolute;
  right: v-bind("tooltipStyle.right");
  left: v-bind("tooltipStyle.left");
  z-index: 99;
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
  right: v-bind("tooltipStyle.rightBorder");
  left: v-bind("tooltipStyle.leftBorder");
  height: 0;
  width: 0;
  position: absolute;
  border-right: v-bind("tooltipStyle.borderRight");
  border-left: v-bind("tooltipStyle.borderLeft");
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
