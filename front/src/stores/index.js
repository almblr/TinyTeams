import { defineStore } from "pinia";
import axios from "axios";

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
    async createOne(data, token) {
      await fetch("http://localhost:3000/api/posts/createOne", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
    async getAll(postId, token) {
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    },
    async updateOne(postId, commentId, data, token) {
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
    },
    async deleteOne(postId, commentId, token) {
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
