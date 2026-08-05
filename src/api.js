import axios from "axios";

const API = axios.create({
    baseURL: "https://askmate-ai.onrender.com/api",
    withCredentials: true, // Crucial for sending auth cookies
});

export default API;