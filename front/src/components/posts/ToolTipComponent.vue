<template>
  <div
    class="tooltipBtn"
    ref="btn"
    v-click-outside-element="closeTooltip"
    @click="calculateAvailableSpace"
  >
    <div class="icon" @click="openTooltip">
      <fa icon="fa-solid fa-ellipsis" />
    </div>
    <div class="tooltip" v-show="isTooltipOpen === true">
      <div>Modifier</div>
      <div>Supprimer</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const btn = ref(null);
const spaceUp = ref(null);
const isTooltipOpen = ref(false);

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

const openTooltip = () => {
  isTooltipOpen.value = !isTooltipOpen.value;
};

/* La directive du package v-click-outside-element agit quand on clique en dehors de l'élément. Mettre un if permet de ne pas spammer ces instructions */
const closeTooltip = () => {
  if (isTooltipOpen.value === true) {
    isTooltipOpen.value = false;
  }
};
</script>

<style lang="scss" scoped>
.tooltipBtn {
  position: absolute;
  right: 10px;
  color: #424242;
  top: 5px;
  &:hover {
    cursor: pointer;
  }
  & > .icon {
    position: relative;
    font-size: 19px;
  }
}

.tooltip {
  position: relative;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(39, 39, 39);
  min-width: 50px;
  color: #f1f1f1;
  font-size: 16px;
  right: 0px;
  & > div {
    min-width: 50px;
  }
}
</style>
