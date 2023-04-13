import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

const useConversationStore = defineStore("conversation", () => {
  const token = JSON.parse(sessionStorage.getItem(`token`));
  const conversations = ref([]);
  const messages = ref([]);

  const createConversation = async (userId) => {
    const res = await axios({
      url: "http://localhost:3000/api/conversations/create",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        user2: userId,
      },
    });
    conversations.value.unshift(res.data);
  };
  const getOneConversation = async (conversationId) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/${conversationId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const foundConversation = conversations.value.find(
      (conversation) => conversation.id === conversationId
    );
    if (foundConversation) {
      conversations.value.splice(foundConversation, 1, res.data);
    } else {
      conversations.value.unshift(res.data);
    }
  };
  const updateConversation = async (conversationId, lastMessageDate) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/update/${conversationId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        lastMessageDate,
      },
    });
    const updatedConversation = res.data;
    const indexConversation = conversations.value.findIndex(
      (message) => message.id === updatedConversation.id
    );
    conversations.value.splice(indexConversation, 1, updatedConversation);
  };
  const createMessage = async (conversationId, data) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/${conversationId}/create`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    messages.value.push(res.data);
  };
  const getConversationMessages = async (conversationId, lastMessageViewed) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/${conversationId}/messages/getAll`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        lastMessageId: lastMessageViewed,
      },
    });
    if (Object.values(res.data).includes("No more messages")) {
      return console.log("No more messages to load");
    }
    if (lastPostViewed) {
      return messages.value.push(...res.data);
    }
    messages.value = res.data;
  };
  const deleteMessage = async (conversationId, messageId) => {
    await axios({
      url: `http://localhost:3000/api/conversations/${conversationId}/messages/${messageId}/delete`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const foundMessage = conversations.value.find(
      (message) => message.id === messageId
    );
    messages.splice(foundMessage, 1);
  };

  return {
    conversations,
    messages,
    createConversation,
    getOneConversation,
    updateConversation,
    createMessage,
    getConversationMessages,
    deleteMessage,
  };
});

export default useConversationStore;
