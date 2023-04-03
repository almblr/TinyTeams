<template>
  <div class="container" ref="container">
    <div class="container__textarea" ref="containerTextarea">
      <textarea
        :id="props.postId"
        placeholder="Ecrivez un commentaire..."
        @keydown.enter.prevent="sendComment(props.postId)"
        ref="textarea"
        v-model="input"
      ></textarea>
      <div class="container__buttons">
        <div title="Insérez une image" @click="!showing">
          <AddMediaButton iconSize="19px" @showUploadedImg="getUrls"
            ><template v-slot:icon><fa icon="fa-solid fa-camera" /></template
          ></AddMediaButton>
        </div>
        <div title="Insérer un gif">
          <GifPanel @showUploadedGif="getUrls" />
        </div>
      </div>
    </div>
    <div class="imagePreview" v-if="mediaPreview">
      <ImagePreview :src="mediaPreview" @remove-image="deleteImagePreview" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useCommentStore from "@/stores/commentSTORE.js";
import { useTextareaAutosize } from "@vueuse/core";
import AddMediaButton from "@//components/buttons/AddMediaButton.vue";
import GifPanel from "@/components/posts/GifPanel.vue";
import ImagePreview from "@//components/layout/ImagePreview.vue";

const { textarea, input } = useTextareaAutosize();

const props = defineProps({
  postId: Number,
});

const commentStore = useCommentStore();
const showing = ref(false);
const containerTextarea = ref(null);
const container = ref(null);
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
  if (
    (!input.value || input.value.trim().length === 0) &&
    mediaToSend.value === ""
  ) {
    return;
  }
  if ((!input.value || input.value.trim().length === 0) && mediaToSend !== "") {
    formData.append("imageUrl", mediaToSend.value);
  }
  if (input.value && mediaToSend === "") {
    formData.append("content", input.value);
  }
  await commentStore.create(postId, formData);
  input.value = "";
  mediaPreview.value = "";
  mediaToSend.value = "";
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
    border: 1px solid var(--textareaBorder);
    border-radius: 20px;
    padding: 0 15px;
    max-height: 300px;
    & > textarea {
      width: calc(100% - 60px);
      resize: none;
      padding-top: 7px;
      background-color: var(--textarea);
      color: var(--textColorMain);
      caret-color: var(--textColorMain);
      font-size: 15px;
      height: 30px;
      max-height: 250px;
      border: none;
      &:focus {
        outline: none;
      }
      &::placeholder {
        color: var(--placeholder);
      }
    }
  }
  &__buttons {
    @include jcCt-aiCt;
    & > div {
      @include jcCt-aiCt;
      width: 30px;
      height: 25px;
      border-radius: 5px;
      &:hover {
        background-color: var(--addMediaBackground);
      }
    }
  }
}

.imagePreview {
  position: relative;
  width: 50%;
}
</style>
