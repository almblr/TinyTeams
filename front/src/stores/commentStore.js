import { defineStore } from "pinia";
import usePostStore from "./postStore";
import axios from "axios";

let token = JSON.parse(sessionStorage.getItem(`user`))?.token || null;

const useCommentStore = defineStore("comment", {
  state: () => ({
    comments: [],
  }),
  actions: {
    async getAll(postId) {
      const res = await axios({
        url: `http://localhost:3000/api/posts/${postId}/comments/getAll`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.comments = await res.data;
    },
    async create(postId, data) {
      await axios({
        url: `http://localhost:3000/api/posts/${postId}/comments/create`,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
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
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      });
    },
    async delete(postId, commentId) {
      await axios({
        url: `http://localhost:3000/api/posts/${postId}/comments/${commentId}/delete`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await usePostStore().getOne(postId);
    },
  },
});

export default useCommentStore;
