import { defineStore } from "pinia";
import axios from "axios";

let token = JSON.parse(sessionStorage.getItem(`user`))?.token || null;

export const useUserStore = defineStore("user", {
  id: "User",
  state: () => ({
    users: [],
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
      useUserStore().login(data);
    },
    async login(data) {
      const res = await axios({
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
          userId: res.data.userId,
          isAdmin: res.data.isAdmin,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          username: res.data.username,
          profilPicture: res.data.profilPicture,
          token: res.data.token,
        })
      );
      token = res.data.token;
      return res.data;
    },
    async getOne(username) {
      const res = await axios({
        url: `http://localhost:3000/api/users/getOne/${username}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    async getAll(string, lastUserViewed) {
      const res = await axios({
        url: `http://localhost:3000/api/users/getAll/`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: string,
          lastUserId: lastUserViewed,
        },
      });
      this.users = res.data;
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
      this.posts.push(...res.data);
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

export const useCommentStore = defineStore("comment", {
  id: "Comment",
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

export const useFollowStore = defineStore("follow", {
  id: "Follows",
  state: () => ({
    follows: [],
  }),
  actions: {
    async sendFollow(userId) {
      const res = await axios({
        url: `http://localhost:3000/api/users/follow/${userId}`,
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      this.follows.push(res.data);
    },
    async getOne(userId) {
      const res = await axios({
        url: `http://localhost:3000/api/users/follow/getOne/${userId}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      Object.values(res.data).includes("Follow not found")
        ? false
        : this.follows.push(res.data);
    },
    async unfollow(followId) {
      const res = await axios({
        url: `http://localhost:3000/api/users/unfollow/${followId}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const follow = this.follows.find((follow) => follow.id === followId);
      const followIndex = this.follows.indexOf(follow);
      this.follows.splice(followIndex, 1);
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
      const res = await axios(
        `https://api.giphy.com/v1/gifs/trending?api_key=${this.GIPHY_KEY}&offset=${this.offset_trends}&limit=5`
      );
      this.offset_trends += 5;
      this.gifs.push(...res.data.data);
    },
    async searchGif(q) {
      const res = await axios(
        `https://api.giphy.com/v1/gifs/search?api_key=${this.GIPHY_KEY}&offset=${this.offset_search}&q=${q}&limit=5`
      );
      this.offset_search += 5;
      this.gifs.push(...res.data.data);
    },
  },
});
