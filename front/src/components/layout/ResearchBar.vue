<template>
  <div class="container-input">
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher un membre"
      @input="searchUser(search)"
    />
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 1920 1920"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
        fill-rule="evenodd"
      ></path>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useUserStore from "@/stores/userStore.js";

const userStore = useUserStore();
const search = ref(null);
const searchUser = async (string) => {
  await userStore.getAll(string);
};

onMounted(async () => {
  await userStore.getAll();
});
const props = defineProps({
  function: Function,
});
</script>

<style lang="scss" scoped>
.container-input {
  position: relative;
  margin-bottom: 30px;
}

input {
  opacity: 1;
  width: 250px;
  padding: 10px 0px 10px 40px;
  border-radius: 50px;
  border: solid 1px #333;
  transition: all 0.2s ease-in-out;
  outline: none;
  opacity: 0.8;
  background-color: var(--backgroundSecond);
  caret-color: var(--textColorMain);
  color: var(--textColorMain);
}
input::placeholder {
  color: var(--textColorSecond);
}

input:placeholder-shown {
  text-overflow: ellipsis;
}
.container-input svg {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translate(0, -50%);
  fill: var(--textColorMain);
}

@media (min-width: 768px) {
  .container-input {
    margin-bottom: 0;
  }
}
</style>
