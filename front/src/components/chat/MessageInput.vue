<template>
  <div class="container" ref="container">
    <div title="Insérez une image" @click="!showing">
      <AddMediaButton @showUploadedImg="getUrls" color="#0084ff" />
    </div>
    <GifPanel color="#0084ff" tooltipPosition="right" />
    <!-- <div class="imagePreview" v-if="mediaPreview">
      <ImagePreview :src="mediaPreview" @remove-image="deleteImagePreview" />
    </div> -->
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
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { socket } from "../../socket.js";
import { useRoute } from "vue-router";
import useChatStore from "@/stores/chatStore.js";
import { useTextareaAutosize } from "@vueuse/core";
import AddMediaButton from "@//components/buttons/AddMediaButton.vue";
import GifPanel from "@/components/posts/GifPanel.vue";
import ImagePreview from "@//components/layout/ImagePreview.vue";

const { textarea, input } = useTextareaAutosize();
const route = useRoute();

const sendMessage = () => {
  if (route.name === "newMessage") {
    console.log("New conversation");
  }
  console.log("Existant conversation");
};
</script>

<style lang="scss" scoped>
.container {
  @include jcCt-aiCt;
  bottom: 0;
  gap: 5px;
  width: 100%;
  max-height: 100px;
  min-height: 50px;
  padding: 5px;
  background-color: var(--textarea);
  & > textarea {
    flex: 1;
    min-height: 35px;
    max-height: 90px;
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
</style>
