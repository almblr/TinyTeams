<template>
  <article
    id="post"
    v-for="post of postStore.posts"
    :key="post.id"
    :id="post.id"
  >
    <PostHeaderComponent
      :author="post.author"
      :postId="post.id"
      :imageUrl="post.user.profilPicture"
      :firstName="post.user.firstName"
      :lastName="post.user.lastName"
      :createdAt="post.createdAt"
    />
    <main class="main">
      <p class="main__text" v-show="post.content !== null">
        {{ post.content }}
      </p>
      <div class="main__image">
        <img :src="post.imageUrl" v-if="post.imageUrl !== null" />
      </div>
      <div class="main__stats">
        <span>{{ post.reactions.length }}</span>
        <span
          ref="likeBtn"
          :class="{
            emptyHeart: checkLikeState(post.id) === true,
            coloredHeart: checkLikeState(post.id) === false,
          }"
        >
          ❤
        </span>
        <span class="main__stats__coms"
          >{{
            post.userComments.length + post.othersComments.length
          }}
          commentaire</span
        >
      </div>
      <div class="main__reactBtn" @click="updateLike(post.id)">
        <fa
          icon="fa-solid fa-thumbs-up"
          :class="{
            emptylikeBtn: checkLikeState(post.id) === true,
            coloredLikeBtn: checkLikeState(post.id) === false,
          }"
        />
        <span>J'aime</span>
      </div>
    </main>
    <DividerComponent width="98%" height="1px" backgroundColor="#c0c2c4" />
    <footer class="footer">
      <div class="footer__writeComment">
        <ProfilPicture
          :url="post.user.profilPicture"
          alt="Profil picture"
          width="35px"
          height="35px"
        />
        <TextareaComponent
          @get-media-preview="showUrls"
          :postId="post.id"
        ></TextareaComponent>
      </div>
      <ImagePreviewComponent
        :src="mediaPreview"
        @remove-image="deleteImagePreview"
      />
      <div class="footer__comments">
        <CommentSection
          :userComments="[...post.userComments]"
          :othersComments="[...post.othersComments]"
          :user="post.user"
        />
      </div>
    </footer>
  </article>
  <!-- :show sert à basculer la propriété display d'un élément -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { usePostStore, useLikeStore } from "../../stores/index.js";
import DividerComponent from "../layout/DividerComponent.vue";
import CommentSection from "./CommentSectionComponent.vue";
import ProfilPicture from "./ProfilPictureComponent.vue";
import PostHeaderComponent from "./PostHeaderComponent.vue";
import TextareaComponent from "./TextareaComponent.vue";
import ImagePreviewComponent from "../layout/ImagePreviewComponent.vue";

const postStore = usePostStore();
const likeStore = useLikeStore();
const locStr = JSON.parse(localStorage.getItem(`userInfo`));
const token = locStr.token;
const userId = locStr.userId;
const likeBtn = ref(null);
const mediaPreview = ref(null);

const showUrls = (path) => {
  mediaPreview.value = path;
};

const deleteImagePreview = () => {
  mediaPreview.value = null;
};
/* Permet de vérifier l'état du like (exploiter dans le changement de style de l'icone like) */
const checkLikeState = (postId) => {
  const thisPost = postStore.posts.find((post) => post.id === postId);
  const postReactions = thisPost.reactions;
  const doesUserLike = postReactions.find((react) => react.userId === userId);
  if (doesUserLike === undefined) {
    return true;
  } else {
    return false;
  }
};

/* Met à jour le like d'un post et l'affichage des posts */
const updateLike = async (postId) => {
  const thisPost = postStore.posts.find((post) => post.id === postId);
  const postReactions = thisPost.reactions;
  const doesUserLike = postReactions.find((react) => react.userId === userId);
  if (doesUserLike === undefined) {
    await likeStore.likePost(token, postId);
    await postStore.getOne(token, postId);
    return true;
  } else {
    await likeStore.likePost(token, postId);
    await postStore.getOne(token, postId);
    return false;
  }
};

/* Au chargement de la page */
onMounted(() => {
  postStore.getAll(token);
});
</script>

<style lang="scss" scoped>
#post {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  max-width: 700px;
  min-width: 260px;
  border-radius: 10px;
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.2);
  & .main {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5px;
    &__text {
      font-size: 18px;
      min-width: 100%;
      overflow-wrap: break-word;
      padding: 10px 15px;
    }
    &__image {
      width: 100%;
      max-height: 450px;
      background-color: rgb(0, 0, 0);
      margin-bottom: 5px;
      & img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    &__stats {
      display: flex;
      align-items: center;
      flex: 1;
      margin-left: 15px;
      gap: 3px;
      & span {
        font-size: 16px;
      }
    }
    &__reactBtn {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 2px 7px;
      gap: 5px;
      border-radius: 5px;
      & .thumbsup {
        color: rgb(207, 49, 49);
      }
      &:hover {
        background-color: rgba(165, 165, 165, 0.192);
        cursor: pointer;
      }
      &:hover + .thumbsup {
        color: rgb(207, 49, 49);
      }
      & > span {
        font-size: 16px;
      }
    }
  }
  & .footer {
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
}

.emptylikeBtn,
.emptyHeart {
  font-size: 18px;
  transition: 0.3s;
  color: rgba(133, 133, 133, 0.507);
  &:hover {
    transition: 0.3s;
    cursor: pointer;
  }
}
.coloredLikeBtn,
.coloredHeart {
  font-size: 18px;
  transition: 0.3s;
  color: rgba(230, 54, 0, 0.95);
  &:hover {
    transition: 0.3s;
    cursor: pointer;
  }
}

.emptyHeart,
.coloredHeart {
  &:hover {
    cursor: initial !important;
  }
}

input[type="file"] {
  display: none;
}
</style>
