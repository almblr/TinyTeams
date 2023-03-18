<template>
  <the-header />
  <main id="main">
    <div class="posts" ref="posts">
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
</template>

<script setup>
import { ref } from "vue";
import { usePostStore } from "../stores";
import PostModal from "@/components/posts/PostModalComponent.vue";
import TheHeader from "@/components/layout/TheHeaderComponent.vue";
import PostComponent from "@/components/posts/PostComponent.vue";
import { useInfiniteScroll } from "@vueuse/core";

const showCreateModal = ref(false);
const posts = ref(null);
const postStore = usePostStore();

useInfiniteScroll(
  posts,
  async () => {
    const lastPost = postStore.posts[postStore.posts.length - 1];
    const idLastPost = lastPost.id;
    await postStore.getAll(idLastPost);
  },
  {
    distance: 10,
  }
);
</script>

<style lang="scss" scoped>
#main {
  @include fdCol-aiCt;
  @include width-height_max;
  background-color: var(--backgroundMain);
  padding-top: 70px;
}
.posts {
  @include fdCol-aiCt;
  width: 100%;
  gap: 30px;
  overflow-y: scroll;

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
  & .icon {
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
    & .icon {
      font-size: 25px;
    }
  }
}
</style>
