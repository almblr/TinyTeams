<template>
  <div
    class="btn"
    ref="btn"
    v-click-outside-element="closeTooltip"
    @click="calculateAvailableSpace"
  >
    <div class="icon" @click="openTooltip">
      <fa icon="fa-solid fa-ellipsis" />
    </div>
    <div class="tooltip" v-show="isTooltipOpen === true">
      <span>Modifier</span>
      <span>Supprimer</span>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";

const btn = ref(null);
const spaceUp = ref(null);
const isTooltipOpen = ref(false);
const trucPourLaConsole = inject("post");
console.log(trucPourLaConsole);

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

const modifyPost = async (id) => {
  postToModify.value = postStore.posts.find((post) => post.id === id);
  showModifyModal.value = true;
  await nextTick();
};

const deletePost = async (postId, token) => {
  await postStore.deleteOne(postId, token);
  await postStore.getAll();
};
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
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
  @include fdCol-aiCt;
  position: absolute;
  right: 0px;
  z-index: 999;
  background: rgb(0, 0, 0);
  opacity: 0.8;
  border-radius: 5px !important;
  overflow: hidden; // Permet de ne pas ignorer les bordures au hover
  & > span {
    min-width: 100px;
    color: white;
    text-align: center;
    transition: 200ms;
    padding: 5px 0px;
    &:hover {
      background: rgb(14, 14, 14);
    }
  }
}
</style>
