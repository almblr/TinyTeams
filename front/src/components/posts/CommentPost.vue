<template>
  <div
    class="container"
    @mouseover="showTooltip = true"
    @mouseleave="showTooltip = false"
    ref="comment"
  >
    <header>
      <router-link :to="`/users/${props.comment.author}`" class="title"
        >{{ props.comment.user.firstname }}
        {{ props.comment.user.lastname }}</router-link
      >
      <div class="aside">
        <span>
          {{ dayjs(props.comment.createdAt).fromNow(true) }}
        </span>
        <PostTooltip
          :commentId="props.comment.id"
          :postId="props.comment.postId"
          :author="props.comment.author"
          type="comment"
          top="1px"
          dotSize="4px"
          @editComment="modify"
          v-show="
            (props.comment.author === userId || isAdmin) &&
            editingMode === false
          "
        />
      </div>
    </header>
    <p v-if="!editingMode">{{ props.comment.content }}</p>
    <TextareaEditing
      v-else
      :postId="props.comment.postId"
      :commentId="props.comment.commentId"
      :content="props.comment.content"
      v-model:show="editingMode"
      textareaType="comment"
    />
    <span class="cancel" v-if="editingMode" @click="editingMode = false"
      >Annuler</span
    >
    <img :src="props.comment.imageUrl" v-if="props.comment.imageUrl" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import TextareaEditing from "@/components/posts/TextareaEditing.vue";
import PostTooltip from "@/components/posts/PostTooltip.vue";
import relativeTime from "dayjs/plugin/relativeTime";
import UpdateLocale from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
dayjs.extend(relativeTime);
dayjs.extend(UpdateLocale);
dayjs.updateLocale("fr", {
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "1min",
    m: "1min",
    mm: "%dmin",
    h: "1h",
    hh: "%dh",
    d: "1j",
    dd: "%d jrs",
    M: "1 mois",
    MM: "%d mois",
    y: "1 an",
    yy: "%d ans",
  },
});

const emit = defineEmits(["update:selectedCommentId"]);
const props = defineProps({
  comment: Object,
  selectedCommentId: Number,
});

const userLS = JSON.parse(sessionStorage.getItem(`user`));
const userId = userLS.id;
const isAdmin = userLS.isAdmin;
const comment = ref(null);
const showTooltip = ref(false);
const editingMode = ref(false);

const modify = () => {
  emit("update:selectedCommentId", props.comment.id);
  editingMode.value = true;
  comment.value.style.flex = 1;
};

watch(
  () => props.selectedCommentId,
  (newValue) => {
    editingMode.value = newValue === props.comment.id;
  }
);

watch(
  () => editingMode.value,
  (newValue) => {
    if (newValue === false) {
      comment.value.style.flex = "initial";
    }
  }
);
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-width: 100px;
  height: min-content;
  border-radius: 10px;
  background-color: var(--commentBackground);
  padding: 5px 10px 5px 10px;
  color: var(--textColorMain);
  & > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    min-width: 100%;
    & > .title {
      font-size: 15px;
      font-weight: 600;
      overflow: hidden !important;
      white-space: nowrap !important;
      text-overflow: ellipsis !important;
      margin-right: 10px;
      text-decoration: none;
      color: var(--textColorMain);
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
  & .aside {
    @include jcCt-aiCt;
    min-width: 50px;
    height: 20px;
    gap: 8px;
    align-items: center;
    & > span {
      font-size: 11px;
      margin-top: 0;
      color: var(--textColorSecondary);
    }
  }
  & p {
    overflow: hidden;
    height: 100%;
    word-break: break-all;
  }
  & img {
    margin: 5px 0;
    max-width: 500px;
  }
  & .cancel {
    font-size: 11px;
    margin-top: 5px;
    color: var(--cancelButton);
    &:hover {
      cursor: pointer;
      color: var(--cancelButtonHover);
    }
  }
}
</style>
