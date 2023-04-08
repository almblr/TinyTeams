import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const usePostStore = defineStore("posts", () => {
  const token = JSON.parse(sessionStorage.getItem(`token`));
  const posts = ref([]);

  const getOne = async (postId) => {
    const res = await axios({
      url: `http://localhost:3000/api/posts/getOne/${postId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };
  const getAll = async (userId, lastPostViewed) => {
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
    if (lastPostViewed) {
      return posts.value.push(...res.data);
    }
    posts.value = res.data;
  };
  const create = async (data) => {
    const res = await axios({
      url: "http://localhost:3000/api/posts/create",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    posts.value.unshift(res.data);
    return res.data;
  };
  const update = async (postId, data) => {
    const res = await axios({
      url: `http://localhost:3000/api/posts/update/${postId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    const updatedPost = res.data;
    const findPost = posts.value.find((post) => post.id === updatedPost.id);
    const index = posts.value.indexOf(findPost);
    posts.value[index] = updatedPost;
  };
  const deletePost = async (postId) => {
    await axios({
      url: `http://localhost:3000/api/posts/delete/${postId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const postToDelete = posts.value.findIndex((post) => post.id === postId);
    posts.value.splice(postToDelete, 1);
  };

  return {
    posts,
    getOne,
    getAll,
    create,
    update,
    deletePost,
  };
});

export default usePostStore;
