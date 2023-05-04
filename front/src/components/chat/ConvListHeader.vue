<template>
  <div class="header">
    <h2>Discussions</h2>
    <button class="header__new" @click="openNewMessage">
      <ion-icon name="add-outline"></ion-icon>
    </button>
  </div>
</template>

<script setup>
import router from "@/router/index.js";
import useChatStore from "@/stores/chatStore.js";

const chatStore = useChatStore();

const openNewMessage = () => {
  router.push("/messages/");
  chatStore.newMessage = true;
};
</script>

<style lang="scss" scoped>
.header {
  @include jcSb-aiCt;
  width: 100%;
  color: var(--textColorSecond);
  padding: 10px 0 0 10px;
  margin-bottom: 20px;
}

@media all and (min-width: 768px) {
  .header {
    &__new {
      @include jcCt-aiCt;
      width: 40px;
      height: 40px;
      color: var(--textColorMain);
      border-radius: 50%;
      border: none;
      background-color: transparent;
      font-size: 2rem;
      transition: 200ms;
      background-color: rgba(173, 171, 171, 0.1);
      cursor: pointer;
      &:hover {
        background-color: rgba(173, 171, 171, 0.2);
      }
    }
  }
}
</style>
