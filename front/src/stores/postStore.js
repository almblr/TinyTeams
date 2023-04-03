import { defineStore } from "pinia";
import axios from "axios";

const usePostStore = defineStore("post", {
  state: () => ({
    token: JSON.parse(sessionStorage.getItem(`token`)),
    posts: [],
  }),
  actions: {
    async getOne(postId) {
      const res = await axios({
        url: `http://localhost:3000/api/posts/getOne/${postId}`,
        headers: {
          Authorization: `Bearer ${this.token}`,
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
          Authorization: `Bearer ${this.token}`,
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
          Authorization: `Bearer ${this.token}`,
        },
        data,
      });
      this.posts.unshift(res.data);
      return res.data;
    },
    async update(postId, data) {
      const res = await axios({
        url: `http://localhost:3000/api/posts/update/${postId}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.token}`,
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
          Authorization: `Bearer ${this.token}`,
        },
      });
      const postToDelete = this.posts.findIndex((post) => post.id === postId);
      this.posts.splice(postToDelete, 1);
    },
  },
});

export default usePostStore;
