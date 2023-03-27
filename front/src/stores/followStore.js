import { defineStore } from "pinia";
import axios from "axios";

let token = JSON.parse(sessionStorage.getItem(`user`))?.token || null;

const useFollowStore = defineStore("follow", {
  state: () => ({
    follows: [],
  }),
  actions: {
    async sendFollow(userId) {
      const res = await axios({
        url: `http://localhost:3000/api/users/follow/${userId}`,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      this.follows.push(res.data);
    },
    async getOne(userId) {
      const res = await axios({
        url: `http://localhost:3000/api/users/follow/getOne/${userId}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
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
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const follow = this.follows.find((follow) => follow.id === followId);
      const followIndex = this.follows.indexOf(follow);
      this.follows.splice(followIndex, 1);
    },
  },
});

export default useFollowStore;
