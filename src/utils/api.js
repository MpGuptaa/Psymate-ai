import axios from "axios";
import config from "../config";

export const sendMessageApi = async (newMessage) => {
  try {
    const resp=await axios.post(`${config.api.API_URL}/chat/send`, newMessage);
  return resp;
  } catch (error) {
    console.log("Error sending message:", error);
      throw error;
  }
};

export const fetchPastMessagesApi = async (userId1, userId2) => {
    try {
      const response = await axios.get(`${config.api.API_URL}/chat/${userId1}/${userId2}`);
      return response;
    } catch (error) {
      console.log("Error fetching past messages:", error);
      throw error;
    }
  };

  export const fetchCounteryApi = async () => {
    try {
      const response = await axios.get(`${config.api.API_URL}/api/tools/country`);
      return response;
    } catch (error) {
      console.log("Error fetching past messages:", error);
      throw error;
    }
  };
  export const fetchStateApi = async (stateIsoCode) => {
    try {
      const response = await axios.get(`${config.api.API_URL}/api/tools//state/${stateIsoCode}`);
      return response;
    } catch (error) {
      console.log("Error fetching past messages:", error);
      throw error;
    }
  };
  export const fetchLanguageApi = async () => {
    try {
      const response = await axios.get(`${config.api.API_URL}/api/tools/languages`);
      return response;
    } catch (error) {
      console.log("Error fetching past messages:", error);
      throw error;
    }
  };

