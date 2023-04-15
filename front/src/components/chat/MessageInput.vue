<template>
  <div class="container" ref="container">
    <div class="container__textarea" ref="containerTextarea">
      <!-- <div title="Insérez une image" @click="!showing">
        <AddMediaButton iconSize="23px" @showUploadedImg="getUrls"
          ><template v-slot:icon><ion-icon name="camera"></ion-icon></template
        ></AddMediaButton>
      </div> -->
      <textarea
        placeholder="Ecrivez votre message..."
        @keydown.enter.prevent="sendMessage()"
        ref="textarea"
        v-model="input"
      ></textarea>
      <div class="container__buttons">
        <ion-icon name="send"></ion-icon>
      </div>
    </div>
    <!-- <div class="imagePreview" v-if="mediaPreview">
      <ImagePreview :src="mediaPreview" @remove-image="deleteImagePreview" />
    </div> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { socket } from "../../socket.js";
import { useRoute } from "vue-router";
import useChatStore from "@/stores/chatStore.js";
import { useTextareaAutosize } from "@vueuse/core";
import AddMediaButton from "@//components/buttons/AddMediaButton.vue";
import GifPanel from "@/components/posts/GifPanel.vue";
import ImagePreview from "@//components/layout/ImagePreview.vue";

// const props = defineProps({
//   userId: {
//     type: Number,
//     required: true,
//   },
// });

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
  @include fdCol-aiCt;
  gap: 5px;
  width: 100%;
  &__textarea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    width: 100%;
    min-height: 35px;
    background-color: var(--textarea);
    border: 1px solid var(--textareaBorder);
    padding: 0 10px;
    max-height: 300px;
    & > textarea {
      width: calc(100% - 60px);
      resize: none;
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
    color: white;
  }
}
</style>
