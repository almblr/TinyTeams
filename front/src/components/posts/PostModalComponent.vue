<template>
  <ModalLayer v-if="show" @click.self="emit('close')">
    <div class="container">
      <main class="main">
        <textarea
          :placeholder="placeHolder"
          v-model="postData.content"
          maxlength="560"
          ref="textarea"
          @input="autoResizing(textarea)"
        ></textarea>
        <div class="main__imgPreview" v-if="image !== null">
          <img :src="image" />
          <button @click="deleteImg()" class="delete-img">
            <fa icon="fa-solid fa-xmark" />
          </button>
        </div>
        <footer>
          <div class="file" v-if="props.modalType === 'New'">
            <div class="file__label">
              <label for="image-input" id="custom-label" ref="label"
                ><fa icon="fa-solid fa-image" />
              </label>
            </div>
            <input
              ref="input"
              id="image-input"
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              @change="showUploadedImg"
            />
          </div>
          <button @click="sendPost">
            {{ textButton }}
          </button>
        </footer>
      </main>
    </div>
    <div class="error" v-if="emptyPost">
      <span>Votre post ne peut pas être vide.</span>
    </div>
  </ModalLayer>
</template>

<script setup>
import ModalLayer from "@/components/layout/ModalLayerComponent.vue";
import { ref, onMounted, watch, computed } from "vue";
import { usePostStore } from "../../stores/index.js";

const props = defineProps({
  show: {
    type: Boolean,
  },
  modalType: {
    type: String,
  },
  post: {
    type: Object,
  },
});
const emit = defineEmits(["close"]);

const postStore = usePostStore();
const locStr = JSON.parse(localStorage.getItem(`TokenUser`));
const token = locStr.token;
const postData = ref({});
const input = ref(null);
const label = ref(null);
const image = ref(null);
const emptyPost = ref(null);
const userName = locStr.userName;
const firstName = userName.split(" ")[0];
const textarea = ref("");

const placeHolder = computed(() => {
  if (props.modalType === "New") {
    return `Quoi de neuf, ${firstName} ?`;
  } else {
    return "Modifiez-moi";
  }
});

const textButton = computed(() => {
  if (props.modalType === "New") {
    return "Publier";
  } else {
    return "Modifier";
  }
});

/* Affiche la preview du fichier (l'image) uploadé  */
const showUploadedImg = (event) => {
  image.value = URL.createObjectURL(event.target.files[0]);
};

/* Supprime le fichier uploadé de l'input et du label qui sert de preview */
const deleteImg = () => {
  image.value = null;
  input.value.value = null;
};

/* Fonction qui permet de modifier ou de supprimer un post (selon la modal ouverte) */
const sendPost = async () => {
  const formData = new FormData();
  if (props.modalType === "New") {
    if (postData.value.content || input.value.value !== "") {
      if (postData.value.content) {
        formData.append("content", postData.value.content);
      }
      if (input.value.value) {
        formData.append("imageUrl", input.value.files[0]);
      }
      await postStore.createOne(formData, token);
      emit("close");
      emptyPost.value === true ? (emptyPost.value = false) : null;
    } else {
      emptyPost.value = true;
    }
  }
  if (props.modalType === "Modify") {
    if (postData.value.imageUrl === null && postData.value.content === "") {
      emptyPost.value = true;
      setTimeout(() => {
        emptyPost.value = false;
      }, 7000);
    } else {
      formData.append("content", postData.value.content);
      await postStore.updateOne(postData.value.id, formData, token);
      emit("close");
      emptyPost.value === true ? (emptyPost.value = false) : null;
    }
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

<style lang="scss">
.container {
  @include jcCt;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  background-color: #fff;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.main {
  @include fdCol-aaCt;
  @include width-height_max;
  justify-content: center;
  flex-wrap: nowrap;
  border-radius: 5px;
  padding: 20px;
  gap: 20px;
  textarea {
    width: 100%;
    border-radius: 5px;
    resize: none;
    min-height: 150px;
    max-height: 2000px;
    padding: 10px 0 0 10px;
    font-size: 20px;
    border: none;
    border: 1px solid #00000027;
    &::placeholder {
      opacity: 0.7;
      top: 10px;
      left: 10px;
    }
    &:focus {
      outline: none;
    }
  }
  &__imgPreview {
    position: relative;
    img {
      width: 100%;
    }
    button {
      @include jcCt-aaCt;
      position: absolute;
      top: 5px;
      right: 5px;
      width: 25px;
      height: 25px;
      background-color: rgba(255, 0, 0, 0.411);
      font-size: 18px;
      border: none;
      color: rgba(255, 255, 255, 0.815);
      border-radius: 3px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}

footer {
  @include jcCt-aaCt;
  flex-wrap: wrap;
  width: 100%;
  gap: 5px;
  input[type="file"] {
    display: none;
  }
  & .file__label {
    @include jcCt-aaCt;
    width: 35px;
    height: 35px;
    border-radius: 5px;
    transition: 0.2s;
    background-color: rgba(248, 183, 183, 0.281);
    &:hover {
      opacity: 1;
      cursor: pointer;
      transition: 0.2s;
      background-color: rgba(248, 183, 183, 0.767);
    }
    label {
      @include jcCt-aaCt;
      transition: 0.1s;
      color: rgba(218, 39, 39, 0.918);
      font-size: 24px;
      background-color: rgba(248, 183, 183, 0.281);
      &:hover {
        opacity: 1;
        cursor: pointer;
        transition: 0.1s;
      }
    }
  }
  & button {
    flex: 1;
    background: #ff2a00d8;
    color: white;
    font-size: 16px;
    border-radius: 5px;
    padding: 3px;
    height: 35px;
    cursor: pointer;
    border: none;
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
  border-radius: 10px;
  bottom: 3%;
  left: 50%;
  transform: translate(-50%, 0);
  animation: showError 7s 1;
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
  10% {
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
