<template>
  <div
    class="post"
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
    <p class="post__text" v-show="post.content !== null">
      {{ post.content }}
    </p>
    <div class="post__image">
      <img :src="post.imageUrl" v-if="post.imageUrl !== null" />
    </div>
    <footer class="post__footer">
      <div class="post__footer__stats">
        <span class="nbrLike">{{ post.reactions.length }}</span>
        <span
          ref="likeBtn"
          :class="{
            emptyHeart: checkLikeState(post.id) === true,
            coloredHeart: checkLikeState(post.id) === false,
          }"
        >
          ❤
        </span>
        <span class="nbrCom"
          >{{
            post.userComments.length + post.othersComments.length
          }}
          commentaire</span
        >
      </div>
      <div class="post__footer__button" @click="updateLike(post.id)">
        <fa
          icon="fa-solid fa-thumbs-up"
          :class="{
            emptylikeBtn: checkLikeState(post.id) === true,
            coloredLikeBtn: checkLikeState(post.id) === false,
          }"
        />
        <span>J'aime</span>
      </div>
      <DividerComponent width="99%" height="1px" backgroundColor="#c0c2c4" />
      <div class="post__footer__comments">
        <div class="post__footer__comments__writeComment">
          <div class="post__profilPicture">
            <ProfilPicture
              :url="post.user.profilPicture"
              alt="Profil picture"
            />
          </div>
          <div
            class="post__footer__comments__writeComment__container"
            ref="texteareaContainer"
          >
            <textarea
              placeholder="Ecrivez quelque chose..."
              @keydown.enter="sendComment($event, post.id)"
              @input="autoResizing()"
            ></textarea>
            <div>
              <div title="Insérez une image" @click="!showing">
                <AddMediaButton
                  color="#575656"
                  width="30px"
                  height="25px"
                  iconSize="19px"
                  @showUploadedImg="showUrl"
                  ><template v-slot:icon
                    ><fa icon="fa-solid fa-camera" /></template
                ></AddMediaButton>
              </div>
              <div title="Insérer un gif">
                <GifTooltipComponent @showUploadedGif="showUrl" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="post__footer__comments__preview"
          v-if="mediaPreview !== null"
        >
          <img :src="mediaPreview" />
        </div>
        <div class="post__footer__comments__allComments">
          <CommentSection
            :userComments="[...post.userComments]"
            :othersComments="[...post.othersComments]"
            :user="post.user"
          />
        </div>
      </div>
    </footer>
  </div>
  <!-- :show sert à basculer la propriété display d'un élément -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  usePostStore,
  useCommentStore,
  useLikeStore,
} from "../../stores/index.js";
import DividerComponent from "../layout/DividerComponent.vue";
import GifTooltipComponent from "./GifTooltipComponent.vue";
import CommentSection from "./CommentSectionComponent.vue";
import ProfilPicture from "./ProfilPictureComponent.vue";
import PostHeaderComponent from "./PostHeaderComponent.vue";
import AddMediaButton from "../layout/AddMediaButton.vue";

const postStore = usePostStore();
const commentStore = useCommentStore();
const likeStore = useLikeStore();
const locStr = JSON.parse(localStorage.getItem(`userInfo`));
const token = locStr.token;
const userId = locStr.userId;
const texteareaContainer = ref("");
const likeBtn = ref(null);
const showing = ref(false);
const mediaPreview = ref(null);
const mediaToSend = ref(null);

const showUrl = (n, n2) => {
  mediaPreview.value = n;
  n2 ? (mediaToSend.value = n2) : (mediaToSend.value = n);
};
const autoResizing = (postid) => {
  // const container = texteareaContainer.value[0];
  // el.target.style.height = `${el.target.scrollHeight}px`;
  // container.style.height = `${el.target.scrollHeight + 15}px`;
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

const sendComment = async (el, postId) => {
  const formData = new FormData();
  formData.append("content", el.target.value);
  formData.append("imageUrl", mediaToSend.value);
  await commentStore.createOne(postId, formData, token);
  el.target.value = null;
  el.target.style.height = "35px";
  await postStore.getOne(token, postId);
  mediaPreview.value = null;
  mediaToSend.value = null;
};

/* Au chargement de la page */
onMounted(() => {
  postStore.getAll(token);
});
</script>

<style lang="scss" scoped>
.post {
  @include fdCol-aiCt;
  width: 95%;
  max-width: 700px;
  min-width: 260px;
  border-radius: 10px;
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.2);
  &__profilPicture {
    width: 40px;
    min-width: 40px;
    height: 40px;
    border-radius: 25px;
    & img {
      width: 100%;
      height: 100%;
      border-radius: 25px;
      object-fit: cover;
    }
  }
  &__date {
    align-self: flex-start;
    font-size: 15px;
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
  &__text {
    font-size: 18px;
    width: 95%;
    overflow-wrap: break-word;
    margin: 15px 0;
  }
  &__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 97%;
    &__stats {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 5px;
      & .nbrLike {
        font-size: 15px;
      }
      & .nbrCom {
        font-size: 15px;
      }
    }
    &__button {
      padding: 2px 7px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
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
    &__comments {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: 10px;
      gap: 10px;
      &__writeComment {
        display: flex;
        align-items: center;
        gap: 5px;
        &__container {
          position: relative;
          display: flex;
          flex: 1;
          background-color: white;
          border: 1px solid #c0c2c4;
          border-radius: 20px;
          padding: 5px 10px;
          height: 35px;
          max-height: 300px;
          gap: 5px;
          & > textarea {
            background-color: rgb(182, 192, 209);
            resize: none;
            height: 20px;
            max-height: 250px;
            border: none;
            &:focus {
              outline: none;
            }
          }
          & > div {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            right: 10px;
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
      }
      &__preview {
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
