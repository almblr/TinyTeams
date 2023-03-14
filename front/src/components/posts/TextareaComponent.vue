<template>
  <div class="container" ref="container">
    <div class="container__textarea" ref="containerTextarea">
      <textarea
        :id="props.postId"
        placeholder="Ecrivez quelque chose..."
        @keydown.enter="sendComment(props.postId)"
        @input="autoResize(textarea)"
        ref="textarea"
        v-model="textareaContent"
      ></textarea>
      <div class="container__buttons">
        <div title="Insérez une image" @click="!showing">
          <AddMediaButton
            color="#575656"
            width="30px"
            height="25px"
            iconSize="19px"
            @showUploadedImg="getUrls"
            ><template v-slot:icon><fa icon="fa-solid fa-camera" /></template
          ></AddMediaButton>
        </div>
        <div title="Insérer un gif">
          <GifTooltipComponent @showUploadedGif="getUrls" />
        </div>
      </div>
    </div>
    <ImagePreviewComponent
      :src="mediaPreview"
      @remove-image="deleteImagePreview"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCommentStore, usePostStore } from "../../stores/index.js";
import AddMediaButton from "../layout/AddMediaButton.vue";
import GifTooltipComponent from "./GifTooltipComponent.vue";
import ImagePreviewComponent from "../layout/ImagePreviewComponent.vue";

const props = defineProps({
  postId: Number,
});

const commentStore = useCommentStore();
const postStore = usePostStore();
const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const showing = ref(false);
const textareaContent = ref("");
const containerTextarea = ref(null);
const container = ref(null);
const textarea = ref(null);
const mediaToSend = ref("");
const mediaPreview = ref(null);

const deleteImagePreview = () => {
  mediaPreview.value = null;
  mediaToSend.value = null;
};

const getUrls = (path, file) => {
  if (file) {
    mediaToSend.value = file;
  } else {
    mediaToSend.value = path;
  }
  mediaPreview.value = path;
};

const sendComment = async (postId) => {
  const formData = new FormData();
  // Check if string contains only spaces
  if (!textareaContent.value.trim()) {
    return;
  }
  formData.append("content", textareaContent.value);
  formData.append("imageUrl", mediaToSend.value);
  await commentStore.create(postId, formData);
  textareaContent.value = "";
  mediaPreview.value = "";
  mediaToSend.value = "";
  autoResize(textarea.value);
  await postStore.getOne(postId);
};

const autoResize = (el) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "15px Lato";
  const strWidth = Math.ceil(context.measureText(textareaContent.value).width);
  const containerWidth = containerTextarea.value.offsetWidth;
  // 100 étant la width des boutons + qlq pixels
  if (containerWidth - strWidth < 100 && el.style.minWidth !== "100%") {
    el.style.minWidth = "100%";
    containerTextarea.value.style.height = `${el.scrollHeight + 35}px`;
    el.style.height = `${el.scrollHeight}px`;
  }
  if (containerWidth - strWidth < 100 && el.style.minWidth === "100%") {
    containerTextarea.value.style.height = `${el.scrollHeight + 35}px`;
    el.style.height = `${el.scrollHeight}px`;
  }
  if (containerWidth - strWidth > 100 && el.style.height !== `30px`) {
    el.style.minWidth = "initial";
    containerTextarea.value.style.height = `35px`;
    el.style.height = `30px`;
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  &__textarea {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    max-width: 630px;
    background-color: var(--textarea);
    border: 1px solid #c0c2c4;
    border-radius: 20px;
    padding: 0 15px;
    height: 35px;
    max-height: 300px;
    & > textarea {
      width: calc(100% - 60px);
      resize: none;
      height: 30px;
      padding-top: 7px;
      max-height: 250px;
      background-color: var(--textarea);
      font-size: 15px;
      border: none;
      &:focus {
        outline: none;
      }
    }
    & > div {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: auto;
      & > * {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 25px;
        border-radius: 5px;
        &:hover {
          background-color: #dfdfdf;
          cursor: pointer;
        }
        & > .addImage {
          color: #575656;
          font-size: 19px;
        }
      }
    }
  }
}
</style>
