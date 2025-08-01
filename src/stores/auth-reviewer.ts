import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
  role_id: number;
  api_token: string;
  token: string;
  level: number;
}

export const useAuthReviewerStore = defineStore("auth-reviewer", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());
  const userData = localStorage.getItem("userData");
  const isAdmin = ref<boolean>(
    userData ? JSON.parse(userData)?.level === 1 : false
  );

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.token);
    console.log(user.value);
    isAdmin.value = user.value.level == 1 ? true : false;
    // JwtService.saveToken(user.value.api_token);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    isAdmin.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  async function login(credentials: User) {
    try {
      const { data } = await ApiService.post("reviewer/login", credentials);
      setAuth(data);
      localStorage.setItem("userData", JSON.stringify({ ...data, level: 3 }));
      localStorage.setItem("id_token", data.token);
    } catch ({ response }: any) {
      setError(response.data);
    }
  }


  function logout() {
    purgeAuth();
    localStorage.removeItem("userData");
    localStorage.removeItem("id_token");
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    // if (JwtService.getToken()) {
    //   ApiService.setHeader();
    //   ApiService.post("verify_token", { api_token: JwtService.getToken() })
    //     .then(({ data }) => {
    //       setAuth(data);
    //     })
    //     .catch(({ response }) => {
    //       setError(response.data.errors);
    //       purgeAuth();
    //     });
    // } else {
    //   purgeAuth();
    // }
  }

  return {
    errors,
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    forgotPassword,
    verifyAuth,
  };
});
