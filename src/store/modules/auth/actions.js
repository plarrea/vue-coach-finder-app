const ACCOUNTS_URL = "https://identitytoolkit.googleapis.com/v1/accounts";
let logoutTimer;

export default {
  async login(context, payload) {
    return context.dispatch("auth", { ...payload, mode: "login" });
  },
  async signup(context, payload) {
    return context.dispatch("auth", { ...payload, mode: "signup" });
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

    const expiresIn = +responseData.expiresIn * 1000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem("token", responseData.idToken);
    localStorage.setItem("userId", responseData.localId);
    localStorage.setItem("tokenExpiration", expirationDate);

    logoutTimer = setTimeout(() => {
      context.dispatch("autoLogout");
    }, expiresIn);

    context.commit("setUser", {
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: expirationDate,
    });
  },
  tryLogin(context) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const expiresIn = +tokenExpiration - new Date().getTime();

    // less than 10 secs
    if (expiresIn < 10000) {
      return;
    }

    if (token && userId) {
      logoutTimer = setTimeout(() => {
        context.dispatch("autoLogout");
      }, expiresIn);

      context.commit("setUser", {
        token,
        userId,
        tokenExpiration,
      });
    }
  },
  logout(context) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");

    clearTimeout(logoutTimer);

    context.commit("setUser", {
      userId: null,
      token: null,
      tokenExpiration: null,
    });
  },
  autoLogout(context) {
    context.dispatch("logout");
    context.commit("setAutoLogout");
  },
};
