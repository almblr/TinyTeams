<template>
  <section class="preview" v-if="newUser">
    <img :src="newUser.profilePicture" alt="profilePicture" />
    <div>
      <h3>{{ newUser.firstname }} {{ newUser.lastname }}</h3>
      <span>{{ newUser.job }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import useUserStore from "@/stores/userStore.js";

const userStore = useUserStore();
const route = useRoute();
const newUser = ref(null);

const getUser = async (userId) => {
  newUser.value = await userStore.getOne(userId);
};

watch(
  () => route.params,
  async (newValue) => {
    if ("userId" in newValue) {
      getUser(newValue.userId);
    }
  }
);

onMounted(async () => {
  if ("userId" in route.params) {
    getUser(route.params.userId);
  }
});
</script>

<style lang="scss" scoped>
.preview {
  @include fdCol-jcCt-aiCt;
  flex: 1;
  padding-top: 100px;
  text-align: center;
  color: var(--textColorMain);
  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 50%;
  }
}
</style>
