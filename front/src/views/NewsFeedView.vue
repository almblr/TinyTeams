<template>
  <div id="container" ref="posts">
    <the-header />
    <main id="main">
      <div class="posts">
        <post-component />
      </div>
    </main>
    <button class="createPost" @click="showCreateModal = true">
      <fa icon="fa-solid fa-feather" class="show-modal icon" />
    </button>
    <Teleport to="body">
      <post-modal
        :show="showCreateModal"
        @close="showCreateModal = false"
        :modalType="'New'"
        :post="{}"
      >
      </post-modal>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import { usePostStore } from "../stores";
import PostModal from "@/components/posts/PostModalComponent.vue";
import TheHeader from "@/components/layout/TheHeaderComponent.vue";
import PostComponent from "@/components/posts/PostComponent.vue";

const emit = defineEmits(["sendRefs"]);
const postStore = usePostStore();
const showCreateModal = ref(false);
const posts = ref(null);

useInfiniteScroll(
  posts,
  async () => {
    const lastPost = postStore.posts[postStore.posts.length - 1];
    const lastPostId = lastPost.id;
    await postStore.getAll(undefined, lastPostId);
  },
  {
    distance: 10,
  }
);
</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  overflow-y: scroll;
  position: relative;
}

#main {
  @include fdCol-aiCt;
  background-color: var(--backgroundMain);
  transition: 200ms;
  min-height: 100%;
}
.posts {
  @include fdCol-aiCt;
  width: 100%;
  gap: 30px;
  padding-top: 30px;
  & p {
    color: black;
  }
  & img {
    width: 200px;
    height: 200px;
  }
}
.createPost {
  @include jcCt-aiCt;
  position: fixed;
  border: none;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #2374e1;
  border-radius: 70px;
  transition: 0.3s;
  box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.432);
  &:hover {
    transition: 0.3s;
    cursor: pointer;
    box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.562);
  }
  & .icon {
    font-size: 25px;
    color: white;
  }
}
@media all and (min-width: 789px) {
  .createPost {
    bottom: 25px;
    right: 25px;
    width: 60px;
    height: 60px;
    & .icon {
      font-size: 30px;
    }
  }
}
</style>
