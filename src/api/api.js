import axios from "axios";
import config from "../config";

export async function createLead(data) {
  const url = config.api.API_URL + `/lead`;
  try {
    const response = await axios.post(url, data);
    // console.log("Respnse : ", response);
    return response;
  } catch (error) {
    throw new Error("Error", error.message || "Network error");
  }
}

export async function getLead(page=1) {
  const apiUrl = `${config.api.API_URL}/users?search=false&searchBy=created&boolean=true&page=${page}`;

  try {
    const response = await axios.get(apiUrl);
    // console.log("Get Lead : ", response);
    return response; // Assuming the response contains the data you're interested in
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
}

export async function convertLeadToUser(id, updatedData) {
  const apiUrl = `${config.api.API_URL}/lead/convert/${id}`;

  try {
    const response = await axios.put(apiUrl, updatedData);
    return response.data; // Assuming the response contains the data you're interested in
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
}
