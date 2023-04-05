import { defineStore } from "pinia";
import axios from "axios";

const useFollowStore = defineStore("follow", {
  state: () => ({
    token: JSON.parse(sessionStorage.getItem(`token`)),
    follows: [],
  }),
  actions: {
    async sendFollow(userId) {
      const res = await axios({
        url: `http://localhost:3000/api/users/follow/${userId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      this.follows.push(res.data);
      return res.data;
    },
    async getOne(userId) {
      const res = await axios({
        url: `http://localhost:3000/api/users/follow/getOne/${userId}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      Object.values(res.data).includes("Follow not found")
        ? false
        : this.follows.push(res.data);
    },
    async unfollow(followId) {
      const res = await axios({
        url: `http://localhost:3000/api/users/unfollow/${followId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      const follow = this.follows.find((follow) => follow.id === followId);
      const followIndex = this.follows.indexOf(follow);
      this.follows.splice(followIndex, 1);
    },
  },
});

export default useFollowStore;
