import axios from "axios";

export const im1o = async (prompt) => {
  try {
    const response = await axios.post('https://agent-api-1-9y8v.onrender.com/chat', {
      message: prompt
    });
    console.log(response.data);
    return response.data.response;
  } catch (error) {
    console.error('Error sending message to Python route:', error);
    throw error;
  }
};
