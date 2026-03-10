const ACCOUNTS_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

export default {
  async login(context, payload) {
    return context.dispatch("auth", { ...payload, mode: "login" });
  },
  async signup(context, payload) {
    return context.dispatch("auth", { ...payload, mode: "signup" });
  },
  logout(context) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    context.commit("setUser", {
      userId: null,
      token: null,
      tokenExpiration: null,
    });
  },
  async auth(context, payload) {
    const mode = payload.mode;
    const url = `${ACCOUNTS_URL}:${
      mode === "signup" ? "signUp" : "signInWithPassword"
    }?key=${process.env.VUE_APP_AUTH_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to login.");
    }

    const responseData = await response.json();
    localStorage.setItem("token", responseData.idToken);
    localStorage.setItem("userId", responseData.localId);

    context.commit("setUser", {
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: responseData.expiresIn,
    });
  },
  tryLogin(context) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      context.commit("setUser", {
        token,
        userId,
        tokenExpiration: null,
      });
    }
  },
};
