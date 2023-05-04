<template>
  <div class="container" ref="container">
    <div class="container__textarea">
      <textarea
        :id="props.postId"
        :placeholder="props.placeholder"
        @keydown.enter.prevent="sendContent(type)"
        ref="textarea"
        v-model="input"
      ></textarea>
      <div class="container__buttons">
        <AddMediaButton
          @click="!showing"
          @showUploadedImg="getUrls"
          color="var(--addMediaColor)"
        ></AddMediaButton>
        <GifPanel
          @showUploadedGif="getUrls"
          tooltipPosition="left"
          color="var(--addMediaColor)"
        />
      </div>
    </div>
    <div class="imagePreview" v-if="mediaPreview">
      <ImagePreview
        :src="mediaPreview"
        size="scale-down"
        @remove-image="deleteImagePreview"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { socket } from "../../socket.js";
import useUserStore from "@/stores/userStore.js";
import usePostStore from "@/stores/postStore.js";
import { useTextareaAutosize } from "@vueuse/core";
import AddMediaButton from "@//components/buttons/AddMediaButton.vue";
import GifPanel from "@/components/posts/GifPanel.vue";
import ImagePreview from "@//components/layout/ImagePreview.vue";

const { textarea, input } = useTextareaAutosize();

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  postId: Number,
  author: Number,
  receiver: Object,
  conversationId: Number,
});

const userStore = useUserStore();
const postStore = usePostStore();
const showing = ref(false);
const container = ref(null);
const mediaToSend = ref(null);
const mediaPreview = ref(null);
const user = JSON.parse(sessionStorage.getItem(`user`));

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

const createNotificiation = (type, notifiableId, receiver, postId) => {
  const data = {
    senderId: user.id,
    senderUsername: `${user.firstname} ${user.lastname}`,
    senderProfilePicture: user.profilePicture,
    type: type,
    notifiableId: notifiableId,
    receiver,
    token: userStore.token,
  };
  if (postId) {
    data.postId = postId;
  }
  socket.emit(type, data);
};
const sendContent = async (type) => {
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
  const comment = await postStore.createComment(props.postId, formData);
  createNotificiation("newComment", comment.id, props.author, props.postId);
  input.value = "";
  mediaPreview.value = "";
  mediaToSend.value = "";
  nextTick(() => {
    textarea.value.style.height = "35px";
  });
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
    width: 100%;
    min-height: 35px;
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
  }
  .imagePreview {
    max-width: 300px;
    max-height: 300px;
  }
}
</style>
