import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

const useConversationStore = defineStore("conversation", () => {
  const token = JSON.parse(sessionStorage.getItem(`token`));
  const conversations = ref([]);
  const messages = ref([]);
  const onversationMode = ref(false);
  const newMessage = ref(false);
  const showMobileUsersList = ref(false);

  const createConversation = async (userId) => {
    const res = await axios({
      url: "http://localhost:3000/api/conversations/create",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        user2: parseInt(userId),
      },
    });
    conversations.value.unshift(res.data);
    return res.data;
  };
  const getOneConv = async (conversationId) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/getOne/${conversationId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };
  const getUserConvs = async (lastConversationViewed) => {
    let url = `http://localhost:3000/api/conversations/getAll/`;
    const res = await axios({
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        lastConversationId: lastConversationViewed,
      },
    });
    if (Object.values(res.data).includes("No more conversations")) {
      return console.log("No more convs to load");
    }
    if (lastConversationViewed) {
      return conversations.value.push(...res.data);
    }
    conversations.value = res.data;
  };
  const updateConv = async (conversationId, lastMessageDate) => {
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
  const getConversationMsg = async (conversationId, lastMessageViewed) => {
    const res = await axios({
      url: `http://localhost:3000/api/conversations/messages/${conversationId}/getAll`,
      method: "GET",
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
    if (lastMessageViewed) {
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
    newMessage,
    onversationMode,
    showMobileUsersList,
    createConversation,
    getOneConv,
    getUserConvs,
    updateConv,
    createMessage,
    getConversationMsg,
    deleteMessage,
  };
});

export default useConversationStore;
