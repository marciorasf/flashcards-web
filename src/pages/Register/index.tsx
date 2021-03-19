import React, { useState, FormEvent, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";

import { Button, Link as MuiLink } from "@material-ui/core";

import { PageContent, MainContainer } from "../../assets/styles/global";
import CustomInput from "../../components/CustomInput";
import CustomPasswordInput from "../../components/CustomPasswordInput";
import Divider from "../../components/Divider";
import { Notify } from "../../hooks/Notify";
import api from "../../services/api";
import handleError from "../../services/error-handler";
import { Title, LinksContainer, Link } from "./styles";

const blankFormData = {
  email: "",
  password: "",
};

const ERRORS = {
  email_in_use: "Email already in use!",
};

export default function Register() {
  const [formData, setFormData] = useState(blankFormData);

  const history = useHistory();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await api.post("/user", formData);
      history.push("/login");
      Notify.success("Congratulations! Now you can log in.");
    } catch (error) {
      const errorCode = error?.response?.data?.message as "email_in_use";
      const errorMessage = ERRORS[errorCode];
      handleError(error, errorMessage);
    }
  }

  return (
    <PageContent>
      <MainContainer>
        <Title>
          <p>Register on</p>
          <p>Flashcards</p>
        </Title>

        <Divider height="5rem" />

        <form onSubmit={handleSubmit}>
          <CustomInput
            name="email"
            label="Email"
            onChange={handleInputChange}
            required
          ></CustomInput>

          <Divider height="2rem" />

          <CustomPasswordInput
            name="password"
            label="Password"
            minLength={8}
            onChange={handleInputChange}
            required
          ></CustomPasswordInput>

          <Divider height="1rem" />

          <LinksContainer>
            <MuiLink component={Link} color="secondary" to="/login">
              Already have an account?
            </MuiLink>
          </LinksContainer>

          <Divider height="3.0rem" />

          <Button
            color="secondary"
            fullWidth
            size="large"
            variant="contained"
            type="submit"
          >
            Register
          </Button>
        </form>
      </MainContainer>
    </PageContent>
  );
}
