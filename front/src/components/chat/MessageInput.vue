<template>
  <div class="container" ref="container">
    <div class="container__imagePreview" size="cover" v-if="mediaPreview">
      <ImagePreview :src="mediaPreview" @remove-image="deleteImagePreview" />
    </div>
    <div class="container__textarea">
      <div title="Insérez une image" @click="!showing">
        <AddMediaButton @showUploadedImg="getUrls" color="#0084ff" />
      </div>
      <GifPanel
        @showUploadedGif="getGif"
        color="#0084ff"
        tooltipPosition="right"
      />
      <textarea
        placeholder="Ecrivez votre message..."
        @keydown.enter.prevent="sendMessage()"
        ref="textarea"
        v-model="input"
      ></textarea>
      <div class="buttons">
        <ion-icon name="send"></ion-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { socket } from "../../socket.js";
import { useRoute } from "vue-router";
import router from "@/router/index.js";
import useChatStore from "@/stores/chatStore.js";
import { useTextareaAutosize } from "@vueuse/core";
import AddMediaButton from "@//components/buttons/AddMediaButton.vue";
import GifPanel from "@/components/posts/GifPanel.vue";
import ImagePreview from "@//components/layout/ImagePreview.vue";

const chatStore = useChatStore();
const { textarea, input } = useTextareaAutosize();
const route = useRoute();
const mediaToSend = ref(null);
const mediaPreview = ref(null);
const gif = ref(null);

const deleteImagePreview = () => {
  mediaPreview.value = null;
  mediaToSend.value = null;
};

const getGif = (path) => {
  gif.value = path;
  mediaPreview.value = path;
};
const getUrls = (path, file) => {
  if (file) {
    mediaToSend.value = file;
  } else {
    mediaToSend.value = path;
  }
  mediaPreview.value = path;
};

const sendMessage = async () => {
  if (route.name === "newMessage") {
    const formData = new FormData();
    const contentIsOnlySpaces = !input.value || input.value.trim().length === 0;
    if (contentIsOnlySpaces && !mediaToSend.value) {
      return;
    }
    if (contentIsOnlySpaces && mediaToSend.value) {
      formData.append("imageUrl", mediaToSend.value);
    }
    if (!contentIsOnlySpaces && !mediaToSend.value) {
      formData.append("content", input.value);
    }
    const newConv = await chatStore.createConversation(route.params.userId);
    await chatStore.createMessage(newConv.id, formData);
    input.value = "";
    mediaPreview.value = "";
    mediaToSend.value = "";
    router.push(`/messages/${newConv.id}`);
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: sticky;
  @include fdCol-jcCt-aiCt;
  bottom: 0;
  gap: 5px;
  width: 100%;
  min-height: 50px;
  max-height: 300px;
  padding: 5px;
  background-color: var(--textarea);
  &__imagePreview {
    @include jcCt-aiCt;
    align-self: flex-start;
    width: 70px;
    min-height: 100px;
    max-height: 100px;
  }
  &__textarea {
    display: flex;
    align-items: center;
    width: 100%;
    max-height: 100%;
    & > textarea {
      flex: 1;
      min-height: 35px;
      max-height: 180px;
      padding: 5px 0 0 5px;
      font-size: 1.05rem;
      color: var(--textColorMain);
      caret-color: var(--textColorMain);
      background-color: transparent;
      resize: none;
      border: none;
      &[readonly] {
        cursor: not-allowed;
      }
      &:focus {
        outline: none;
      }
      &::placeholder {
        color: var(--placeholder);
      }
    }
    ion-icon {
      @include jcCt-aiCt;
      font-size: 1.3rem;
      color: #0084ff;
      cursor: pointer;
    }
  }
}
</style>
