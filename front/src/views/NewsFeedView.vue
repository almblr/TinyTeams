<template>
  <the-header></the-header>
  <main>
    <div class="posts">
      <div
        class="post"
        v-for="post of postStore.posts"
        :key="post.id"
        :id="post.id"
      >
        <header class="post__header">
          <div class="post__header__user">
            <div class="post__header__user__pic">
              <img :src="post.user.profilPicture" alt="Photo de profil" />
            </div>
            <div class="post__header__user__name">
              <h2>{{ post.user.firstName }} {{ post.user.lastName }}</h2>
              <span>Posté {{ dayjs().to(dayjs(post.createdAt)) }}</span>
            </div>
          </div>
        </header>
        <p class="post__text" v-show="post.content !== null">
          {{ post.content }}
        </p>
        <div class="post__image">
          <img
            :src="post.imageUrl"
            v-if="post.imageUrl !== null"
            ref="postImage"
          />
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
            <span class="nbrCom">1 commentaire</span>
          </div>
          <div class="post__footer__button" @click="updateLike(post.id)">
            <fa
              icon="fa-solid fa-thumbs-up"
              :class="{
                thumbsup,
                emptylikeBtn: checkLikeState(post.id) === true,
                coloredLikeBtn: checkLikeState(post.id) === false,
              }"
            />
            <span>J'aime</span>
          </div>
          <v-divider></v-divider>
          <div class="post__footer__comments">WIP COMMENTS</div>
        </footer>
      </div>
    </div>
    <Teleport to="body">
      <post-modal
        :show="showModifyModal"
        @close="showModifyModal = false"
        :modalType="'Modify'"
        :post="postToModify"
      >
      </post-modal>
    </Teleport>
    <!-- :show sert à basculer la propriété display d'un élément -->
  </main>
  <div class="newpost" @click="showCreateModal = true">
    <fa icon="fa-solid fa-feather" class="show-modal test" />
  </div>
  <Teleport to="body">
    <post-modal
      :show="showCreateModal"
      @close="closeCreateModal"
      :modalType="'New'"
      :post="{}"
    >
    </post-modal>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { usePostStore, useLikeStore } from "../stores/index.js";
import PostModal from "../components/PostModalComponent.vue";
// import ButtonFormComponent from '../components/ButtonFormComponent.vue';
import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import TheHeader from "@/components/TheHeaderComponent.vue";
dayjs.locale("fr");
dayjs.extend(relativeTime);

const postStore = usePostStore();
const likeStore = useLikeStore();
const locStr = JSON.parse(localStorage.getItem(`TokenUser`));
const userId = locStr.userId;
const token = locStr.token;
const isAdmin = locStr.isAdmin;
const likeBtn = ref(null);
const postImage = ref(null);
const postToModify = ref(null);
let showCreateModal = ref(false);
let showModifyModal = ref(false);

const modifyPost = async (id) => {
  postToModify.value = postStore.posts.find((post) => post.id === id);
  showModifyModal.value = true;
  await nextTick();
};

/* Deconnexion : vide le localstorage */
const logout = () => {
  window.localStorage.length > 0 ? window.localStorage.clear() : null;
};

/* Affichage des posts de façon antéchronologique */
const getPosts = async () => {
  await postStore.getAll();
};

/* Ferme la modale et met à jour l'affichage de tous les pots */
const closeCreateModal = async () => {
  showCreateModal.value = false;
  await nextTick(); // Attend le prochain cycle de màj Vue (50 ms environ)
  getPosts();
};

/* Permet de supprimer un post et de mettre à jour l'affichage */
const deletePost = async (postId, token) => {
  await postStore.deleteOne(postId, token);
  getPosts();
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
    getPosts();
    return true;
  } else {
    await likeStore.likePost(token, postId);
    getPosts();
    return false;
  }
};

/* Au chargement de la page */
onMounted(() => {
  getPosts();
});
</script>

<style lang="scss" scoped>
main {
  @include fdCol-aaCt;
  @include width-height_max;
  row-gap: 30px;
  background-color: rgb(240, 240, 240);
  overflow-y: scroll;
  padding-top: 6em;
  &__header {
    height: 50px;
  }
}

.posts {
  @include fdCol-aaCt;
  width: 100%;
  gap: 30px;
  padding-bottom: 20px;

  & p {
    color: black;
  }
  & img {
    width: 200px;
    height: 200px;
  }
}

.post {
  @include fdCol-aaCt;
  width: 95%;
  max-width: 700px;
  min-width: 260px;
  border-radius: 10px;
  box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.2);
  &__header {
    background-color: rgb(248, 248, 248);
    display: flex;
    justify-content: space-between;
    padding: 1% 3%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    width: 100%;
    & * {
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
    }
    &__user {
      display: flex;
      max-width: 100%;
      gap: 10px;
      &__pic {
        width: 50px;
        min-width: 50px;
        height: 50px;
        border-radius: 25px;
        & img {
          width: 100%;
          height: 100%;
          border-radius: 25px;
          object-fit: cover;
        }
      }
      &__name {
        display: flex;
        flex-direction: column;
        & h2 {
          font-size: 1em;
        }
        & span {
          font-size: 1em;
        }
      }
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
      min-height: 45px;
      width: 100%;
      background-color: rgb(230, 151, 151);
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
/* SCROLLBAR */

::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background: rgba(255, 41, 3, 0.863);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(255, 38, 0);
}

.newpost {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 40px;
  right: 40px;
  width: 65px;
  height: 65px;
  background-color: rgb(233, 50, 18);
  border-radius: 70px;
  transition: 0.3s;
  box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.432);
  &:hover {
    transition: 0.3s;
    cursor: pointer;
    box-shadow: 5px 4px 10px rgba(0, 0, 0, 0.562);
  }
  & .test {
    font-size: 30px;
    color: white;
  }
}
@media all and (max-width: 789px) {
  .newpost {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    & .test {
      font-size: 25px;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
