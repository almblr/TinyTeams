import { defineStore } from "pinia";
import axios from "axios";
import usePostStore from "./postStore";

const useLikeStore = defineStore("like", {
  state: () => ({
    token: JSON.parse(sessionStorage.getItem(`token`)),
  }),
  actions: {
    async likePost(postId) {
      const res = await axios({
        url: `http://localhost:3000/api/posts/${postId}/react`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      const posts = usePostStore().posts;
      const foundPost = posts.find((post) => post.id === postId);
      if ("removedLikeId" in res.data) {
        const existingLike = foundPost.reactions.findIndex(
          (like) => (like.id = res.data.likeId)
        );
        foundPost.reactions.splice(existingLike, 1);
      } else {
        foundPost.reactions.push(res.data);
      }
    },
  },
});

export default useLikeStore;
