import { defineStore } from "pinia";
import axios from "axios";

let token = JSON.parse(sessionStorage.getItem(`user`))?.token || null;

export const useUserStore = defineStore("user", {
  id: "User",
  state: () => ({}),
  actions: {
    async signup(data) {
      await axios({
        url: "http://localhost:3000/api/users/signup",
        method: "POST",
        data: JSON.stringify({
          email: data.email,
          password: data.password,
          firstname: data.firstname,
          lastname: data.lastname,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    },
    async login(data) {
      const response = await axios({
        url: "http://localhost:3000/api/users/login",
        method: "POST",
        data: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          userId: response.data.userId,
          isAdmin: response.data.isAdmin,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          username: response.data.username,
          profilPicture: response.data.profilPicture,
          token: response.data.token,
        })
      );
      token = response.data.token;
      return response.data;
    },
    async getOne(username) {
      const response = await axios({
        url: `http://localhost:3000/api/users/getOne/${username}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  },
});

export const usePostStore = defineStore("post", {
  id: "Post",
  state: () => ({
    posts: [],
  }),
  actions: {
    async getOne(postId) {
      const response = await axios({
        url: `http://localhost:3000/api/posts/getOne/${postId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const Post = await response.data;
      const findPost = this.posts.find((post) => post.id === Post.id);
      const index = this.posts.indexOf(findPost);
      this.posts.splice(index, 1, Post);
    },
    async getAll(userId, lastPostViewed) {
      let url = `http://localhost:3000/api/posts/getAll/`;
      if (lastPostViewed) {
        url += lastPostViewed;
      }
      const response = await axios({
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.posts.push(...response.data);
    },
    async create(data) {
      await axios({
        url: "http://localhost:3000/api/posts/create",
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      });
    },
    async update(postId, data) {
      await axios({
        url: `http://localhost:3000/api/posts/update/${postId}`,
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      });
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

export const useLikeStore = defineStore("like", {
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
      return await res.data;
    },
  },
});

export const useCommentStore = defineStore("comment", {
  id: "Comment",
  state: () => ({
    comments: [],
  }),
  actions: {
    async getAll(postId) {
      const response = await axios({
        url: `http://localhost:3000/api/posts/${postId}/comments/getAll`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.comments = await response.data;
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
    },
  },
});

export const useFollowStore = defineStore("follow", {
  id: "Follows",
  actions: {
    async sendFollow(userId) {
      const response = await axios({
        url: `http://localhost:3000/api/users/follow/${userId}`,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    async getOne(userId) {
      const response = await axios({
        url: `http://localhost:3000/api/users/follow/getOne/${userId}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    async unfollow(userId) {
      const response = await axios({
        url: `http://localhost:3000/api/users/unfollow/${userId}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  },
});

export const useGiphyStore = defineStore("gif", {
  id: "Gifs",
  state: () => ({
    gifs: [],
    GIPHY_KEY: "lcUOyzUQjkn8d8MZbdFTekgbf0kD25vt",
    offset_trends: 0,
    offset_search: 0,
  }),
  actions: {
    resetGifs() {
      this.gifs = [];
      this.offset_trends = 0;
      this.offset_search = 0;
    },
    async getTrendsGif() {
      const response = await axios(
        `https://api.giphy.com/v1/gifs/trending?api_key=${this.GIPHY_KEY}&offset=${this.offset_trends}&limit=5`
      );
      this.offset_trends += 5;
      this.gifs.push(...response.data.data);
    },
    async searchGif(q) {
      const response = await axios(
        `https://api.giphy.com/v1/gifs/search?api_key=${this.GIPHY_KEY}&offset=${this.offset_search}&q=${q}&limit=5`
      );
      this.offset_search += 5;
      this.gifs.push(...response.data.data);
    },
  },
});
