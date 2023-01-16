<template>
  <the-header />
  <main>
    <div class="posts">
      <PostComponent />
    </div>
  </main>
  <button class="createPost" @click="showCreateModal = true">
    <fa icon="fa-solid fa-feather" class="show-modal test" />
  </button>
  <Teleport to="body">
    <post-modal
      :show="showCreateModal"
      @close="closeCreateModal"
      :modalType="'New'"
      :post="{}"
    >
    </post-modal>
  </Teleport>
</template>

<script setup>
import { ref, nextTick } from "vue";
import PostModal from "@/components/posts/PostModalComponent.vue";
import TheHeader from "@/components/layout/TheHeaderComponent.vue";
import PostComponent from "@/components/posts/PostComponent.vue";
import { usePostStore } from "@/stores/index.js";
const postStore = usePostStore();

let showCreateModal = ref(false);

const closeCreateModal = async () => {
  showCreateModal.value = false;
  await nextTick(); // Attend le prochain cycle de màj Vue (50 ms environ)
  await postStore.getAll();
};
</script>

<style lang="scss" scoped>
main {
  @include fdCol-aiCt;
  @include width-height_max;
  row-gap: 30px;
  background-color: rgb(240, 240, 240);
  overflow-y: scroll;
  padding-top: 6em;
  &__header {
    height: 50px;
  }
}
.posts {
  @include fdCol-aiCt;
  width: 100%;
  gap: 30px;
  padding-bottom: 20px;

  & p {
    color: black;
  }
  & img {
    width: 200px;
    height: 200px;
  }
}
/* SCROLLBAR */

::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background: rgba(255, 41, 3, 0.863);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(255, 38, 0);
}

.createPost {
  @include jcCt-aaCt;
  position: absolute;
  border: none;
  bottom: 40px;
  right: 40px;
  width: 65px;
  height: 65px;
  background-color: rgb(233, 50, 18);
  border-radius: 70px;
  transition: 0.3s;
  box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.432);
  &:hover {
    transition: 0.3s;
    cursor: pointer;
    box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.562);
  }
  & .test {
    font-size: 30px;
    color: white;
  }
}
@media all and (max-width: 789px) {
  .createPost {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    & .test {
      font-size: 25px;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
