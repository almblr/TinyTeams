import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

const usePostStore = defineStore("posts", () => {
  const token = JSON.parse(sessionStorage.getItem(`token`));
  const posts = ref([]);

  const createPost = async (data) => {
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
  const getOne = async (postId) => {
    try {
      const res = await axios({
        url: `http://localhost:3000/api/posts/getOne/${postId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      return false;
    }
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
  const updatePost = async (postId, data) => {
    const res = await axios({
      url: `http://localhost:3000/api/posts/update/${postId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    const updatedPost = res.data;
    const indexPost = posts.value.findIndex(
      (post) => post.id === updatedPost.id
    );
    posts.value.splice(indexPost, 1, updatedPost);
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
  const likePost = async (postId) => {
    const res = await axios({
      url: `http://localhost:3000/api/posts/${postId}/react`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const foundPost = posts.value.find((post) => post.id === postId);
    if ("removedLikeId" in res.data) {
      const existingLike = foundPost.reactions.findIndex(
        (like) => (like.id = res.data.likeId)
      );
      foundPost.reactions.splice(existingLike, 1);
    } else {
      foundPost.reactions.unshift(res.data);
    }
    return res.data;
  };
  const createComment = async (postId, data) => {
    const res = await axios({
      url: `http://localhost:3000/api/posts/${postId}/comments/create`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    const foundPost = posts.value.find((post) => post.id === res.data.postId);
    foundPost.comments.unshift(res.data);
    return res.data;
  };
  const updateComment = async (postId, commentId, data) => {
    const res = await axios({
      url: `http://localhost:3000/api/posts/${postId}/comments/${commentId}/update`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    const foundPost = posts.value.find((post) => post.id === postId);
    const indexComment = foundPost.comments.findIndex(
      (comment) => comment.id === res.data.id
    );
    foundPost.comments.splice(indexComment, 1, res.data);
    console.log(res.data);
  };
  const deleteComment = async (postId, commentId) => {
    await axios({
      url: `http://localhost:3000/api/posts/${postId}/comments/${commentId}/delete`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const foundPost = posts.value.find((post) => post.id === postId);
    const foundComment = posts.value.find(
      (comment) => comment.id === commentId
    );
    foundPost.comments.splice(foundComment, 1);
  };

  return {
    posts,
    createPost,
    getOne,
    getAll,
    updatePost,
    deletePost,
    likePost,
    createComment,
    updateComment,
    deleteComment,
  };
});

export default usePostStore;
