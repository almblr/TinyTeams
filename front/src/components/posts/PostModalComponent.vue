<template>
  <ModalLayer v-if="show" @click.self="emit('close', (imageBlop = null))">
    <div class="container">
      <header>
        <h2>Créer une publication</h2>
        <div class="exit"></div>
      </header>
      <DividerComponent width="100%" height="1px" />
      <main>
        <textarea
          :placeholder="`Quoi de neuf, ${firstname} ?`"
          v-model="postData.content"
          maxlength="560"
          ref="textarea"
          @input="autoResizing(textarea)"
        ></textarea>
        <ImagePreviewComponent
          :src="imageBlop"
          @remove-image="deleteImagePreview"
        />
        <footer>
          <div class="file">
            <AddMediaButton
              iconSize="24px"
              @showUploadedImg="displayImagePreview"
              ><template v-slot:icon><fa icon="fa-solid fa-camera" /></template
            ></AddMediaButton>
          </div>
          <button @click="sendPost">Publier</button>
        </footer>
      </main>
    </div>
    <div class="error" v-if="emptyPost">
      <span>Votre post ne peut pas être vide.</span>
    </div>
  </ModalLayer>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { usePostStore } from "../../stores/index.js";
import { io } from "socket.io-client";
import ModalLayer from "@/components/layout/ModalLayerComponent.vue";
import AddMediaButton from "@/components/layout/AddMediaButton.vue";
import ImagePreviewComponent from "../layout/ImagePreviewComponent.vue";
import DividerComponent from "../layout/DividerComponent.vue";
import { isSVGTag } from "@vue/shared";

const socket = io("http://localhost:3000");

const props = defineProps({
  show: {
    type: Boolean,
  },
  post: {
    type: Object,
  },
});
const emit = defineEmits(["close"]);

const postStore = usePostStore();
const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const firstname = sesStr.firstname;
const postData = ref({});
const emptyPost = ref(null);
const textarea = ref("");
const imageBlop = ref(null);
const imageFile = ref(null);

const displayImagePreview = (blop, file) => {
  imageBlop.value = blop;
  imageFile.value = file;
};

const deleteImagePreview = () => {
  imageBlop.value = null;
};

/* Fonction qui permet de modifier ou de supprimer un post (selon la modal ouverte) */
const sendPost = async () => {
  const formData = new FormData();
  if (!postData.value.content && !imageFile.value) {
    emptyPost.value = true;
    setTimeout(() => {
      emptyPost.value = false;
    }, 5000);
  } else {
    if (postData.value.content) {
      formData.append("content", postData.value.content);
    }
    if (imageFile.value) {
      formData.append("imageUrl", imageFile.value);
    }
    await postStore.create(formData);
    await postStore.getAll();
    imageBlop.value = null;
    imageFile.value = null;
    emptyPost.value === true ? (emptyPost.value = false) : null;
    emit("close");
    socket.emit("newPost", "Un nouveau post a été publié.");
  }
};

const autoResizing = (el) => {
  el.style.height = "50px";
  el.style.height = `${el.scrollHeight}px`;
};

/* Observe les changements de visibilité de la modal pour reset l'objet post */
watch(
  () => props.show,
  async (newShow) => {
    //newShow représente la nouvelle valeur qu'a pris la props show
    if (newShow && props.post) {
      postData.value = { ...props.post }; // ... = affectation par décomposition : déstructure les 2 objets pour éviter que si l'on modifie un, l'autre se modifie aussi
      emptyPost.value === true ? (emptyPost.value = false) : null;
    }
  }
);
onMounted(() => {
  if (props.post) {
    postData.value = { ...props.post };
  }
});
</script>

<style lang="scss" scoped>
.container {
  @include jcCt-aiCt;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  background-color: var(--backgroundSecond);
  border-radius: 5px;
  transition: all 0.3s ease;
}

header {
  width: 100%;
  position: relative;
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
  @include fdCol-aiCt;
  @include width-height_max;
  justify-content: center;
  flex-wrap: nowrap;
  border-radius: 5px;
  padding: 20px 10px;
  gap: 20px;
  textarea {
    width: 100%;
    border-radius: 5px;
    resize: none;
    min-height: 150px;
    max-height: 2000px;
    padding: 10px 0 0 10px;
    font-size: 19px;
    border: none;
    background-color: var(--textarea);
    caret-color: var(--textColorMain);
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
}

footer {
  @include jcCt-aiCt;
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
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 300px;
  height: 40px;
  background-color: #fd1e01d5;
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
