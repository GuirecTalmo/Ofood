import axios from "axios";
import propTypes from "prop-types";
import Form from "./Form";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

export default function Profil({
  currentUser,
  setCurrentUser,
  updateUserState,
}) {
  const navigate = useNavigate();

  const makeIMC = (height, weight) => {
    const imc = Math.round((weight * 10000) / (height * height));
    return imc;
  };

  const postProfilForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const obj = Object.fromEntries(formData);

    obj.intolerances = formData.getAll("intolerances");

    obj.weight = Number(obj.weight);
    obj.height = Number(obj.height);
    obj.imc = makeIMC(Number(obj.height), Number(obj.weight));

    const result = await axios({
      url: `http://localhost/api/users/${currentUser.id}`,
      method: "PATCH",
      data: obj,
    });

    setUser(result.data);

    navigate("/users/Dashboard");
  };

  const setUser = (newUser) => {
    setCurrentUser(newUser);
  };

  return (
    <div className="profile">
      <Form
        submitProfilForm={postProfilForm}
        currentUser={currentUser}
        updateUserState={updateUserState}
      />
    </div>
  );
}

Profil.propTypes = {
  currentUser: propTypes.object.isRequired,
  setCurrentUser: propTypes.func.isRequired,
};
