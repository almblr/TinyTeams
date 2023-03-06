import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  id: "User",
  state: () => ({
    token: JSON.parse(localStorage.getItem(`user`))?.token || null,
  }),
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
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: response.data.userId,
          isAdmin: response.data.isAdmin,
          userName: response.data.userName,
          profilPicture: response.data.profilPicture,
          token: response.data.token,
        })
      );
      this.token = response.data.token;
      return response;
    },
    async getOne(username) {
      const response = await axios({
        url: `http://localhost:3000/api/users/getOne/${username}`,
        headers: {
          Authorization: `Bearer ${this.user.token}`,
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
    userToken: useUserStore().token,
  }),
  actions: {
    async getOne(postId) {
      const response = await fetch(
        `http://localhost:3000/api/posts/getOne/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${this.userToken}`,
          },
        }
      );
      const Post = await response.json();
      const findPost = this.posts.find((post) => post.id === Post.id);
      const index = this.posts.indexOf(findPost);
      this.posts.splice(index, 1, Post);
      return Post;
    },
    async getAll() {
      console.log(useUserStore().token);
      const response = await fetch("http://localhost:3000/api/posts/getAll", {
        headers: {
          Authorization: `Bearer ${this.userToken}`,
        },
      });
      const data = await response.json();
      this.posts = data;
    },
    async create(data) {
      await fetch("http://localhost:3000/api/posts/create", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.userToken}`,
        },
      });
    },
    async update(postId, data) {
      await fetch(`http://localhost:3000/api/posts/update/${postId}`, {
        method: "PUT",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.userToken}`,
        },
      });
    },
    async delete(postId) {
      await fetch(`http://localhost:3000/api/posts/delete/${postId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.userToken}`,
        },
      });
    },
  },
});

export const useLikeStore = defineStore("like", {
  getters: {
    userToken: () => useUserStore().token,
  },
  actions: {
    async likePost(postId) {
      const res = await fetch(
        `http://localhost:3000/api/posts/${postId}/react`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.userToken}`,
          },
        }
      );
      const resData = await res.json();
      return resData;
    },
  },
});

export const useCommentStore = defineStore("comment", {
  id: "Comment",
  state: () => ({
    comments: [],
  }),
  getters: {
    userToken: () => useUserStore().token,
  },
  actions: {
    async getAll(postId) {
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}/comments/getAll`,
        {
          headers: {
            Authorization: `Bearer ${this.userToken}`,
          },
        }
      );
      const data = await response.json();
      this.comments = data;
    },
    async create(postId, data) {
      await fetch(`http://localhost:3000/api/posts/${postId}/comments/create`, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.userToken}`,
        },
      });
    },
    async update(postId, commentId, data) {
      await fetch(
        `http://localhost:3000/api/posts/${postId}/comments/${commentId}/update`,
        {
          method: "PUT",
          body: data,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.userToken}`,
          },
        }
      );
    },
    async delete(postId, commentId) {
      await fetch(
        `http://localhost:3000/api/posts/${postId}/comments/${commentId}/delete`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${this.userToken}`,
          },
        }
      );
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
