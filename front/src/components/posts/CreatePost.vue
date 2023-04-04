<template>
  <ModalLayer v-if="show" @click.self="emit('close'), resetPost()">
    <div class="container">
      <header>
        <h2>Créer une publication</h2>
      </header>
      <BlockDivider width="100%" height="1px" />
      <main>
        <textarea
          :placeholder="`Quoi de neuf, ${firstname} ?`"
          v-model="input"
          maxlength="560"
          ref="textarea"
        ></textarea>
        <div class="imagePreview" v-if="imageBlop">
          <ImagePreview :src="imageBlop" @remove-image="deleteImagePreview" />
        </div>
      </main>
      <footer>
        <div class="file">
          <AddMediaButton iconSize="24px" @showUploadedImg="displayImagePreview"
            ><template v-slot:icon><ion-icon name="camera"></ion-icon></template
          ></AddMediaButton>
        </div>
        <button @click="sendPost">Publier</button>
      </footer>
    </div>
    <div class="error" v-if="emptyPost">
      <span>Votre post ne peut pas être vide.</span>
    </div>
  </ModalLayer>
</template>

<script setup>
import { ref } from "vue";
import { useTextareaAutosize } from "@vueuse/core";
import { socket } from "@/socket.js";
import usePostStore from "@/stores/postStore.js";
import ModalLayer from "@/components/layout/ModalLayer.vue";
import AddMediaButton from "@/components/buttons/AddMediaButton.vue";
import ImagePreview from "@/components/layout/ImagePreview.vue";
import BlockDivider from "@/components/layout/BlockDivider.vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  show: {
    type: Boolean,
  },
});

const { textarea, input } = useTextareaAutosize();
const postStore = usePostStore();
const token = JSON.parse(sessionStorage.getItem(`token`));
const userLS = JSON.parse(sessionStorage.getItem(`user`));
const firstname = userLS.firstname;
const emptyPost = ref(null);
const imageBlop = ref(null);
const imageFile = ref(null);

const displayImagePreview = (blop, file) => {
  imageBlop.value = blop;
  imageFile.value = file;
};

const deleteImagePreview = () => {
  imageBlop.value = null;
  imageFile.value = null;
};

const resetPost = () => {
  deleteImagePreview();
  input.value = "";
  emptyPost.value === true ? (emptyPost.value = false) : null;
  emit("close");
};

const sendPost = async () => {
  const formData = new FormData();
  if (!input.value && !imageFile.value) {
    emptyPost.value = true;
    setTimeout(() => {
      emptyPost.value = false;
    }, 5000);
  } else {
    if (input.value) {
      formData.append("content", input.value);
    }
    if (imageFile.value) {
      formData.append("imageUrl", imageFile.value);
    }
    const post = await postStore.create(formData);
    resetPost();
    socket.emit("newPost", {
      sender: post.author,
      type: "newPost",
      notifiableId: post.id,
      token: token,
    });
  }
};
</script>

<style lang="scss" scoped>
.container {
  @include fdCol-jcCt-aiCt;
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  background-color: var(--backgroundSecond);
  border-radius: 5px;
}

header {
  position: relative;
  width: 100%;
  padding: 15px 0px;
  color: var(--textColorSecond);
  font-size: 15px;
  text-align: center;
  & .exit {
    position: absolute;
    top: 0px;
    right: 0px;
    color: rgb(0, 0, 0);
  }
}

main {
  @include fdCol-jcCt-aiCt;
  @include width-height_max;
  flex-wrap: nowrap;
  border-radius: 5px;
  padding: 20px 10px;
  gap: 20px;
  textarea {
    width: 100%;
    min-height: 150px;
    max-height: 2000px;
    resize: none;
    padding: 10px 0 0 10px;
    font-size: 19px;
    border: none;
    border-radius: 5px;
    background-color: var(--textarea);
    caret-color: var(--textColorMain);
    color: var(--textColorMain);
    &::placeholder {
      opacity: 0.7;
      top: 10px;
      left: 10px;
      color: var(--placeholder);
    }
    &:focus {
      outline: none;
    }
  }
  .imagePreview {
    position: relative;
    width: 100%;
    padding: 10px;
    border: 1px solid var(--colorDivider);
    border-radius: 10px;
  }
}

footer {
  @include jcCt-aiCt;
  padding: 0 10px 10px 10px;
  flex-wrap: wrap;
  width: 100%;
  gap: 5px;
  & button {
    flex: 1;
    background: #2374e1;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    padding: 3px;
    height: 35px;
    cursor: pointer;
    border: none;
  }
  & .file {
    @include jcCt-aiCt;
    border-radius: 5px;
    width: 35px;
    height: 35px;
    &:hover {
      cursor: pointer;
      background-color: var(--addMediaBackground);
      filter: brightness(90%);
    }
  }
}

.error {
  @include jcCt-aiCt;
  position: absolute;
  width: 300px;
  height: 40px;
  background-color: #fd1e01de;
  border-radius: 5px;
  bottom: 3%;
  left: 50%;
  transform: translate(-50%, 0);
  animation: showError 5s 1;
  box-shadow: 5px 5px 20px #0000003d;
  opacity: 0;
  & > span {
    font-size: 18px;
    color: white;
    text-align: center;
    font-weight: bold;
  }
}

@keyframes showError {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.9;
  }
  95% {
    opacity: 0;
  }
}
</style>
