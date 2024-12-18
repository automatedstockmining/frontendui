import axios from "axios";

export const im1o = async (prompt) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/chat", {
      message: prompt
    }, { withCredentials: true });
    return response.data.response; // Return the chatbot's response
  } catch (error) {
    console.error('Error sending message to Python route:', error);
    throw error;
  }
};
