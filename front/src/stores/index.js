import { defineStore } from 'pinia';

export const usePostStore = defineStore('post', {
  id: 'Post',
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
      const response = await fetch('http://localhost:3000/api/posts/getAll');
      const data = await response.json();
      this.posts = data;
    },
    async createOne(data, token) {
      await fetch('http://localhost:3000/api/posts/createOne', {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      await this.getAll();
    },
    async updateOne(id, data, token) {
      await fetch(`http://localhost:3000/api/posts/updateOne/${id}`, {
        method: 'PUT',
        body: data,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      await this.getAll();
    },
    async deleteOne(id, token) {
      await fetch(`http://localhost:3000/api/posts/deleteOne/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    },
  },
});

export const useUserStore = defineStore('user', {
  actions: {
    async login(email, password) {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    },
    async signup(data) {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const resData = await response.json();
      return resData;
    },
  },
});

export const useLikeStore = defineStore('like', {
  actions: {
    async likePost(token, postId) {
      const res = await fetch(
        `http://localhost:3000/api/posts/${postId}/reactions`,
        {
          method: 'POST',
          body: JSON.stringify({
            postId,
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resData = await res.json();
      return resData;
    },
  },
});
