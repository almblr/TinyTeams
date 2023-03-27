<template>
  <footer class="footer">
    <div class="footer__writeComment">
      <ProfilPicture
        :url="props.profilPicture"
        alt="Profil picture"
        width="35px"
        height="35px"
      />
      <TextareaComponent :postId="props.postId" />
    </div>
    <CommentSection :comments="props.postComments" />
  </footer>
</template>

<script setup>
import ProfilPicture from "@/components/layout/ProfilPicture.vue";
import TextareaComponent from "@/components/posts/TextareaComponent.vue";
import CommentSection from "@/components/posts/CommentSection.vue";

const props = defineProps({
  postId: Number,
  profilPicture: String,
  postComments: Array,
});
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px 10px 10px 10px;
  gap: 10px;
  &__writeComment {
    display: flex;
    gap: 5px;
  }
  &__mediaPreview {
    width: 60%;
    max-width: 400px;
    margin-left: 50px;
    max-height: 225px;
    & img {
      max-width: 100%;
      height: 100%;
    }
  }
}
</style>
