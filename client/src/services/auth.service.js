import axios from "axios";
import { removeCookie } from "react-cookie";

const API_URL = "http://localhost/api/users/";

// The service uses Axios for HTTP requests and Local Storage for user information & JWT.
// It provides following important functions:

// login(): POST {username, password} & save User Profile to Local Storage
// logout(): POST logout request, remove User Profile from Local Storage
// getCurrentUser(): get stored user information

const register = (email, password) =>
  axios.post(`${API_URL}signup`, {
    email,
    password,
  });

const login = (email, password) =>
  axios
    .post(`${API_URL}login`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.email) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
const logout = () => {
  localStorage.removeItem("user");
  //remove les images des recettes des cookies locaux pour éviter qu'une grille d'un user ne se retrouve chez un nouveau user
  removeCookie("_ga_M8JRPG77BV");
  return axios.post(`${API_URL}logout`).then((response) => response.data);
};

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user.id;

  return axios.get(`${API_URL}${userId}`).then((response) => response.data);
  // return JSON.parse(localStorage.getItem('user'))
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};
export default AuthService;
