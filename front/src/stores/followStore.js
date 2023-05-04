import { ref } from "vue";
import { defineStore } from "pinia";
import useUserStore from "./userStore.js";
import axios from "axios";

const useFollowStore = defineStore("follow", () => {
  const userStore = useUserStore();
  const follows = ref([]);

  const sendFollow = async (userId) => {
    const res = await axios({
      url: `http://localhost:3000/api/users/follow/${userId}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    follows.value.unshift(res.data);
    return res.data;
  };
  const getOneFollow = async (userId) => {
    const res = await axios({
      url: `http://localhost:3000/api/users/follow/getOne/${userId}`,
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    if (res.data.message === "Follow not found") {
      return false;
    } else {
      follows.value.unshift(res.data);
      return true;
    }
  };
  const unfollow = async (followId) => {
    await axios({
      url: `http://localhost:3000/api/users/unfollow/${followId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    const followIndex = follows.value.findIndex(
      (follow) => follow.id === followId
    );
    follows.value.splice(followIndex, 1);
  };

  function $reset() {
    follows.value = [];
  }

  return {
    follows,
    sendFollow,
    getOneFollow,
    unfollow,
    $reset,
  };
});

export default useFollowStore;
