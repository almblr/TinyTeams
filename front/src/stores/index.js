import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  id: "User",
  state: () => ({
    user: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      profilPicture: "",
    },
  }),
  actions: {
    async signup() {
      const data = {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        email: this.user.email,
        password: this.user.password,
      };
      const response = await axios({
        url: "http://localhost:3000/api/users/signup",
        method: "POST",
        data: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    async login() {
      const data = {
        email: this.user.email,
        password: this.user.password,
      };
      const response = await axios({
        url: "http://localhost:3000/api/users/login",
        method: "POST",
        data: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    async getOne(token, username) {
      const response = await axios({
        url: `http://localhost:3000/api/users/getOne/${username}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.user.firstname = response.data.firstname;
      this.user.lastname = response.data.lastname;
      this.user.email = response.data.email;
      this.user.password = response.data.password;
      this.user.profilPicture = response.data.profilPicture;
    },
  },
});

export const usePostStore = defineStore("post", {
  id: "Post",
  state: () => ({
    posts: [],
  }),
  actions: {
    async getOne(token, id) {
      const response = await fetch(
        `http://localhost:3000/api/posts/getOne/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const post = await response.json();
      const postId = post.id;
      const findPost = this.posts.find((post) => post.id === postId);
      const index = this.posts.indexOf(findPost);
      this.posts.splice(index, 1, post);
      return post;
    },
    async getAll(token) {
      const response = await fetch("http://localhost:3000/api/posts/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      this.posts = data;
    },
    async create(data, token) {
      await fetch("http://localhost:3000/api/posts/create", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    async update(id, data, token) {
      await fetch(`http://localhost:3000/api/posts/update/${id}`, {
        method: "PUT",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    async delete(id, token) {
      await fetch(`http://localhost:3000/api/posts/delete/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
});

export const useLikeStore = defineStore("like", {
  actions: {
    async likePost(token, postId) {
      const res = await fetch(
        `http://localhost:3000/api/posts/${postId}/react`,
        {
          method: "POST",
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

export const useCommentStore = defineStore("comment", {
  id: "Comment",
  state: () => ({
    comments: [],
  }),
  actions: {
    async getAll(postId, token) {
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}/comments/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      this.comments = data;
    },
    async create(postId, data, token) {
      await fetch(`http://localhost:3000/api/posts/${postId}/comments/create`, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    async update(postId, commentId, data, token) {
      await fetch(
        `http://localhost:3000/api/posts/${postId}/comments/${commentId}/update`,
        {
          method: "PUT",
          body: data,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    async delete(postId, commentId, token) {
      await fetch(
        `http://localhost:3000/api/posts/${postId}/comments/${commentId}/delete`,
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
