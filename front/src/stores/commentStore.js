import { defineStore } from "pinia";
import usePostStore from "./postStore";
import axios from "axios";

const useCommentStore = defineStore("comment", {
  state: () => ({
    token: JSON.parse(sessionStorage.getItem(`token`)),
    comments: [],
  }),
  actions: {
    async getAll(postId) {
      const res = await axios({
        url: `http://localhost:3000/api/posts/${postId}/comments/getAll`,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      this.comments = await res.data;
    },
    async create(postId, data) {
      await axios({
        url: `http://localhost:3000/api/posts/${postId}/comments/create`,
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        data,
      });
      await usePostStore().getOne(postId);
    },
    async update(postId, commentId, data) {
      await axios({
        url: `http://localhost:3000/api/posts/${postId}/comments/${commentId}/update`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        data,
      });
      await usePostStore().getOne(postId);
    },
    async delete(postId, commentId) {
      await axios({
        url: `http://localhost:3000/api/posts/${postId}/comments/${commentId}/delete`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      await usePostStore().getOne(postId);
    },
  },
});

export default useCommentStore;
