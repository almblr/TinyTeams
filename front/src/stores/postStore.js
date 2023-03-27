import { defineStore } from "pinia";
import axios from "axios";

let token = JSON.parse(sessionStorage.getItem(`user`))?.token || null;

const usePostStore = defineStore("post", {
  state: () => ({
    posts: [],
  }),
  actions: {
    async getOne(postId) {
      const res = await axios({
        url: `http://localhost:3000/api/posts/getOne/${postId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const Post = await res.data;
      const findPost = this.posts.find((post) => post.id === Post.id);
      const index = this.posts.indexOf(findPost);
      this.posts.splice(index, 1, Post);
    },
    async getAll(userId, lastPostViewed) {
      let url = `http://localhost:3000/api/posts/getAll/`;
      const res = await axios({
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId,
          lastPostId: lastPostViewed,
        },
      });
      if (Object.values(res.data).includes("No more posts")) {
        return console.log("No more posts to load");
      }
      this.posts = res.data;
    },
    async create(data) {
      const res = await axios({
        url: "http://localhost:3000/api/posts/create",
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      });
      this.posts.unshift(res.data);
    },
    async update(postId, data) {
      const res = await axios({
        url: `http://localhost:3000/api/posts/update/${postId}`,
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      });
      const Post = await res.data;
      const findPost = this.posts.find((post) => post.id === Post.id);
      const index = this.posts.indexOf(findPost);
      this.posts.splice(index, 1, Post);
    },
    async delete(postId) {
      await axios({
        url: `http://localhost:3000/api/posts/delete/${postId}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const postToDelete = this.posts.findIndex((post) => post.id === postId);
      this.posts.splice(postToDelete, 1);
    },
  },
});

export default usePostStore;
