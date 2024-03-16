import config from "../../config";
import axios from "axios";
import { accessToken } from "../../helpers/jwt-token-access/accessToken";

//GET APIs
export async function getArticles(page,searchKeyword) {
  const apiUrl = `${config.api.API_URL}/data/articles?page=${page || "1"}&search=${searchKeyword}&searchBy=title`;

  try {
    const response = await axios.get(apiUrl);
    // console.log("Get Artices : ", response);
    return response.data; // Assuming the response contains the data you're interested in
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
}

export async function getBlogs(page,searchKeyword,id) {
  const apiUrl = `${config.api.API_URL}/data/blogs?page=${page || "1"}&search=${searchKeyword}&searchBy=title&id=${id}`;
  try {
    const response = await axios.get(apiUrl);
    // console.log("Get Artices : ", response);
    return response.data; // Assuming the response contains the data you're interested in
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
}

export async function getPodcast(page,searchKeyword) {
  const apiUrl = `${config.api.API_URL}/data/podcasts?page=${page || "1"}&search=${searchKeyword}&searchBy=title`;
  console.log(apiUrl)
  try {
    const response = await axios.get(apiUrl);
    // console.log("Get Podcast : ", response);
    return response.data; // Assuming the response contains the data you're interested in
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
}

export async function getVideo(page,searchKeyword) {
  console.log(searchKeyword)
  const apiUrl = `${config.api.API_URL}/data/videos?page=${page || "1"}&search=${searchKeyword}&searchBy=title`;

  try {
    const response = await axios.get(apiUrl);
    // console.log("Get Podcast : ", response);
    return response.data; // Assuming the response contains the data you're interested in
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
}

//POST APIs
export async function createArticles(data) {
  const url = `${config.api.API_URL}/article`;
  try {
    const response = await axios.post(url, data);
    // console.log("Respnse : ", response);
    return response;
  } catch (error) {
    throw new Error("Error", error.message || "Network error");
  }
}

export async function createBlog(data) {
  const url =  `${config.api.API_URL}/blogs`;
  try {
    const response = await axios.post(url, data);
    // console.log("Respnse : ", response);
    return response;
  } catch (error) {
    throw new Error("Error", error.message || "Network error");
  }
}

export async function createPodcast(data) {
  const url = config.api.API_URL + `/podcast`;
  try {
    const response = await axios.post(url, data);
    // console.log("Respnse : ", response);
    return response;
  } catch (error) {
    throw new Error("Error", error.message || "Network error");
  }
}

export async function createVideo(data) {
  const url =   `${config.api.API_URL}/videos/`;
  console.log(data)
  try {
    const response = await axios.post(url, data);
    // console.log("Respnse : ", response);
    // console.log(data)
    return response;
  } catch (error) {
    throw new Error("Error", error.message || "Network error");
  }
}
// UPDATE API
export async function updateArticles(data,id) {
  const url = `${config.api.API_URL}/article?id=${id}`;
  try {
    const response = await axios.put(url, data);
    // console.log("Respnse : ", response);
    return response;
  } catch (error) {
    throw new Error("Error", error.message || "Network error");
  }
}

export async function updateBlogs(data,id) {
  const url = `${config.api.API_URL}/blogs?id=${id}`;
  try {
    const response = await axios.put(url, data);
    // console.log("Respnse : ", response);
    return response;
  } catch (error) {
    throw new Error("Error", error.message || "Network error");
  }
}
export async function updatePodcast(data,id) {
  const url = `${config.api.API_URL}/podcast?id=${id}`;
  try {
    const response = await axios.put(url, data);
    // console.log("Respnse : ", response);
    return response;
  } catch (error) {
    throw new Error("Error", error.message || "Network error");
  }
}
export async function updateVideo(data,id) {
  const url = `${config.api.API_URL}/videos?id=${id}`;
  try {
    const response = await axios.put(url, data);
    // console.log("Respnse : ", response);
    return response;
  } catch (error) {
    throw new Error("Error", error.message || "Network error");
  }
}

//DELETE API
export async function deleteArticle(id) {
  const apiUrl = `${config.api.API_URL}/article?id=${id}`;

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed, such as authorization headers
        Authorization: accessToken, // Add your authorization header
        "x-origin": "https://www.psymate.org", // Add the x-origin header
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete article. Status: ${response.status}`);
    }

    const data = await response.json();
    // Handle the response data if needed
    console.log("Article deleted successfully", data);
    return data;
  } catch (error) {
    console.error("Error deleting article:", error.message);
    throw error;
  }
}

export async function deleteBlog(id) {
  const apiUrl = `${config.api.API_URL}/blogs/${id}`;

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed, such as authorization headers
        Authorization: accessToken, // Add your authorization header
        "x-origin": "https://www.psymate.org", // Add the x-origin header
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete article. Status: ${response.status}`);
    }

    const data = await response.json();
    // Handle the response data if needed
    console.log("Blog deleted successfully", data);
    return data;
  } catch (error) {
    console.error("Error deleting blog:", error.message);
    throw error;
  }
}

export async function deleteVideo(id) {
  const apiUrl = `${config.api.API_URL}/videos/${id}`;

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed, such as authorization headers
        Authorization: accessToken, // Add your authorization header
        "x-origin": "https://www.psymate.org", // Add the x-origin header
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete Video. Status: ${response.status}`);
    }

    const data = await response.json();
    // Handle the response data if needed
    console.log("Video deleted successfully", data);
    return data;
  } catch (error) {
    console.error("Error deleting video:", error.message);
    throw error;
  }
}

export async function deletePodcast(id) {
  const apiUrl = `${config.api.API_URL}/podcast/${id}`;

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed, such as authorization headers
        Authorization: accessToken, // Add your authorization header
        "x-origin": "https://www.psymate.org", // Add the x-origin header
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete Podcast. Status: ${response.status}`);
    }

    const data = await response.json();
    // Handle the response data if needed
    console.log("Podcast deleted successfully", data);
    return data;
  } catch (error) {
    console.error("Error deleting Podcast:", error.message);
    throw error;
  }
}
