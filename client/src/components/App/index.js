// == Import
import "./styles.scss";
import axios from "axios";
import moment from "moment";

import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AuthService from "../../services/auth.service";
import Footer from "../Footer";

import Header from "../Header";
import Register from "../Register";
import Login from "../Login";
import Profil from "../Profil";
import Dashboard from "../Dashboard";
import Recipe from "../Recipe";
import Contact from "../Contact";
import Cgu from "../Cgu";
import NotFound from "../NotFound";
import Faq from "../Faq";
import Team from "../Team";

// == Composant
function App() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(undefined);
  const [userMeals, setUserMeals] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AuthService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    fetchUser();
  }, []);

  useEffect(async () => {
    await fetchUserMeals(currentUser.id);
  }, [currentUser]);

  const addNewUser = (user) => {
    setCurrentUser(user);
  };

  const updateUserState = (e) => {
    setCurrentUser({
      ...currentUser,
      [e.target.name]: e.target.value,
    });
  };

  const createUserMeals = async () => {
    try {
      const date = moment().format();
      const obj = {
        start_date: date,
      };

      console.log("current user from auth", AuthService.getCurrentUser());

      console.log("TOKEN ", AuthService.getCurrentUser().token);
      const result = await axios.post(
        `http://localhost/api/meals/${currentUser.id}/postnewmeals`,
        {
          headers: {
            authorization: `Bearer ${AuthService.getCurrentUser().token}`,
          },
          data: obj,
        }
      );
      console.log("result : ", result);
      const sortedMeals = [];

      result.data.map((day) => {
        day.recipesofuser = day.recipesofuser.sort((a, b) => a.type - b.type);
        sortedMeals.push(day);
      });
      console.log("SORTED MEALS:", sortedMeals);
      setUserMeals(sortedMeals);
    } catch (err) {
      // clearUser(err);
    }
  };

  const fetchUserMeals = async (userID) => {
    try {
      const result = await axios.get(`http://localhost/api/meals/${userID}`);

      const sortedMeals = [];

      result.data.map((day) => {
        day.recipesofuser = day.recipesofuser.sort((a, b) => a.type - b.type);

        sortedMeals.push(day);
      });

      setUserMeals(sortedMeals);
    } catch (error) {
      console.log(error);
    }
  };

  const clearUser = (err) => {
    console.log("err", err);
    // On passe par la methode logout qui se trouve dans le fichier authservice
    // ca va removeitem dans le localstorage
    AuthService.logout();
    setUserMeals(undefined);
    navigate("/users/login");
  };

  return (
    <div className="app">
      <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route
          // key=
          path="/"
          element={<Register />}
        />

        <Route
          // key=
          path="/404"
          element={<NotFound />}
        />
        <Route
          // key=
          path="/users/register"
          element={<Register />}
        />
        <Route
          // key=
          path="/users/login"
          element={<Login addNewUserFunction={addNewUser} />}
        />

        <Route
          // key={profil}
          path="/profil/:slug"
          element={
            <Profil
              updateUserState={updateUserState}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />

        <Route
          // key={dashboard}
          path="users/dashboard"
          element={
            <Dashboard
              getUserMeals={createUserMeals}
              userMeals={userMeals}
              currentUser={currentUser}
            />
          }
        />

        <Route
          // key={recipe}
          path="/recipes/:slug"
          element={<Recipe />}
        />

        <Route key={Contact} path="/contact" element={<Contact />} />

        <Route key={Cgu} path="/cgu" element={<Cgu />} />

        <Route key={Faq} path="/faq" element={<Faq />} />

        <Route key={Team} path="/team" element={<Team />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}
// == Export
export default App;
