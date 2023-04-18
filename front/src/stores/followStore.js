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
    this.follows.push(res.data);
    return res.data;
  };
  const getOne = async (userId) => {
    const res = await axios({
      url: `http://localhost:3000/api/users/follow/getOne/${userId}`,
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    Object.values(res.data).includes("Follow not found")
      ? false
      : this.follows.push(res.data);
  };
  const unfollow = async (followId) => {
    const res = await axios({
      url: `http://localhost:3000/api/users/unfollow/${followId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    });
    const follow = this.follows.find((follow) => follow.id === followId);
    const followIndex = this.follows.indexOf(follow);
    this.follows.splice(followIndex, 1);
  };

  function $reset() {
    follows.value = [];
  }

  return {
    follows,
    sendFollow,
    getOne,
    unfollow,
    $reset,
  };
});

export default useFollowStore;
