import { User } from "@interfaces/user"
import apiService from "@services/api"

export type LoginInput = {
  email: string
  password: string
}

type LoginResponse = {
  user: User
}

type OkResponse = LoginResponse

const authService = {
  async login(inputData: LoginInput) {
    const response = await apiService.post("/login", inputData)
    const data = response.data as LoginResponse
    return data.user
  },

  async logout() {
    await apiService.get("logout")
  },

  async ok() {
    const response = await apiService.get("/ok")
    const data = response.data as OkResponse
    return data.user
  },
}

export default authService
