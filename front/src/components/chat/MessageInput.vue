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
        <ion-icon name="send" @click="sendMessage()"></ion-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index.js";
import useChatStore from "@/stores/chatStore.js";
import { useTextareaAutosize } from "@vueuse/core";
import AddMediaButton from "@//components/buttons/AddMediaButton.vue";
import GifPanel from "@/components/posts/GifPanel.vue";
import ImagePreview from "@//components/layout/ImagePreview.vue";

const { textarea, input } = useTextareaAutosize();
const chatStore = useChatStore();
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
  mediaToSend.value = path;
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
  const formData = new FormData();
  const contentIsOnlySpaces = !input.value || input.value.trim().length === 0;
  if (contentIsOnlySpaces && !mediaToSend.value) {
    return;
  }
  if (mediaToSend.value) {
    formData.append("imageUrl", mediaToSend.value);
  }
  if (input.value) {
    formData.append("content", input.value);
  }
  if (route.name === "newMessage") {
    const newConv = await chatStore.createConversation(route.params.userId);
    await chatStore.createMessage(newConv.id, formData);
    router.push(`/messages/${newConv.id}`);
  } else {
    await chatStore.createMessage(
      parseInt(route.params.conversationId),
      formData
    );
  }
  input.value = "";
  mediaPreview.value = "";
  mediaToSend.value = "";
  nextTick(() => {
    textarea.value.style.height = "20px";
  });
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  padding: 5px;
  background-color: var(--textarea);
  max-height: 350px;
  &__imagePreview {
    @include jcCt-aiCt;
    align-self: flex-start;
    max-width: 150px;
  }
  &__textarea {
    @include aiCt;
    max-height: 200px;
    min-height: 30px;
    width: 100%;
    & > textarea {
      position: relative;
      width: 100%;
      min-height: 20px;
      height: 20px;
      max-height: 100px;
      padding: 0 0 0 5px;
      font-size: 1.05rem;
      color: var(--textColorMain);
      caret-color: var(--textColorMain);
      background-color: transparent;
      border: none;
      resize: none;
      overflow: auto;
      margin-right: 10px;
      &::-webkit-scrollbar {
        width: 10px;
        cursor: auto;
        &-track {
          background: var(--textarea);
        }
        &-thumb {
          background: rgba(128, 128, 128, 0.658);
          border-radius: 10px;
        }
      }
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
