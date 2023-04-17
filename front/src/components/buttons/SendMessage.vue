<template>
  <button class="btn" @click="sendMessage">Message</button>
</template>

<script setup>
import router from "@/router/index.js";
import useChatStore from "@/stores/chatStore.js";

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});
const chatStore = useChatStore();

const sendMessage = async () => {
  chatStore.showMobileUsersList = false;
  chatStore.newMessage = true;
  router.push(`/messages/new/${props.userId}`);
};
</script>
<style lang="scss" scoped>
.btn {
  @include jcCt-aiCt;
  max-width: 300px;
  width: 110px;
  height: 35px;
  padding: 0px 15px;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  transition: 200ms;
  color: #ffffff;
  background-color: #2374e1;
  cursor: pointer;
  span {
    @include jcCt-aiCt;
    gap: 10px;
  }
}
</style>
