import { Formik, Form } from "formik"
import React from "react"
import { Link } from "react-router-dom"

import {
  FormikInputField,
  FormikPasswordInputField,
  Spacing,
} from "@components"
import {
  Typography,
  Button,
  Grid,
  Container,
  Link as MuiLink,
  CircularProgress,
} from "@material-ui/core"
import useStyles from "@pages/SignUp/styles"
import authService, { LoginInput } from "@services/auth"
import errorService from "@services/error"
import userService, { CreateUserInput } from "@services/user"
import { useUserStore } from "@stores/user"

const SignUp: React.FC = () => {
  const userStore = useUserStore()
  const classes = useStyles()

  async function handleLogin(loginData: LoginInput) {
    try {
      const user = await authService.login(loginData)

      userStore.setUser({
        email: user.email,
      })

      window.location.href = "/categories"
    } catch (err) {
      errorService.handle(err)
    }
  }

  async function handleSignUp(signUpData: CreateUserInput) {
    try {
      await userService.create(signUpData)

      handleLogin(signUpData)
      return
    } catch (err) {
      errorService.handle(err)
      const { message } = err.response.data
      return message as string
    }
  }

  return (
    <Container maxWidth="xs">
      <Spacing orientation="horizontal" size={10} />

      <Typography variant="h3">Sign up</Typography>

      <Spacing orientation="horizontal" size={1} />

      <Typography variant="h3" color="primary">
        Hippocards
      </Typography>

      <Spacing orientation="horizontal" size={12} />

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const message = await handleSignUp(values)

          if (message === "email_in_use") {
            return setErrors({
              email: "Email already in use",
            })
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container direction="column">
              <Grid item>
                <FormikInputField
                  name="email"
                  label="Email"
                  inputProps={{
                    type: "email",
                    required: true,
                    autoFocus: true,
                  }}
                />
              </Grid>

              <Spacing orientation="horizontal" size={3} />

              <Grid item>
                <FormikPasswordInputField
                  name="password"
                  label="Password"
                  inputProps={{
                    required: true,
                  }}
                />
              </Grid>

              <Spacing orientation="horizontal" size={6} />

              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                  endIcon={
                    isSubmitting && (
                      <CircularProgress size={16} style={{ color: "white" }} />
                    )
                  }
                >
                  sign up
                </Button>
              </Grid>

              <Spacing orientation="horizontal" size={1.5} />

              <Grid item className={classes.redirectLink}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <MuiLink component={Link} to="/login">
                    Log In
                  </MuiLink>
                </Typography>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default SignUp
