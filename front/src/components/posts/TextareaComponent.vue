<template>
  <div class="container" ref="container">
    <textarea
      placeholder="Ecrivez quelque chose..."
      @keydown.enter="sendComment($event, post.id)"
      @input="getTextWidth($event)"
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
</template>

<script setup>
import { ref } from "vue";
import AddMediaButton from "../layout/AddMediaButton.vue";
import GifTooltipComponent from "./GifTooltipComponent.vue";

const emit = defineEmits(["getMedias"]);

const showing = ref(false);
const textareaContent = ref(null);
const container = ref(null);
const textarea = ref(null);

const getUrls = (n, n2) => {
  console.log(n);
  console.log(n2);
  emit("getMedias", n, n2);
};

const getTextWidth = (el) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "15px Lato";
  const strWidth = Math.ceil(context.measureText(textareaContent.value).width);
  const containerWidth = container.value.offsetWidth;
  // 100 étant la width des boutons + qlq pixels
  if (containerWidth - strWidth < 100) {
    el.target.style.minWidth = "100%";
    container.value.style.height = `${el.target.scrollHeight + 35}px`;
    el.target.style.height = `${el.target.scrollHeight}px`;
  } else {
    el.target.style.maxWidth = containerWidth - 60;
    el.target.style.width = containerWidth - 60;
    container.value.style.height = `35px`;
    el.target.style.height = `30px`;
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  max-width: 630px;
  background-color: white;
  border: 1px solid #c0c2c4;
  border-radius: 20px;
  padding: 0 15px;
  height: 35px;
  max-height: 300px;
  & > textarea {
    background-color: blanchedalmond;
    min-width: calc(100% - 60px);
    resize: none;
    height: 30px;
    padding-top: 5px;
    max-height: 250px;
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
</style>
