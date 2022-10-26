<template>
  <Transition name="modal">
    <div v-if="show" class="modal__layer" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__body">
          <h1 ref="titleModal">{{ title }}</h1>
          <textarea
            ref="textarea"
            :placeholder="placeholder"
            v-model="postData.content"
            maxlength="560"
            @input="autoResizing(textarea)"
          ></textarea>
          <div
            ref="imgModify"
            class="img__postModify"
            v-if="title === 'Modifier' && postData.imageUrl"
          >
            <img :src="postData.imageUrl" alt="postPicture" />
          </div>
          <div class="image-send">
            <div class="imageInfo" v-if="title === 'Nouveau post'">
              <div class="previewImg">
                <label
                  for="image-input"
                  id="custom-label"
                  ref="label"
                  :style="`background-image:url(${postData.imageUrl})`"
                  >+</label
                >
                <input
                  ref="input"
                  id="image-input"
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  @change="showUploadedImg"
                />
                <button @click="deleteImg()" class="delete-img">X</button>
              </div>
              <div>
                <p>
                  <b> Cliquez pour insérer une image. </b>
                  <br />
                  Formats acceptés : png, jpg, jpeg.
                </p>
              </div>
            </div>
            <ButtonFormComponent
              text="Publier"
              @click="sendPost"
            ></ButtonFormComponent>
          </div>
          <p class="emptyPostMsg" v-if="emptyPost">
            Votre post ne peut pas être vide.
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { usePostStore } from '../stores/index.js';
import ButtonFormComponent from '../components/ButtonFormComponent.vue';

const props = defineProps({
  show: {
    type: Boolean,
  },
  title: {
    type: String,
  },
  post: {
    type: Object,
  },
});
const emit = defineEmits(['close']);

const postStore = usePostStore();
const locStr = JSON.parse(localStorage.getItem(`TokenUser`));
const token = locStr.token;
const input = ref(null);
const label = ref(null);
const postData = ref({});
const titleModal = ref(null);
const imgModify = ref(null);
const emptyPost = ref(null);
const textarea = ref(null);
const userName = locStr.userName;
const firstName = userName.split(' ')[0];
const placeholder = `Quoi de neuf, ${firstName} ?`;

/* Affiche la preview du fichier (l'image) uploadé  */
const showUploadedImg = (event) => {
  const image = URL.createObjectURL(event.target.files[0]);
  label.value.style.backgroundImage = `url(${image})`;
};

/* Supprime le fichier uploadé de l'input et du label qui sert de preview */
const deleteImg = () => {
  input.value.value = null;
  label.value.style.backgroundImage = '';
  if (postData.value.imageUrl) {
    postData.value.imageUrl = null;
  }
};

/* Fonction qui permet de modifier ou de supprimer un post (selon la modal ouverte) */
const sendPost = async () => {
  if (titleModal.value.innerText === 'Nouveau post') {
    if (postData.value.content || input.value.value !== '') {
      const formData = new FormData();
      if (postData.value.content) {
        formData.append('content', postData.value.content);
      }
      if (input.value.value) {
        formData.append('imageUrl', input.value.files[0]);
      }
      await postStore.createOne(formData, token);
      emit('close');
      emptyPost.value === true ? (emptyPost.value = false) : null;
    } else {
      emptyPost.value = true;
    }
  }
  if (titleModal.value.innerText === 'Modifier') {
    if (imgModify.value === null) {
      // Si le post n'a pas d'image
      if (postData.value.content === '') {
        emptyPost.value = true;
      } else {
        const formData = new FormData();
        formData.append('content', postData.value.content);
        await postStore.updateOne(postData.value.id, formData, token);
        emit('close');
        emptyPost.value === true ? (emptyPost.value = false) : null;
      }
    } else {
      // S'il en a une
      const formData = new FormData();
      formData.append('content', postData.value.content);
      await postStore.updateOne(postData.value.id, formData, token);
      emit('close');
      emptyPost.value === true ? (emptyPost.value = false) : null;
    }
  }
};

const autoResizing = (el) => {
  el.style.height = '50px';
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
.modal__layer {
  @include row-justify-center;
  @include width-height_max;
  align-items: center;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.267);
  transition: opacity 0.3s ease;
}

.modal__container {
  @include row-justify-center;
  align-items: center;
  position: relative;
  min-height: 450px;
  max-width: 600px;
  margin: 0px auto;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal__container,
.modal-leave-to .modal__container {
  -webkit-transform: scale(1.02);
  transform: scale(1.02);
}

.modal__body {
  @include column-align-center;
  @include width-height_max;
  justify-content: center;
  flex-wrap: nowrap;
  background-color: rgb(255, 255, 255);
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  & h1 {
    margin-top: 6%;
    color: red;
    font-size: 26px;
  }
}
textarea {
  margin-top: 25px;
  width: 90%;
  border-radius: 5px;
  resize: none;
  min-height: 150px;
  max-height: 200px;
  padding: 10px 0 0 10px;
  font-size: 16px;
  border: none;
  &::placeholder {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  &:focus {
    outline: none;
    border: 2px solid rgb(224, 33, 33);
  }
}

.img__postModify {
  width: 100px;
  height: 100px;
  margin-top: 4%;
  & > img {
    @include width-height-max;
    object-fit: cover;
  }
}

.image-send {
  @include justify-and-align-center;
  flex-wrap: wrap;
  margin: 30px 0 20px 0;
  width: 90%;
  .imageInfo {
    display: flex;
    flex: 1;
    min-width: 100%;
    margin-bottom: 50px;
  }
  input[type='file'] {
    display: none;
  }
  #custom-label {
    @include justify-and-align_center;
    font-size: 55px;
    width: 100px;
    height: 100px;
    opacity: 0.8;
    left: 10px;
    color: rgba(255, 255, 255, 0.411);
    border-radius: 13px;
    background-color: rgba(72, 93, 105, 0.507);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: 0.1s;
    &:hover {
      opacity: 1;
      cursor: pointer;
      transition: 0.1s;
    }
  }
  .previewImg {
    position: relative;
  }
  p {
    max-width: 400px;
    margin-left: 15px;
    font-size: 14px;
  }
}

.delete-img {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  background-color: rgba(255, 0, 0, 0.63);
  border: 1px solid rgba(255, 255, 255, 0.103);
  color: white;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
  }
}

.emptyPostMsg {
  color: red;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}

@media all and (min-width: 700px) {
  #custom-label {
    width: 130px !important;
    height: 110px !important;
  }
}
</style>
