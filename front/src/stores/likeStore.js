import { defineStore } from "pinia";
import axios from "axios";

let token = JSON.parse(sessionStorage.getItem(`user`))?.user.token || null;

const useLikeStore = defineStore("like", {
  actions: {
    async likePost(postId) {
      const res = await axios({
        url: `http://localhost:3000/api/posts/${postId}/react`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
