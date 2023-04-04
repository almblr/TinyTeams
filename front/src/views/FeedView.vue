<template>
  <div id="container" ref="posts">
    <TheHeader />
    <main id="posts">
      <PostContainer />
    </main>
    <button class="createPost" @click="showCreateModal = true">
      <fa icon="fa-solid fa-feather" class="show-modal icon" />
    </button>
    <Teleport to="body">
      <CreatePost
        :show="showCreateModal"
        @close="showCreateModal = false"
        :modalType="'New'"
        :post="{}"
      >
      </CreatePost>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { socket } from "@/socket.js";
import { useInfiniteScroll } from "@vueuse/core";
import usePostStore from "@//stores/postStore.js";
import TheHeader from "@//components/layout/TheHeader.vue";
import CreatePost from "@/components/posts/CreatePost.vue";
import PostContainer from "@/components/posts/PostContainer.vue";

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
  overflow-y: auto;
  position: relative;
  background-color: var(--backgroundMain);
}

#posts {
  @include fdCol-aiCt;
  transition: 200ms;
  min-height: min-content;
  padding-top: 30px;
  gap: 30px;
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
