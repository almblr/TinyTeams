import { defineStore } from "pinia";
import axios from "axios";

export const usePostStore = defineStore("post", {
  id: "Post",
  state: () => ({
    posts: [],
  }),
  getters: {
    getPosts: (state) => {
      return state.posts;
    },
  },
  actions: {
    async getOne(id, token) {
      const response = await fetch(
        `http://localhost:3000/api/posts/getOne/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    },
    async getAll() {
      const response = await fetch("http://localhost:3000/api/posts/getAll");
      const data = await response.json();
      this.posts = data;
    },
    async createOne(data, token) {
      await fetch("http://localhost:3000/api/posts/createOne", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await this.getAll();
    },
    async updateOne(id, data, token) {
      await fetch(`http://localhost:3000/api/posts/updateOne/${id}`, {
        method: "PUT",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await this.getAll();
    },
    async deleteOne(id, token) {
      await fetch(`http://localhost:3000/api/posts/deleteOne/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}/getAll`
      );
      const data = await response.json();
      this.comments = data;
    },
    async createOne(postId, data, token) {
      await fetch(`http://localhost:3000/api/posts/${postId}/postComment`, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await this.getAll();
    },
    async updateOne(id, data, token) {
      await fetch(
        `http://localhost:3000/api/posts/${postId}/${commentId}/modify`,
        {
          method: "PUT",
          body: data,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await this.getAll();
    },
    async deleteOne(id, token) {
      await fetch(
        `http://localhost:3000/api/posts/${postId}/${commentId}/delete`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  },
});

export const useUserStore = defineStore("user", {
  id: "User",
  state: () => ({
    user: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  }),
  getters: {
    getUser(state) {
      state.user;
    },
  },
  actions: {
    async login() {
      const data = {
        email: this.user.email,
        password: this.user.password,
      };
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      return res;
    },
    async signup() {
      const data = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        password: this.user.password,
      };
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      return res;
    },
  },
});

export const useGiphyStore = defineStore("gif", {
  id: "Gifs",
  state: () => ({
    gifs: [],
    GIPHY_KEY: "lcUOyzUQjkn8d8MZbdFTekgbf0kD25vt",
    offset: 0,
  }),
  actions: {
    resetGifs() {
      this.gifs = [];
      this.offset = 0;
    },
    async getTrendsGif(start) {
      start = start ? start : this.offset;
      const response = await axios(
        `https://api.giphy.com/v1/gifs/trending?api_key=${this.GIPHY_KEY}&offset=${start}`
      );
      this.gifs.push(...response.data.data);
      this.offset = start + this.limit; // Permet d'afficher les prochains gifs plutôt que de réafficher les mêmes
    },
    async searchGif(start, q) {
      const response = await axios(
        `https://api.giphy.com/v1/gifs/search?api_key=${this.GIPHY_KEY}&offset=${start}&q=${q}`
      );
      this.gifs.push(...response.data.data);
      this.offset = start + this.limit;
    },
  },
});

export const useLikeStore = defineStore("like", {
  actions: {
    async likePost(token, postId) {
      const res = await fetch(
        `http://localhost:3000/api/posts/${postId}/reactions`,
        {
          method: "POST",
          body: JSON.stringify({
            postId,
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resData = await res.json();
      return resData;
    },
  },
});
